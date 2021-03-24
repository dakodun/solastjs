import GL, {glSetContext} from './gl.js'
import GLStates from './glstates.js'

import EngineError from './error.js';
import ResourceManager from './resourcemanager.js';
import SceneManager from './scenemanager.js';
import Timer from './timer.js';

class App {
  constructor() {
    this.canvas = null;
    this.context = null;

    this.resourceManager = new ResourceManager();
    this.sceneManager = new SceneManager();

    this.frameTimer = new Timer();
    this.frameLimit = 0.02;
    this.frameSkip = true;
    this.frameMax = 15;

    this.renderPasses = 1;
  }
  
  init(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("webgl");
    if (!this.context) {
      throw new EngineError("ee: unable to create webGL context");
    }

    glSetContext(this.context);
    GL.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.createDefaultShader();

    this.frameTimer.reset();
  }

  delete() {
    GLStates.defaultShader.delete();
    this.sceneManager.delete();
  }

  run() {
    // ONLY UPDATE WHEN NECESSARY
    // STORE CURRENT CANVAS AND CHECK IF DIFF
    // IF SO FIRE EVENT AND UPDATE STORED
    this.canvas.width = GL.canvas.clientWidth;
    this.canvas.height = GL.canvas.clientHeight;
    GL.viewport(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.renderPasses; ++i) {
			this.render(i);
		}
    
    this.input();
    // input manager

    let frameTime = this.frameTimer.getElapsed() / 1000;
    this.frameTimer.reset();

    if (frameTime > this.frameLimit) {
      let framesProcessed = 0;
      let frameAccum = frameTime;
      while (frameAccum >= this.frameLimit) {
        this.process(this.frameLimit);
        ++framesProcessed;
        frameAccum -= this.frameLimit;

        if (this.frameSkip || framesProcessed >= this.frameMax) {
          break;
        }

        if (this.sceneManager.nextExists()) {
          break;
        }
      }

      this.postProcess(frameTime, framesProcessed);
    }
    else {
      this.process(frameTime);
      this.postProcess(frameTime, 1);
    }
    
    if (this.sceneManager.change()) {
      this.frameTimer.reset();
    }

    requestAnimationFrame((timestamp) => {this.run();});
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

  createDefaultShader() {
    GLStates.defaultShader.setVertexSrc();
    GLStates.defaultShader.setFragmentSrc();
    GLStates.defaultShader.linkProgram();
    GLStates.defaultShader.initCallback();
  }
};

export default App;
