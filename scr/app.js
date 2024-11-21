import AC, {acSetContext} from './ac.js'
import GL, {glSetContext} from './gl.js'
import GLStates from './glstates.js'
import SolError from './solerror.js';
import EventQueue from './eventqueue.js';
import InputManager from './inputmanager.js';
import ResourceManager from './resourcemanager.js';
import ResourceLoader from './resourceloader.js';
import SceneManager from './scenemanager.js';
import Timer from './timer.js';
import VBOVertex from './vbovertex.js';
import Vec2 from './vec2.js';

import OrientationEvent from './events/orientationevent.js';
import SizeEvent from './events/sizeevent.js';

class App {
  constructor() {
    this.canvas = null;
    this.context = null;

    this.canvasPos = new Vec2(0.0, 0.0);

    this.resourceManager = new ResourceManager();
    this.inputManager = new InputManager();
    this.sceneManager = new SceneManager();

    this.resourceLoader = new ResourceLoader();

    this.frameTimer = new Timer();
    this.frameLimit = 0.02;
    this.frameSkip = true;
    this.frameMax = 15;

    this.renderPasses = 1;

    this.eventQueue = new EventQueue();

    this.fillParent = true;
  }
  
  init(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("webgl2", {alpha: false});
    if (!this.context) {
      throw new SolError("unable to create webGL context");
    }

    glSetContext(this.context);
    GL.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.#createDefaultShader();

    this.inputManager.register(this);

    if (screen.orientation) {
      screen.orientation.addEventListener("change",
          (e) => {this.eventQueue.push(new OrientationEvent());},
          true);
    }

    this.updateCanvas();
    this.frameTimer.reset();
  }

  // needs to be called seperately from other init upon a user input
  initAudio() {
    acSetContext(new AudioContext());
  }

  delete() {
    GLStates.defaultShader.delete();
    this.sceneManager.delete();
  }

  run() {
    let updateCanvas = this.updateCanvas();
    if (updateCanvas[0]) {
      let sizeEvent = new SizeEvent(
        new Vec2(this.canvas.width, this.canvas.height),
        new Vec2(  updateCanvas[1],    updateCanvas[2])
      );

      this.canvas.width  = updateCanvas[1];
      this.canvas.height = updateCanvas[2];

      this.eventQueue.push(sizeEvent);
    }

    while (!this.eventQueue.empty()) {
      let e = this.eventQueue.get();
      this.handleEvent(e);
      this.eventQueue.pop();
    }

    for (let i = 0; i < this.renderPasses; ++i) {
			this.render(i);
		}
    
    this.input();
    this.inputManager.process();

    let frameTime = this.frameTimer.getElapsed() / 1000;
    this.frameTimer.reset();

    if (frameTime > this.frameLimit) {
      let framesProcessed = 0;
      let frameAccum = frameTime;

      while (frameAccum >= this.frameLimit) {
        this.process(this.frameLimit);
        ++framesProcessed;
        frameAccum -= this.frameLimit;

        if (this.frameSkip || framesProcessed >= this.frameMax) { break; }
        
        if (this.sceneManager.nextExists()) { break; }
      }

      this.postProcess(frameTime, framesProcessed);
    } else {
      this.process(frameTime);
      this.postProcess(frameTime, 1);
    }
    
    if (this.sceneManager.change()) {
      this.frameTimer.reset();
    }

    requestAnimationFrame(() => {this.run();});
  }

  render(pass) {
    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().render(pass);
    }

    GL.flush();
  }

  input() {
    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().input();
    }
  }

  process(dt) {
    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().process(dt);
    }
  }

  postProcess(dt, count) {
    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().postProcess(dt, count);
    }
  }

  updateCanvas() {
    let element = this.canvas;
    let offset = new Vec2(0.0, 0.0);
    if (element.offsetParent) {
      do {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
      } while (element = element.offsetParent);
      
      this.canvasPos.x = offset.x; this.canvasPos.y = offset.y;
    }

    if (this.fillParent && this.canvas.parentNode) {
      let rect = this.canvas.parentNode.getBoundingClientRect();
      let width = Math.trunc(rect.width);
      let height = Math.trunc(rect.height);

      if (width != this.canvas.width || height != this.canvas.height) {
        return [true, width, height];
      }
    }

    return [false];
  }

  handleEvent(e) {
    switch(e.getType()) {
      default :
        break;
    }

    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().handleEventQueue(e);
    }
  }

  #createDefaultShader() {
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
};

export default App;
