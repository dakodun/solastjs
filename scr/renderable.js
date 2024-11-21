import GL from './gl.js'

import Shader from './shader.js';
import Vec3 from './vec3.js';

class Renderable {
  /*
    serves as an  interface  (via  composition)  to allow a
    class to be rendered via the default  render pipeline -
    an implementating  class should  contain a 'renderable'
    field (exposed via a getter if private)
  */

  // private fields
    #color = new Vec3(255, 255, 255);
    #alpha =  255;
    #depth = -1.0;

    #renderMode = GL.TRIANGLES;

    // reference to a shader instance
    #shaderRef = null;
  // ...

  constructor() {

  }

  // getters/setters
  get color() { return this.#color; }
  get alpha() { return this.#alpha; }
  get depth() { return this.#depth; }
  get renderMode() { return this.#renderMode; }
  get shaderRef() { return this.#shaderRef; }

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

  set shaderRef(shaderRef) {
    if (!(shaderRef instanceof Shader)) {
      throw new TypeError("Renderable (shaderRef): should " +
        "be a reference to a Shader instance");
    }

    this.#shaderRef = shaderRef;
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
    this.#shaderRef = other.#shaderRef;
  }

  getCopy() {
    let copy = new Renderable();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    if (!(other instanceof Renderable)) {
      throw new TypeError("Renderable (equals): other should be " +
        "a Renderable");
    }
    
    return (
      this.#color.equals(other.#color) &&
      this.#alpha === other.#alpha &&
      this.#depth === other.#depth &&
      this.#renderMode === other.#renderMode &&
      this.#shaderRef === other.#shaderRef
    );
  }

  asData() {
    // callback function used by default render piepline to
    // retrieve render data - should return an array of
    // renderable data (RenderBatchData by default although
    // it is possible to define your own - see RenderBatchData)

    return [];
  }
};

export default Renderable;
