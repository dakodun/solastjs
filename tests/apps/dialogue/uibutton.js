import APP, { sol, GLStates, GL } from './init.js';

class UIButton {
  _shp = new sol.Shape();
  _colors = {
    inactive : new sol.Vec4(170, 170, 170, 180),
    hover    : new sol.Vec4(200, 200, 255, 255),
    active   : new sol.Vec4(80, 80, 130, 255)
  }

  _touch = null;
  _hover = false;
  _active = false;
  _clicked = false;

  _rsTooltip = new sol.RenderString();

  constructor(width = 1, height = width, textureID = "") {
    this._shp.pushVerts([
      new sol.Vec2(    0,      0),
      new sol.Vec2(width,      0),
      new sol.Vec2(width, height),
      new sol.Vec2(    0, height)
    ]);

    let texStore = APP.resourceManager.getStore("texture");
    let tex = texStore.getResource(textureID);
    this._shp.pushFrame(tex, 0);

    this._shp.color = this._colors.hover.xyz;
    this._shp.alpha = this._colors.hover.w;
    this._shp.depth = -2;

    //

    let fntStore = APP.resourceManager.getStore("font");
    let afnt = fntStore.getResource("jersey");
    this._rsTooltip.font = afnt;
    this._rsTooltip.letterSpacing = 4;
    this._rsTooltip.depth = -1;
    this.resize(new sol.Vec2(
      APP.canvas.clientWidth,
      APP.canvas.clientHeight
    ));
  }

  get wasClicked() { return this._clicked; }
  get isHovering() { return this._hover;   }

  set position(position) {
    this._shp.position = position;
  }

  set tooltip(tooltip) {
    this._rsTooltip.text = tooltip;
    this._rsTooltip.origin = new sol.Vec2(
      this._rsTooltip.width * 0.5,
      this._rsTooltip.height + 8
    );
  }

  static loadResources() {
    let images = [
      { id: "uiFullscreenEnter", src: "res/ui_fullscreen_enter.png",
        width: 24, height: 24 },
      { id: "uiFullscreenExit", src: "res/ui_fullscreen_exit.png",
        width: 24, height: 24 },

      { id: "uiDebugEnter", src: "res/ui_debug_enter.png",
        width: 24, height: 24 },
      { id: "uiDebugExit", src: "res/ui_debug_exit.png",
        width: 24, height: 24 },

      { id: "uiCameraNear", src: "res/ui_camera_near.png",
        width: 24, height: 24 },
      { id: "uiCameraFar", src: "res/ui_camera_far.png",
        width: 24, height: 24 },
    ];

    // get the texture store if it already exists (otherwise
    // create it first)

    let texStore = APP.resourceManager.getStore("texture");
    if (texStore === undefined) {
      texStore = APP.resourceManager.addStore("texture");
    }

    for (const img of images) {
      // if the current texture doesn't already exist then
      // load the image file from src and when finished
      // create a texture from it and add it to the store

      let tex = texStore.getResource(img.id);

      if (tex === undefined) {
        APP.resourceLoader.loadImage(img.src, img.width, img.height)
        .then((response) => {
          tex = texStore.addResource(img.id, new sol.Texture());
          tex.create([response]);
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
  }

  input() {
    // mouse controls
    if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT)) {
      if (this._hover === true) {
        this._active = true;
      }
    }

    if (APP.inputManager.getMouseReleased(sol.enums.Mouse.LEFT)) {
      if (this._hover === true && this._active === true) {
        this._clicked = true;
      }

      this._active = false;
    }

    // touch controls
    if (this._touch === null) {
      const newTouches = APP.inputManager.getNewTouches();
      if (newTouches.length > 0) {
        this._touch = newTouches[0];
        
        const finger = APP.inputManager.getLocalTouch(this._touch);
        if (this._pointInside(finger)) {
          this._active = true;
        }
      }
    } else {
      if (APP.inputManager.getTouchEnd(this._touch)) {
        if (this._hover === true && this._active === true) {
          this._clicked = true;
        }
        
        this._active = false;
        this._touch = null;
      } else if (APP.inputManager.getTouchCancel(this._touch)) {
        this._active = false;
        this._touch = null;
      }
    }
  }

  process(dt) {
    const mouse = APP.inputManager.getLocalMouse();
    if (this._pointInside(mouse)) {
      this._hover = true;
    } else {
      this._hover = false;
    }

    if (this._touch !== null) {
      const finger = APP.inputManager.getLocalTouch(this._touch);
      if (this._pointInside(finger)) {
        this._hover = true;
      } else {
        this._hover = false;
      }
    }

    this._clicked = false;
  }

  resize(dimensions) {
    this._rsTooltip.position =
      new sol.Vec2(dimensions.x * 0.5, dimensions.y);
  }

  addToBatch(batch) {
    let shp = this._shp.getCopy();
    let drawTooltip = false;

    if (this._hover === false) {
      shp.color.copy(this._colors.inactive.xyz);
      shp.alpha = this._colors.inactive.w;
    } else {
      if (this._active === true) {
        shp.color.copy(this._colors.active.xyz);
        shp.alpha = this._colors.active.w;
      }

      drawTooltip = true;
    }

    batch.add(shp);

    if (drawTooltip === true) {
      batch.add(this._rsTooltip);
    }
  }

  _pointInside(point) {
    const bbox = this._shp.boundingBox;
    const pos = this._shp.position;
    
    const lo = new sol.Vec2(
      pos.x + bbox.lower.x,
      pos.y + bbox.lower.y
    );

    const hi = new sol.Vec2(
      pos.x + bbox.upper.x,
      pos.y + bbox.upper.y
    );

    if ((point.x >= lo.x && point.x <= hi.x) &&
      (point.y >= lo.y && point.y <= hi.y)) {

      return true;
    }

    return false;
  }
};

export default UIButton;
