import APP, { sol, GLStates, GL } from './init.js';

import Billboard from './billboard.js';
import Script from './script.js';
import ConvoScene from './convoscene.js';

class EntitySuperBatman {
  _state = "idle_0";
  _timer = 0.0;
  _idleLimit = 2.5;

  _stateHover = 0;
  _hover = false;

  _script = new Script();
  _notify = false;

  _currShapes = new Array();
  _shpIdleBody = new Billboard();
  _shpIdleHead = new Billboard();
  _shpKick = new Billboard();
  _shpNotify = new Billboard();

  _depth = -260;
  _posLimit = new sol.Vec2(-100, 40);
  _origin = 0;

  _pickColor = new sol.Vec3(255, 0, 0);

  constructor() {
    this._shpIdleBody.depth = this._depth;
    this._shpIdleBody.color = new sol.Vec3(190, 180, 230);
    this._shpIdleBody.scale = new sol.Vec2(0.8, 0.8);
      
    this._shpIdleHead = this._shpIdleBody.getCopy();
    this._shpKick = this._shpIdleBody.getCopy();

    let texStore = APP.resourceManager.getStore("texture");

    { // super batman idle body
      let tex = texStore.getResource("entSBatmanBody");

      let dim = new sol.Vec2(tex.width * 0.25, tex.height);

      this._shpIdleBody.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);
      
      this._shpIdleBody.pushFrameStrip(tex, 0, 4);
      this._shpIdleBody.setAnimation([0.167]);

      this._shpIdleBody.origin = new sol.Vec2(this._origin, 0);
    }

    { // super batman idle heads
      let tex = texStore.getResource("entSBatmanHeads");

      let dim = new sol.Vec2(tex.width * 0.25, tex.height);
      
      this._shpIdleHead.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);
      
      this._shpIdleHead.pushFrameStrip(tex, 0, 4);

      this._shpIdleHead.origin = new sol.Vec2(this._origin, 0);
    }
    
    { // super batman kick
      let tex = texStore.getResource("entSBatmanKick");

      let dim = new sol.Vec2(tex.width / 3, tex.height);
      
      this._shpKick.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);
      
      this._shpKick.pushFrameStrip(tex, 0, 3);
      this._shpKick.setAnimationArray(
        [0, 1, 2, 1, 2, 1],
        [0.08, 0.08, 0.167, 0.08, 0.167, 0.08],
        "forward",
        0
      );

      this._shpKick.origin = new sol.Vec2(this._origin + 14, 0);
    }

    this.setAnimation();

    // 

    let scrStore = APP.resourceManager.getStore("script");
    let scr = scrStore.getResource("scrSuperBatman");
    this._script.fromString(scr);
    this._script._currScene = "firstMeeting";

    
    { // notify icon -
      // build and enable the notify icon which sits above
      // the character when they still have new dialogue

      let tex = texStore.getResource("uiNotify");
      let dim = new sol.Vec2(tex.width * 0.25, tex.height);

      this._shpNotify.pushVerts([
        new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
        new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
      ]);

      let w = this._shpIdleBody.bbWidth  * this._shpIdleBody.scale.x;
      let h = this._shpIdleBody.bbHeight * this._shpIdleBody.scale.y;

      this._shpNotify.position = new sol.Vec2(
        (w * 0.5) - 8,
        h + this._posLimit.y + 4
      );

      this._shpNotify.origin = new sol.Vec2(Math.round(dim.x * 0.5), 0);
      this._shpNotify.depth = this._depth;
      // this._shpNotify.scale = new sol.Vec2(0.2, 0.2);

      this._shpNotify.pushFrameStrip(tex, 0, 4);
      this._shpNotify.setAnimation([0.16, 0.08, 0.04, 0.08], 0, 4);

      this._notify = true;
    }
  }

  get position() { return this._shpIdleBody.position; }

  static loadResources() {
    let images = [
      {id: "entSBatmanBody", src: "res/bm_s_idle_body.png",
        width: 328, height: 93,},
      {id: "entSBatmanHeads", src: "res/bm_s_idle_heads.png",
        width: 328, height: 93,},
      {id: "entSBatmanKick", src: "res/bm_s_kick.png",
        width: 270, height: 93,},
      
      {id: "textSuperBatman", src: "res/bm_s_text.png",
        width: 156, height: 39,},
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
      // if batman is in his idle pose then check for elapsed
      // animation timer and update his head position as is
      // applicable

      this._shpIdleBody.process(dt);

      while (this._timer > this._idleLimit) {
        this._timer -= this._idleLimit;

        let suffix = Number.parseInt(
          this._state.substring(this._state.length - 1)
        );

        if (suffix === 0) {
          // if head pose is default (facing right) then pick
          // a new pose — including continuing the current pose —
          // and then update sprite and set a shorter timer for
          // the next check  (1.0 to 1.5 seconds)

          let newFrame = Math.floor(Math.random() * 3);
          this._state = "idle_" + newFrame;
          this._shpIdleHead.currentFrame = newFrame;
          this._idleLimit = 1.0 + (Math.random() * 0.5);
        } else {
          // othewrwise if we are not in the default pose then
          // return to it and set a standard timer for the next
          // check (2.0 to 3.0 seconds)

          this._state = "idle_0";
          this._shpIdleHead.currentFrame = 0;
          this._idleLimit = 2.0 + Math.random();
        }
      }

      this._timer += dt;
    } else if (this._state.substring(0, 4) === "kick") {
      this._shpKick.process(dt);

      if (this._shpKick.animating === false) {
        this.setAnimation();
      }
    }

    if (this._notify === true) {
      this._shpNotify.process(dt);
    }
  }

  onSelect(caller, color) {
    // return true if pixel color matches
    // pick color

    return color.equals(this._pickColor);
  }

  onActive(caller, color) {
    // if mouse is within sprite's bounding box
    // then initiate the script from it's current
    // place

    if (color.equals(this._pickColor)) {
      caller.startScript(this._script);

      let scene = this._script.getCurrScene();
      if (scene._idNext === "" && this._notify === true) {
        this._notify = false;
      }
    }
  }

  addToBatch(batch, pickShader) {
    for (let shape of this._currShapes) {
      batch.add(shape);
    }

    if (this._notify === true) {
      batch.add(this._shpNotify);
    }

    // if a pick batch is specified then create a
    // duplicate of the current sprite(s) and set
    // them to render with the custom pick shader
    // with the pick colour

    for (let shape of this._currShapes) {
      let shpPick = shape.getCopy();
      shpPick.shader = pickShader.shader;
      shpPick.color = this._pickColor.getCopy();

      batch.add(shpPick, 1);
    }
  }

  setAnimation(animName) {
    switch(animName) {
      case "kick" :
        this._state = "kick";
        
        this._currShapes.splice(0);
        this._currShapes.push(this._shpKick);
        break; 
      default :
        this._state = "idle_0";

        this._currShapes.splice(0);
        this._currShapes.push(this._shpIdleBody);
        this._currShapes.push(this._shpIdleHead);

        break;
    }
  }

  onResize(cam, projection) {
    this._shpIdleBody._focusPoint = cam.position.getCopy();
    this._shpIdleHead._focusPoint = cam.position.getCopy();
    this._shpKick._focusPoint     = cam.position.getCopy();
    this._shpNotify._focusPoint   = cam.position.getCopy();

    let screenPos = new sol.Vec3(0, this._posLimit.y);

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

      let dx = this._shpIdleBody.position.x -
        Math.max(this._posLimit.x, intPoint.point.x);
  
      this._shpIdleBody.position.x -= dx;
      this._shpIdleHead.position.x -= dx;
      this._shpKick.position.x     -= dx;
      this._shpNotify.position.x   -= dx;

      this._shpIdleBody.position.y = this._posLimit.y;
      this._shpIdleHead.position.y = this._posLimit.y;
      this._shpKick.position.y     = this._posLimit.y;
      // this._shpNotify.position.y   = this._posLimit.y;
    }
  }
};

export default EntitySuperBatman;
