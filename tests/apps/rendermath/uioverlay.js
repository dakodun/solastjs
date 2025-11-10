import APP, { sol } from './init.js';
import Magic from './magic.js';

class UIOverlay  {
  // private fields
    #grabPrompt    = { ele: undefined, shp: undefined, }
    #switchProjTxt = { ele: undefined, shp: undefined, }

    // for grab me prompt bounce animation
    #grabRotDir = 1;
    #grabRotLim = 10 * Magic.PI180;
    #grabRotSpd = 40 * Magic.PI180;

    #grabScaleDir = new sol.Vec2(1, 1);
    #grabScaleLim = new sol.Vec2(1.2, 1.2);
    #grabScaleSpd = new sol.Vec2(0.6, 0.8);
  // ...

	constructor() {
    let texStore = APP.resourceManager.getStore("texture");

    {// shape - grab me...
    this.#grabPrompt.shp = new sol.Shape();
    let shpRef = this.#grabPrompt.shp;
    shpRef.pushVert(new sol.Vec2(  0.0,  0.0));
    shpRef.pushVert(new sol.Vec2(400.0,  0.0));
    shpRef.pushVert(new sol.Vec2(400.0, 80.0));
    shpRef.pushVert(new sol.Vec2(  0.0, 80.0));

    shpRef.pushFrame(texStore.getResource("continuePrompt"));

    shpRef.depth = -10.0;
    shpRef.origin = new sol.Vec2(200.0, 40.0);
    shpRef.position = new sol.Vec2(0.0, 0.0);

    this.#grabPrompt.ele = new sol.LayoutElement(400, 80);
    let eleRef = this.#grabPrompt.ele;
    eleRef.posCallback = () => {
      shpRef.position = new sol.Vec2(
        eleRef.position.x + shpRef.origin.x,
        eleRef.position.y + shpRef.origin.y
      );
    };
    } // ...

    { // shape - switch projections...
    this.#switchProjTxt.shp = new sol.Shape();
    let shpRef = this.#switchProjTxt.shp;
    shpRef.pushVert(new sol.Vec2(  0.0,   0.0));
    shpRef.pushVert(new sol.Vec2(240.0,   0.0));
    shpRef.pushVert(new sol.Vec2(240.0, 100.0));
    shpRef.pushVert(new sol.Vec2(  0.0, 100.0));

    shpRef.pushFrame(texStore.getResource("switchProj"));

    shpRef.depth = -10.0;
    shpRef.origin = new sol.Vec2(0.0, 0.0);
    shpRef.position = new sol.Vec2(100.0, 0.0);

    this.#switchProjTxt.ele = new sol.LayoutElement(240, 100);
    let eleRef = this.#switchProjTxt.ele;
    eleRef.posCallback = () => {
      shpRef.position = eleRef.position.getCopy();
    };

    eleRef.float = true;
    eleRef.offset = new sol.Vec2(-7.0, 28.0);
    } // ...
	}

  // getters/setters...
  get grabPrompt() { return this.#grabPrompt }
  get switchProjTxt() { return this.#switchProjTxt }
  // ...

  process(dt) {
    // simple transformation based animation for our
    // grab me prompt sprite
    
    // rotate...
    const r = this.#grabPrompt.shp.rotation;

    // flip the rotation direction if we passed the limit
    if ((r > this.#grabRotLim && this.#grabRotDir == 1) ||
        (r < -this.#grabRotLim && this.#grabRotDir == -1)) {
      this.#grabRotDir = -this.#grabRotDir;
    }

    // calculate the new rotation with regards to the current direction
    let nr = r + (this.#grabRotSpd * dt * this.#grabRotDir);
    this.#grabPrompt.shp.rotation = nr;
    // ...

    // scale...
    const s = this.#grabPrompt.shp.scale.getCopy();

    if ((s.x > this.#grabScaleLim.x && this.#grabScaleDir.x == 1) || 
        (s.x < 1.0 && this.#grabScaleDir.x == -1)) {
      this.#grabScaleDir.x = -this.#grabScaleDir.x;
    }

    if ((s.y > this.#grabScaleLim.y && this.#grabScaleDir.y == 1) || 
        (s.y < 1.0 && this.#grabScaleDir.y == -1)) {
      this.#grabScaleDir.y = -this.#grabScaleDir.y;
    }

    let ns = new sol.Vec2(
      s.x + (this.#grabScaleSpd.x * dt * this.#grabScaleDir.x),
      s.y + (this.#grabScaleSpd.y * dt * this.#grabScaleDir.y)
    );

    this.#grabPrompt.shp.scale = ns;
    // ...
	}
};

export default UIOverlay;
