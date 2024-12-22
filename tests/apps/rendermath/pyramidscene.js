import APP, {sol, GLStates, GL} from './init.js';

import Pyramid from './pyramid.js';
import UI from './ui.js';

class PyramidScene extends sol.Scene {
	constructor(name) {
		super(name);
    
    this.loaded  = false;
    this.initAudio = false;

    this.cam2D = new sol.Camera2D();
    this.cam3D = new sol.Camera3D();
    this.cam3D.lookAt(
      new sol.Vec3(0.0, 0.0,  200.0),
      new sol.Vec3(0.0, 0.0, -100.0),
      new sol.Vec3(0.0, 1.0,    0.0)
    );

    // the scale factor that allows perspective projection
    // to more accurately match the orthographic projection
    this.perspectiveScale = 0.001351;

    this.orthoMat = new sol.Mat4();
    this.perspMat = new sol.Mat4();
    this.#updateMatrices(new sol.Vec2(
       GL.canvas.clientWidth,
      GL.canvas.clientHeight
    ));

    this.pyramid = new Pyramid();
    this.ui = new UI();

    this.rb = new sol.RenderBatch();
    this.rb.setDepthSort(0, true);
    this.#updateBatch();
	}

  delete() {
    
  }

  render(pass) {
    GL.viewport(0, 0, APP.canvas.width, APP.canvas.height);
    
    switch (pass) {
      case 0 :
        GL.clearColor(0.25, 0.26, 0.3, 1.0);
        GL.clearDepth(1.0);
        GL.enable(GL.DEPTH_TEST);
        GL.depthFunc(GL.LEQUAL);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        if (this.ui.ortho) {
          GLStates.projectionMatrix.copy(this.orthoMat);
          GLStates.viewMatrix.copy(this.cam2D.view);
        } else {
          GLStates.projectionMatrix.copy(this.perspMat);
          GLStates.viewMatrix.copy(this.cam3D.view);
        }

        break;
      case 1 :
      default :
        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0.0, w, 0.0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();

        break;
    }

    this.rb.draw(pass);
    this.ui.render(pass);
	}
	
	input() {
    this.ui.input();
    this.pyramid.input();

    // disable overlay when pyramid is first grabbed
    if (this.ui.showOverlay) {
      const newTouches = APP.inputManager.getNewTouches();
      if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT) ||
        newTouches.length > 0) {

        if (this.pyramid.dragging) {
          this.ui.showOverlay = false;
        }
      }
    }

    // initiate audio on initial click or touch
    if (!this.initAudio) {
      const newTouches = APP.inputManager.getNewTouches();

      if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT) ||
        newTouches.length > 0) {

        APP.initAudio();
        this.initAudio = true;
      }
    }
	}
	
	process(dt) {
    this.ui.process(dt);
    this.pyramid.process(dt);
	}
	
	postProcess(dt, count) {
    let projMat = new sol.Mat4();
    if (this.ui.ortho) {
      projMat.multMat4(this.orthoMat);
      projMat.multMat4(this.cam2D.view);

      this.pyramid.mask.matrix = projMat;
    } else {
      projMat.multMat4(this.perspMat);
      projMat.multMat4(this.cam3D.view);
      
      this.pyramid.mask.matrix = projMat;
    }

    this.ui.postProcess(dt, count);
    this.pyramid.postProcess(dt, count);

		this.#updateBatch();
	}

  handleEventQueue(event) {
    switch(event.getType()) {
      case sol.enums.Event.SIZE :
        this.#updateMatrices(event.newDimensions);
        break;
      default :
    }

    this.ui.handleEventQueue(event);
  }

  onEnter(loaded) {
    
  }

  onLeave(saved) {

  }
  
  #updateBatch() {
    this.rb.add(this.pyramid.vertBatch, 0);
    this.rb.add(this.pyramid.mask.shape, 1);

    this.rb.upload();
  }

  #updateMatrices(dimensions) {
    const w = dimensions.x;
    const h = dimensions.y;
    const ps = this.perspectiveScale;

    this.orthoMat.ortho(
      -w * 0.5, w * 0.5,
      -h * 0.5, h * 0.5,
      1.0, 1000.0
    );

    this.perspMat.frustum(
      -w * ps, w * ps,
      -h * ps, h * ps,
      1.0, 1000.0
    );
  }
};

export default PyramidScene;
