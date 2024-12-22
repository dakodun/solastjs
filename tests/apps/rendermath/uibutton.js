import APP, {sol, GLStates, GL} from './init.js';
import Magic from './magic.js';

class UIButton  {

  //
    #state = 0;
    #hover = false;

    #modes = 0;
    #modeOffset = 0;

    #touch = null;
  // ...

	constructor(textureID, modes = 1) {
    this.shape = new sol.Shape();
    this.shape.depth = -10.0;

    let texStore = APP.resourceManager.getTextureStore();
    let tex = texStore.getResource(textureID);

    this.#modes = modes;
    let w = tex.width / 3;
    let h = tex.height / this.#modes;

    this.shape.pushVert(new sol.Vec2(0, 0));
    this.shape.pushVert(new sol.Vec2(w, 0));
    this.shape.pushVert(new sol.Vec2(w, h));
    this.shape.pushVert(new sol.Vec2(0, h));
    
    this.shape.pushFrameStrip(tex, 3 * this.#modes, 3, this.#modes);
	}

  // getters/setters
  get up()      { return this.#state === 0; }
  get down()    { return this.#state === 1; }
  get pressed() { return this.#state === 3; }
  get hover() { return this.#hover; }
  // ...

  input() {
    // mouse controls
    const mouse = APP.inputManager.getLocalMouse();
    if (this.#pointInside(mouse)) {
      this.#hover = true;
    } else {
      this.#hover = false;
    }

    if (this.#state === 0 && this.#hover) {
      if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT)) {
        this.#state = 1;
      }
    } else if (this.#state === 1) {
      if (APP.inputManager.getMouseReleased(sol.enums.Mouse.LEFT)) {
        if (this.#hover) {
          this.#state = 2;
        } else {
          this.#state = 0;
        }
      }
    }

    // touch controls
    if (this.#touch === null) {
      const newTouches = APP.inputManager.getNewTouches();
      if (newTouches.length > 0) {
        this.#touch = newTouches[0];
        const finger = APP.inputManager.getLocalTouch(this.#touch);

        if (this.#pointInside(finger)) {
          this.#state = 1;
          this.#hover = true;
        }
      }
    } else {
      const finger = APP.inputManager.getLocalTouch(this.#touch);

      if (this.#pointInside(finger) && this.#state === 1) {
        this.#hover = true;
      } else {
        this.#hover = false;
      }

      if (APP.inputManager.getTouchEnd(this.#touch)) {
        if (this.#hover) {
          this.#state = 2;
        } else {
          this.#state = 0;
        }

        this.#touch = null;
      } else if (APP.inputManager.getTouchCancel(this.#touch)) {
        this.#touch = null;
      }
    }
  }

  process() {
    if (this.#hover) {
      if (this.#state === 0) {
        this.shape.currentFrame = 1 + this.#modeOffset;
      } else {
        this.shape.currentFrame = 2 + this.#modeOffset;
      }
    } else {
      this.shape.currentFrame = 0 + this.#modeOffset;
    }

    if (this.#state === 2) {
      this.#state = 3;
    } else if (this.#state === 3) {
      this.#state = 0;
    }
  }

  cycleMode() {
    this.#modeOffset = (this.#modeOffset + 3) % (this.#modes * 3);
  }

  #pointInside(point) {
    const lo = this.shape.boundingBox.lower;
    const hi = this.shape.boundingBox.upper;
    
    // account for the offset used to position the
    // shape due to padding
    let pos = this.shape.position.getCopy();
      pos.x -= this.shape.origin.x;
      pos.y -= this.shape.origin.y;

    if ((point.x >= lo.x + pos.x && point.x <= hi.x + pos.x) &&
      (point.y >= lo.y + pos.y && point.y <= hi.y + pos.y)) {

      return true;
    }

    return false;
  }
};

export default UIButton;
