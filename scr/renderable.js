import GL from './gl.js'

import Vec3 from './vec3.js';

class Renderable {
  /*
    serves  as an  interface  (via  composition)  to allow
    a class to be rendered via the default render pipeline
  */

  // private fields
    #color = new Vec3(255, 255, 255);
    #alpha =  255;
    #depth = -1.0;

    #renderMode = GL.TRIANGLES;
    #shader = null;

    // callback function used by default render piepline to
    // retrieve render data - should return an array of
    // RenderBatchData
    #asData = () => { return []; };
  // ...

  constructor() {

  }

  // getters/setters
  get color() { return this.#color; }
  get alpha() { return this.#alpha; }
  get depth() { return this.#depth; }
  get renderMode() { return this.#renderMode; }
  get shader() { return this.#shader; }

  get asData() { return this.#asData; }

  set color(color) {
    if (!(color instanceof Vec3)) {
      throw new TypeError("Renderable (color): should " +
        "be a Vec3");
    }

    this.#color = color;
  }

  set alpha(alpha) {
    if (typeof alpha !== 'number') {
      throw new TypeError("Renderable (alpha): should " +
        "be a Number");
    }

    this.#alpha = alpha;
  }

  set depth(depth) {
    if (typeof depth !== 'number') {
      throw new TypeError("Renderable (depth): should " +
        "be a Number");
    }

    this.#depth = depth;
  }

  set renderMode(renderMode) {
    if (typeof renderMode !== 'number') {
      throw new TypeError("Renderable (renderMode): should " +
        "be a Number");
    }


    this.#renderMode = renderMode;
  }

  set asData(asData) {
    if (typeof asData !== 'function') {
      throw new TypeError("Renderable (asData): should " +
        "be a Function");
    }

    this.#asData = asData;
  }
  // ...

  copy(other) {
    if (!(other instanceof Renderable)) {
      throw new TypeError("Renderable (copy): other should be " +
        "a Renderable");
    }

    this.#color = other.#color.getCopy();
		this.#alpha = other.#alpha;
    this.#depth = other.#depth;

    this.#renderMode = other.#renderMode;
    this.#shader = other.#shader;

    this.#asData = other.#asData;
  }

  getCopy() {
    let copy = new Renderable();
    copy.copy(this);

    return copy;
  }

  static [Symbol.hasInstance](instance) {
    // return true if instance is a Renderable or exposes
    // a Renderable field via 'get renderable()'
    if (Function.prototype[Symbol.hasInstance].
      call(Renderable, instance)) {

      return true;
    } else if (instance.renderable !== undefined &&
      instance.renderable instanceof Renderable) {

      return true;
    }
    
    return false;
  }
};

export default Renderable;
