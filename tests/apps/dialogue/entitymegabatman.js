import APP, { sol, GLStates, GL } from './init.js';

import Billboard from './billboard.js';
import ConvoScene from './convoscene.js';

class EntityMegaBatman {
  _state = "idle";
  
  _currShapes = new Array();
  _shpIdle = new Billboard();
  _shpDefend = new Billboard();

  _depth = -220;
  _posLimit = new sol.Vec2(90, 40);
  _origin = 32;

  _pickColor = new sol.Vec3(0, 255, 0);

  constructor() {
    this._shpIdle.depth = this._depth;
    this._shpIdle.color = new sol.Vec3(190, 180, 230);
    this._shpIdle.scale = new sol.Vec2(0.8, 0.8);

    this._shpDefend = this._shpIdle.getCopy();
    
    let texStore = APP.resourceManager.getStore("texture");

    { // mega batman idle

      let tex = texStore.getResource("entMBatman");

      let dim = new sol.Vec2(tex.width * 0.25, tex.height);

      this._shpIdle.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);

      this._shpIdle.pushFrameStrip(tex, 0, 4);
      this._shpIdle.setAnimation([0.180]);

      this._shpIdle.origin = new sol.Vec2(dim.x - this._origin, 0);
    }

    { // mega batman defend
      let tex = texStore.getResource("entMBatmanDefend");

      let dim = new sol.Vec2(tex.width, tex.height);

      this._shpDefend.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);

      this._shpDefend.pushFrame(tex);
      this._shpDefend.setAnimation([0.4], 0, 0, "forward", 1);

      this._shpDefend.origin = new sol.Vec2(dim.x - this._origin - 2, 0);
    }

    this.setAnimation();
  }

  get position() { return this._shpIdle.position; }

  static loadResources() {
    let images = [
      {id: "entMBatman", src: "res/bm_m_idle.png",
        width: 328, height: 89,},

      {id: "entMBatmanDefend", src: "res/bm_m_defend.png",
        width: 82, height: 89,},
      
      {id: "textMegaBatman", src: "res/bm_m_text.png",
        width: 209, height: 39,},
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
    
  }

  process(dt) {
    if (this._state.substring(0, 4) === "idle") {
      this._shpIdle.process(dt);
    } else if (this._state.substring(0, 6) === "defend") {
      this._shpDefend.process(dt);

      if (this._shpDefend.animating === false) {
        this.setAnimation();
      }
    }
  }

  onSelect(caller, color) {
    return false;
  }

  onActive(caller, color) {
    
  }

  addToBatch(batch, pickShader) {
    for (let shape of this._currShapes) {
      batch.add(shape);
    }

    for (let shape of this._currShapes) {
      let shpPick = shape.getCopy();
      shpPick.shader = pickShader.shader;
      shpPick.color = this._pickColor.getCopy();

      batch.add(shpPick, 1);
    }
  }

  setAnimation(animName) {
    switch(animName) {
      case "defend" :
        this._state = "defend";
        
        this._currShapes.splice(0);
        this._currShapes.push(this._shpDefend);
        break;
      default :
        this._state = "idle";

        this._currShapes.splice(0);
        this._currShapes.push(this._shpIdle);

        break;
    }
  }

  onResize(cam, projection) {
    this._shpIdle._focusPoint   = cam.position.getCopy();
    this._shpDefend._focusPoint = cam.position.getCopy();

    let screenPos = new sol.Vec3(APP.canvas.clientWidth, this._posLimit.y);

    // get the 2 endpoints of the ray (from near plane to
    // far plane) that correspond to the screen position
    let worldPos = ConvoScene._unproject(
      screenPos, cam.view, projection);
    
    // find the point at which the ray collides with the
    // XY plane at the required depth in world space
    let intPoint = ConvoScene._segmentPlane(worldPos.n, worldPos.f,
      new sol.Vec3(0, 0, this._depth), new sol.Vec3(0, 0, -1));

    if (intPoint.intersects === true) {
      // if an intersect exists then find the difference
      // between that and the current position and then
      // offset all billboards (y-value (height) is fixed)

      let dx = this._shpIdle.position.x -
        Math.min(this._posLimit.x, intPoint.point.x);

      this._shpIdle.position.x   -= dx;
      this._shpDefend.position.x -= dx;

      this._shpIdle.position.y   = 40;
      this._shpDefend.position.y = 40;
    }
  }
};

export default EntityMegaBatman;
