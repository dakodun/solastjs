import APP, { sol, GLStates, GL } from './init.js';

import Background from './background.js';
import EntityMegaBatman from './entitymegabatman.js';
import EntitySuperBatman from './entitysuperbatman.js';
import ModelBuilding from './modelbuilding.js';
import PickShader from './pickshader.js';
import UIButton from './uibutton.js';
import UIText from './uitext.js';

class ConvoScene extends sol.Scene {
  pickShader = new PickShader();

  listEnt = new Array();
  activeEnt = {
    entity: null,
    index: -1,
  }

  uiText = null;

  uiButtons = [];
  uiFSButton = null;
  uiDButton = null;
  uiCButton = null;
  shpUIBar = new sol.Shape();

  touch = null;

	constructor(name) {
		super(name);

    // create and initialise the projection and
    // view matrices

    this._projection = new sol.Mat4();
    this._updateProjection();

    this.cam3DFar = new sol.Camera3D();
    this.cam3DFar.lookAt(
      new sol.Vec3(0.0, 80.0,    0.0),
      new sol.Vec3(0.0,  0.0, -200.0),
      new sol.Vec3(0.0,  1.0,    0.0)
    );

    this.cam3DNear = new sol.Camera3D();
    this.cam3DNear.lookAt(
      new sol.Vec3(0.0, 60.0,  -60.0),
      new sol.Vec3(0.0,  0.0, -300.0),
      new sol.Vec3(0.0,  1.0,    0.0)
    );

    this.cam3D = this.cam3DFar;
    
    //

    let fntStore = APP.resourceManager.getStore("font");
    let afnt = fntStore.getResource("jersey");
    this.uiText = new UIText(afnt);

    this.uiText._renderMsg.font = afnt;
    this.uiText._actCallback = this._handleAction.bind(this);

    // create ui buttons and an alias object that returns
    // the appropriate button depending on current state,
    // whilst performing the appropriate callback (func)

    let uiFSEnter = new UIButton(48, 48, "uiFullscreenEnter");
      uiFSEnter.position = new sol.Vec2(24, 8);
      uiFSEnter.tooltip = "Enter Fullscreen";
    let uiFSExit  = new UIButton(48, 48,  "uiFullscreenExit");
      uiFSExit.position = new sol.Vec2(24, 8);
      uiFSExit.tooltip = "Exit Fullscreen";
    this.uiFSButton = {
      state: 0,
      ele: [ uiFSEnter, uiFSExit ],
      func(scene) {
        APP.toggleFullscreen();
      }
    }

    let uiDEnter = new UIButton(48, 48, "uiDebugEnter");
      uiDEnter.position = new sol.Vec2(78, 8);
      uiDEnter.tooltip = "Enable Debug";
    let uiDExit  = new UIButton(48, 48,  "uiDebugExit");
      uiDExit.position  = new sol.Vec2(78, 8);
      uiDExit.tooltip = "Disable Debug";
    this.uiDButton = {
      state: 0,
      ele: [ uiDEnter, uiDExit ],
      func(scene) {
        scene._dbgRenderPick = !scene._dbgRenderPick;
        if (scene._dbgRenderPick === true) {
          this.state = 1;
        } else {
          this.state = 0;
        }
      }
    }

    let uiCFar  = new UIButton(48, 48, "uiCameraFar");
      uiCFar.position  = new sol.Vec2(132, 8);
      uiCFar.tooltip = "Zoom Camera In";
    let uiCNear = new UIButton(48, 48,  "uiCameraNear");
      uiCNear.position = new sol.Vec2(132, 8);
      uiCNear.tooltip = "Zoom Camera Out";
    this.uiCButton = {
      state: 0,
      ele: [ uiCFar, uiCNear ],
      func(scene) {
        scene._dbgCameraZoom = !scene._dbgCameraZoom;
        if (scene._dbgCameraZoom === true) {
          this.state = 1;
          scene.cam3D = scene.cam3DNear;
          scene._positionBatmen();
        } else {
          this.state = 0;
          scene.cam3D = scene.cam3DFar;
          scene._positionBatmen();
        }
      }
    }

    this.uiButtons.push(this.uiFSButton);
    this.uiButtons.push(this.uiDButton);
    this.uiButtons.push(this.uiCButton);

    // create a circle and use the verts to create
    // a rounded bar behind the ui buttons

    let shpCircle = new sol.Shape();
    shpCircle.makeCircle(26, 36);
    let verts = shpCircle.verts;

    for (let i = 9; i < 28; ++i) {
      this.shpUIBar.pushVert(verts[i]);
    }
    
    for (let i = 27; i !== 10; i = (i + 1) % verts.length) {
      this.shpUIBar.pushVert(
        new sol.Vec2(verts[i].x + 140, verts[i].y)
      );
    }

    this.shpUIBar.color = new sol.Vec3(0, 0, 0);
    this.shpUIBar.alpha = 200;
    this.shpUIBar.position = new sol.Vec2(32, 32)
    this.shpUIBar.depth = -3;

    this.batchUI = new sol.RenderBatch();
    this.batchUI.setDepthSort(0, true);
    this._updateUIBatch();

    // create and set up the frame buffer that will
    // be rendered to and create the batch

    this.pickBuffer = new sol.FrameBuffer();
    this._resizeFrameBuffer();

    this.batchEnt = new sol.RenderBatch();
    this.entitySuperBatman = new EntitySuperBatman();
    this.entityMegaBatman = new EntityMegaBatman();
    this._positionBatmen();
    this._updateEntityBatch();

    this.listEnt.push(this.entitySuperBatman);
    this.listEnt.push(this.entityMegaBatman);

    this.batchStatic = new sol.RenderBatch();
    this.modelBuilding = new ModelBuilding();
    this.modelBuilding.addToBatch(this);

    this.background = new Background();
    this.background.addToBatch(this);
    this.batchStatic.upload();

    //

    this._dbgRenderPick = false;
    this._dbgCameraZoom = false;
	}

  delete() {
    
  }

  render(pass) {
    GL.viewport(0, 0, APP.canvas.width, APP.canvas.height);
    
    switch (pass) {
      case 0 : {
        GL.clearColor(0.03, 0.03, 0.05, 1.0);
        GL.clearDepth(1.0);
        GL.disable(GL.DEPTH_TEST);
        GL.depthFunc(GL.LEQUAL);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        // start with an orthographic projection to
        // render the backdrop without writing to the
        // depth buffer

        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0.0, w, 0.0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();
        this.batchStatic.draw(1);

        // re-enable depth buffer and render the the
        // rest of the scene

        GL.enable(GL.DEPTH_TEST);

        GLStates.projectionMatrix.copy(this._projection);
        GLStates.viewMatrix.copy(this.cam3D.view);
        
        this.batchStatic.draw(pass);
        this.batchEnt.draw();

        break;
      } case 1 : {
        // render the batch containing the render data
        // for used for picking to the pick framebuffer
        // (unless debug mode is set)

        if (this._dbgRenderPick === false) {
          GL.bindFramebuffer(GL.FRAMEBUFFER, this.pickBuffer.frameBuffer);
          
          GL.clearColor(0.0, 0.0, 0.0, 0.0);
          GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        }

        this.batchEnt.draw(pass);

        GL.bindFramebuffer(GL.FRAMEBUFFER, null);

        // before we draw the ui we need to switch to an
        // orthographic projection and reset the view to
        // default

        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0.0, w, 0.0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();

        this.batchUI.draw();

        break;
      } default : {
        break;
      }
    }
	}
	
	input() {
    // deal with user input in a hierarchical manner
    // (that is, a UI button click prevents other
    // elements processing input)

    this.uiButtons.forEach((e) => {
      e.ele[e.state].input();
    });

    let bubble = true;
    for (let but of this.uiButtons) {
      if (but.ele[but.state].wasClicked === true) {
        but.func(this);
        bubble = false;

        break;
      } else if (but.ele[but.state].isHovering === true) {
        bubble = false;
      }
    }

    if (bubble === true) {
      // if input tracking is to bubble (i.e., we're not
      // interacting with ui buttons)

      this._handlePickingInput();
    }
	}
	
	process(dt) {
    this.entitySuperBatman.process(dt);
    this.entityMegaBatman.process(dt);
    this._updateEntityBatch();

    // 

    this.uiText._renderMsg.process(dt);
    this.uiButtons.forEach((e) => {
      e.ele[e.state].process(dt);
    });

    this.batchUI.vbo.addData(0, 0);
    this._updateUIBatch();
	}
	
	postProcess(dt, count) {

	}

  handleEventQueue(event) {
    switch(event.getType()) {
      case sol.enums.Event.SIZE : {
        this._updateProjection();

        this._positionBatmen();
        this._updateEntityBatch();
        this._resizeFrameBuffer();

        this._resizeUI(event.newDimensions);
        this._updateUIBatch();
        
        this.background.onResize();
        this.modelBuilding.addToBatch(this);
        this.background.addToBatch(this);
        this.batchStatic.upload();

        break; 
      } case sol.enums.Event.FULLSCREEN : {
        if (event.status === sol.FullscreenEvent.Status.ENTER) {
          this.uiFSButton.state = 1;
        } else {
          this.uiFSButton.state = 0;
        }

        break; 
      } default : {
        break;
      }
    }
  }

  onEnter(loaded) {
    
  }

  onLeave(saved) {
    
  }

  startScript(script) {
    this.listEnt.splice(0, 0, this.uiText);
    this.uiText.startScript(script);
  }

  //> internal methods //
  _updateProjection() {
    const ps = 0.001;
    const w = (APP.canvas.clientWidth * ps);
    const h = 2 * (APP.canvas.clientHeight * ps);

    this._projection.frustum(
      -w, w, 0, h, 1.0, 1025.0
    );
  }

  _resizeFrameBuffer() {
    this.pickBuffer.delete();

    // create a blank imageData object of the required
    // dimensions and use it as the source for the
    // texture (don't need to store the texture)

    let w =  APP.canvas.clientWidth;
    let h = APP.canvas.clientHeight;
    let imageData = new ImageData(w, h);

    let tex = new sol.Texture();
    tex.create([imageData]);

    this.pickBuffer.attachTexture(tex, GL.COLOR_ATTACHMENT0, 0);
  }

  _positionBatmen() {
    // reposition batman entities (usually on context resize)

    this.entitySuperBatman.onResize(this.cam3D, this._projection);
    this.entityMegaBatman.onResize(this.cam3D, this._projection);
  }

  _updateEntityBatch() {
    // update the entity batch
    
    this.entitySuperBatman.addToBatch(this.batchEnt, this.pickShader);
    this.entityMegaBatman.addToBatch(this.batchEnt, this.pickShader);

    this.batchEnt.upload();
  }

  _resizeUI(dimensions) {
    this.uiText.resize(dimensions.x);
    this.uiButtons.forEach((e) => {
      e.ele.forEach((ee) => { ee.resize(dimensions); });
    });
  }

  _updateUIBatch() {
    // update the ui batch
    
    this.batchUI.vbo.addData(0, 0);

    this.uiText.addToBatch(this.batchUI);
    this.batchUI.add(this.shpUIBar);
    this.uiButtons.forEach((e) => {
      e.ele[e.state].addToBatch(this.batchUI);
    });

    this.batchUI.upload();
  }

  _getPickPixel(point) {
    // on a left click get the current pixel at the
    // mouse position from the pick framebuffer
    // (unless debug mode is set)

    let pixels = new Uint8Array(4);

    if (this._dbgRenderPick === false) {
      GL.bindFramebuffer(GL.FRAMEBUFFER, this.pickBuffer.frameBuffer);
    }

    GL.readPixels(point.x, point.y, 1, 1,
      GL.RGBA, GL.UNSIGNED_BYTE, pixels);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    return new sol.Vec3(pixels[0], pixels[1], pixels[2]);
  }

  _handlePickingInput() {
    // handle the input logic (mouse and touch) relating
    // to selecting entities via pixel colour picking

    // mouse
    if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT)) {
      const mouse = APP.inputManager.getLocalMouse();
      let pixelColor = this._getPickPixel(mouse);

      // loop through all entitites (in order) until we find
      // one with a pick colour that matches the current pixel

      for (let i = 0; i < this.listEnt.length; ++i) {
        let entity = this.listEnt[i];

        if (entity.onSelect(this, pixelColor) === true) {
          // set it as the current active entity and
          // stop looking

          this.activeEnt.entity = entity;
          this.activeEnt.index = i;

          break;
        }
      }
    }

    if (APP.inputManager.getMouseReleased(sol.enums.Mouse.LEFT)) {
      const mouse = APP.inputManager.getLocalMouse();
      let pixelColor = this._getPickPixel(mouse);

      // if we have an active entity (from mouse pressed) then
      // call its onActive method and unset it

      if (this.activeEnt.entity !== null) {
        this.activeEnt.entity.onActive(this, pixelColor);

        this.activeEnt.entity = null;
        this.activeEnt.index = -1;
      }
    }

    // touch
    if (this.touch === null) {
      const newTouches = APP.inputManager.getNewTouches();
      if (newTouches.length > 0) {
        this.touch = newTouches[0];

        const finger = APP.inputManager.getLocalTouch(this.touch);
        let pixelColor = this._getPickPixel(finger);
        for (let i = 0; i < this.listEnt.length; ++i) {
          let entity = this.listEnt[i];

          if (entity.onSelect(this, pixelColor) === true) {
            this.activeEnt.entity = entity;
            this.activeEnt.index = i;

            break;
          }
        }
      }
    } else {
      if (APP.inputManager.getTouchEnd(this.touch)) {
        const finger = APP.inputManager.getLocalTouch(this.touch);
        let pixelColor = this._getPickPixel(finger);
        if (this.activeEnt.entity !== null) {
          this.activeEnt.entity.onActive(this, pixelColor);

          this.activeEnt.entity = null;
          this.activeEnt.index = -1;
        }

        this.touch = null;
      } else if (APP.inputManager.getTouchCancel(this.touch)) {
        this.touch = null;
      }
    }
  }

  _handleAction(action) {
    // 

    switch (action) {
      case "kick" : {
        this.entitySuperBatman.setAnimation("kick");

        break;
      } case "defend" : {
        this.entityMegaBatman.setAnimation("defend");

        break;
      } default : {
        break;
      }
    }
  }

  //> static internal methods //
  static _unproject(screenPos, view, proj) {
    // take a 2-dimensional point screenPos and convert
    // it from screen space to world space

    let projView = proj.getCopy();
    projView.multMat4(view);

    let det = projView.getDeterminant();
    if (det !== 0) {
      let invDet = 1 / det;
      let inverse = projView.getAdjoint();
      inverse.arr.forEach((e, i, a) => { a[i] = e * invDet; } );

      const w =  APP.canvas.clientWidth * 0.5;
      const h = APP.canvas.clientHeight * 0.5;

      let near = new sol.Vec4(
        (screenPos.x - w) / w,
        (screenPos.y - h) / h,
        -1.0,
        1.0
      );

      let far = new sol.Vec4(near.x, near.y, 1, 1.0);
      
      near = (inverse.getMultVec4(near));
      far  = (inverse.getMultVec4( far));
      
      near.x /= near.w;
      near.y /= near.w;
      near.z /= near.w;

      far.x /= far.w;
      far.y /= far.w;
      far.z /= far.w;

      return { n: near, f: far }
    }
  }

  static _segmentPlane(vA, vB, pC, pN) {
    // find the point of collision (if any) between
    // an infinite plane (given by a centre point pC
    // and a normal pN) and the line segment between
    // vA and vB

    let u = new sol.Vec3(vB.x - vA.x, vB.y - vA.y, vB.z - vA.z);
    let w = new sol.Vec3(vA.x - pC.x, vA.y - pC.y, vA.z - pC.z);

    let d = pN.getDot(u);
    let n = -1 * pN.getDot(w);

    if (Math.abs(d) < Number.EPSILON) {
      if (n === 0) {
        return { intersects: true, point: vA.getCopy() }
      } else {
        return { intersects: false, point: new sol.Vec3() }
      }
    }

    let si = n / d;
    if (si < 0 || si > 1) {
      return { intersects: false, point: new sol.Vec3() }    
    }

    u.xyz = [u.x * si, u.y * si, u.z * si];
    let result = new sol.Vec3(vA.x + u.x, vA.y + u.y, vA.z + u.z);

    return { intersects: true, point: result }
  }
};

export default ConvoScene;
