import GL, {glSetContext} from './gl.js'
import GLStates from './glstates.js'
import EngineError from './error.js';
import EventQueue from './eventqueue.js';
import * as enums from './exportenums.js';
import InputManager from './inputmanager.js';
import ResourceManager from './resourcemanager.js';
import SceneManager from './scenemanager.js';
import Timer from './timer.js';
import Vec2 from './vec2.js';

import OrientationEvent from './events/orientationevent.js';
import SizeEvent from './events/sizeevent.js';

class App {
  constructor() {
    this.canvas = null;
    this.context = null;

    this.canvasPos = new Vec2(0.0, 0.0);
    this.canvasSize = new Vec2(0.0, 0.0);

    this.resourceManager = new ResourceManager();
    this.inputManager = new InputManager();
    this.sceneManager = new SceneManager();

    this.frameTimer = new Timer();
    this.frameLimit = 0.02;
    this.frameSkip = true;
    this.frameMax = 15;

    this.renderPasses = 1;

    this.eventQueue = new EventQueue();
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

    this.inputManager.register(this);

    if (screen.orientation) {
      screen.orientation.addEventListener("change",
          (e) => {this.eventQueue.push(new OrientationEvent());},
          true);
    }

    this.frameTimer.reset();
  }

  delete() {
    GLStates.defaultShader.delete();
    this.sceneManager.delete();
  }

  run() {
    if (this.updateCanvas()) {
      this.eventQueue.push(new SizeEvent());
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

    if (this.canvasSize.x != GL.canvas.clientWidth ||
        this.canvasSize.y != GL.canvas.clientHeight) {
      
      this.canvasSize.x = GL.canvas.clientWidth;
      this.canvasSize.y = GL.canvas.clientHeight;

      this.canvas.width = this.canvasSize.x;
      this.canvas.height = this.canvasSize.y;

      GL.viewport(0, 0, this.canvas.width, this.canvas.height);

      return true;
    }

    return false;
  }

  handleEvent(e) {
    switch(e.type) {
      default :
        break;
    }

    if (this.sceneManager.currentExists()) {
      this.sceneManager.getCurrent().handleEventQueue(e);
    }
  }
};

export default App;
