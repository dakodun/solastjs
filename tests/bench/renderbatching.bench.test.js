import { bench, describe } from 'vitest'

import GL, {glSetContext} from '../../scr/gl.js'
import GLStates from '../../scr/glstates.js'

import RenderBatch from '../../scr/renderbatch.js';
import Shape from '../../scr/shape.js';
import Vec2 from '../../scr/vec2.js';

describe("render batching", () => {
  /*
  .------------------------------------------------------------------.
  | test the following effects on render speed:                      |
  |                                                                  |
  |   dynamic vs static: a dynamic render batch must be re-created   |
  |     multiple times (in this case every frame) - a static render  |
  |     batch is only created once                                   |
  |                                                                  |
  |   depth sorting vs no depth sorting: depth sorting requires      |
  |     renderable objects to be rendered in the correct depth order |
  |     which will disable the ability to batch them according to    |
  |     other attributes                                             |
  |                                                                  |
  |   100 vs 1000: more renderables means more data to sort, pass to |
  |     vbo and render to webgl context                              |
  '------------------------------------------------------------------'
  */

  // create a canvas and get a webgl2 context from it
  let canvas = document.createElement('canvas');
  let context = canvas.getContext("webgl2", {alpha: false});
  glSetContext(context);

  // initialise the default shader
  GLStates.defaultShader.setVertexSrc();
  GLStates.defaultShader.setFragmentSrc();
  GLStates.defaultShader.linkProgram();
  GLStates.defaultShader.initCallback();

  // helper function to populate a render batch
  function createBatch(rb, x, y) {
    rb.setDepthSort(0, y);

    for (let i = 0; i < x; ++i) {
      let shp = new Shape();
      shp.pushVert(new Vec2( 0.0,  0.0));
      shp.pushVert(new Vec2(10.0,  0.0));
      shp.pushVert(new Vec2( 5.0, 10.0));
      shp.depth = -10 * i;
      shp.renderMode = 1 + (3 * (i % 2));

      rb.add(shp);
    }

    rb.upload();
  }

  // helper function to render a render batch to a context
  function drawBatch(rb) {
    GL.viewport(0, 0, canvas.width, canvas.height);

    GL.clearDepth(1.0);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GLStates.projectionMatrix.ortho(0.0, GL.canvas.clientWidth,
      0.0, GL.canvas.clientHeight, 0.1, 1000.0);
    GLStates.viewMatrix.identity();
    
    rb.draw();
    
    GL.flush();
  }

  // a static render batch is only created once
  let staticrb = new RenderBatch();
  
  bench('100 shapes without depth sorting, dynamic render batch', () => {
    let rb = new RenderBatch();
    createBatch(rb, 100, false);
    drawBatch(rb);
  }, {time: 1000, iterations: 100});

  bench('100 shapes with depth sorting, dynamic render batch', () => {
    let rb = new RenderBatch();
    createBatch(rb, 100, true);
    drawBatch(rb);
  }, {time: 1000, iterations: 100});

  createBatch(staticrb, 100, false);
  bench('100 shapes without depth sorting, static render batch', () => {
    drawBatch(staticrb);
  }, {time: 1000, iterations: 100});

  createBatch(staticrb, 100, true);
  bench('100 shapes with depth sorting, static render batch', () => {
    drawBatch(staticrb);
  }, {time: 1000, iterations: 100});


  bench('1000 shapes without depth sorting, dynamic render batch', () => {
    let rb = new RenderBatch();
    createBatch(rb, 1000, false);
    drawBatch(rb);
  }, {time: 1000, iterations: 100});

  bench('1000 shapes with depth sorting, dynamic render batch', () => {
    let rb = new RenderBatch();
    createBatch(rb, 1000, true);
    drawBatch(rb);
  }, {time: 1000, iterations: 100});

  createBatch(staticrb, 1000, false);
  bench('1000 shapes without depth sorting, static render batch', () => {
    drawBatch(staticrb);
  }, {time: 1000, iterations: 100});

  createBatch(staticrb, 1000, true);
  bench('1000 shapes with depth sorting, static render batch', () => {
    drawBatch(staticrb);
  }, {time: 1000, iterations: 100});
});
