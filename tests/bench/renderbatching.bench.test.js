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

  { // initialise the default shader
    let shader = GLStates.defaultShader;

    shader.vertSrc =
      `uniform mat4 vertView;
      uniform mat4 vertProj;

      attribute vec3 vertXYZ;
      attribute vec4 vertRGBA;
      attribute vec2 vertST;
      attribute vec4 vertFlags;

      // es 1.0
      attribute vec3 vertNormal;

      // es 3.0
      // attribute vec4 vertNormal;

      varying mediump vec4 fragRGBA;
      varying mediump vec2 fragST;

      varying mediump float fragTextured;
      varying mediump float fragLighting;

      varying mediump vec3 fragNormal;

      void main() {
        mat4 vp = vertProj * vertView;
        gl_Position = vp * vec4(vertXYZ, 1.0);
        
        fragRGBA = vertRGBA;
        fragST = vertST;

        fragTextured = vertFlags.x;
        fragLighting = vertFlags.y;

        fragNormal = vertNormal;
      }`;
    
    shader.fragSrc =
      `precision mediump float;

      uniform sampler2D fragBaseTex;

      varying mediump vec4 fragRGBA;
      varying mediump vec2 fragST;

      varying mediump float fragTextured;
      varying mediump float fragLighting;

      varying mediump vec3 fragNormal;

      void main() {
        vec4 texColor = clamp(texture2D(fragBaseTex, fragST) +
            (1.0 - fragTextured), 0.0, 1.0);
        gl_FragColor = texColor * vec4(fragRGBA.r, fragRGBA.g,
            fragRGBA.b, fragRGBA.a);

        float light = max(1.0 - fragLighting,
            dot(fragNormal, vec3(0.0, 0.0, 1.0)));
        gl_FragColor.rgb *= max(0.1, light);
      }`;
    
    shader.uniformLocations = {
      projectionMatrix : null,
      viewMatrix       : null,
      texture          : null,
    };

    shader.attributeLocations = {
      vertexPosition : null, // (3 4-byte)
      vertexColor    : null, // (4 1-byte)
      vertexTexture  : null, // (2 2-byte)
      vertexFlags    : null, // (4 1-byte)
      vertexNormal   : null, // (3 4-byte) es 1.0
      // vertexNormal: null // (1 4-byte) es 3.0
    };

    shader.renderCallback = function() {
      let byteSize = VBOVertex.byteSize;
      let offset = 0;

      if (this.attributeLocations.vertexPosition != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexPosition);
        GL.vertexAttribPointer(this.attributeLocations.vertexPosition,
            3, GL.FLOAT, false, byteSize, offset);
      }
      
      offset += 12;
      if (this.attributeLocations.vertexColor != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexColor);
        GL.vertexAttribPointer(this.attributeLocations.vertexColor,
            4, GL.UNSIGNED_BYTE, true, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexTexture != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexTexture);
        GL.vertexAttribPointer(this.attributeLocations.vertexTexture,
            2, GL.UNSIGNED_SHORT, true, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexFlags != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexFlags);
        GL.vertexAttribPointer(this.attributeLocations.vertexFlags,
            4, GL.UNSIGNED_BYTE, true, byteSize, offset);
      }
      
      offset += 4;
      // es 1.0
      if (this.attributeLocations.vertexNormal != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexNormal);
        GL.vertexAttribPointer(this.attributeLocations.vertexNormal,
            3, GL.FLOAT, true, byteSize, offset);
      }
      
      offset += 12;
      // es 3.0
      /* if (this.vertexNormal != -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexNormal);
        GL.vertexAttribPointer(this.attributeLocations.vertexNormal,
            4, GL.INT_2_10_10_10_REV, true, byteSize, offset);
      }
      
      offset += 4; */

      GL.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false,
        Float32Array.from(GLStates.projectionMatrix.arr));
      GL.uniformMatrix4fv(this.uniformLocations.viewMatrix, false,
        Float32Array.from(GLStates.viewMatrix.arr));
    }

    GLStates.defaultShader.compileAndLink();

    shader.compileAndLink();
    shader.useProgram();

    shader.uniformLocations.projectionMatrix =
      GL.getUniformLocation(shader.program, "vertProj");
    shader.uniformLocations.viewMatrix =
      GL.getUniformLocation(shader.program, "vertView");

    shader.uniformLocations.texture =
      GL.getUniformLocation(shader.program, "fragBaseTex");
    GL.uniform1i(shader.textureLocation, 0);
    
    shader.attributeLocations.vertexPosition =
      GL.getAttribLocation(shader.program, "vertXYZ");
    shader.attributeLocations.vertexColor =
      GL.getAttribLocation(shader.program, "vertRGBA");
    shader.attributeLocations.vertexTexture =
      GL.getAttribLocation(shader.program, "vertST");
    shader.attributeLocations.vertexFlags =
      GL.getAttribLocation(shader.program, "vertFlags");
    shader.attributeLocations.vertexNormal =
      GL.getAttribLocation(shader.program, "vertNormal");
  }

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
