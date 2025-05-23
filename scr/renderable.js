import GL from './gl.js'

import Shader from './shader.js';
import Vec3 from './vec3.js';

class Renderable {
  /*
    serves as an  interface  (via  composition)  to allow a
    class to be rendered via the default  render pipeline -
    an implementating  class should  contain a 'renderable'
    field (exposed via a getter if private) and an 'asData'
    method
  */

  // private fields
    #color = new Vec3(255, 255, 255);
    #alpha =  255;
    #depth = -1.0;

    #renderMode = (GL) ? GL.TRIANGLES : 0;

    #shader = null;

    // for rendering lines with a set width
    // - internally rendered as triangles
    #outline = new Array();
    #lineWidth = 1;
  // ...

  constructor() {

  }

  // getters/setters
  get color() { return this.#color; }
  get alpha() { return this.#alpha; }
  get depth() { return this.#depth; }
  get renderMode() { return this.#renderMode; }
  get shader() { return this.#shader; }
  get outline() { return this.#outline; }
  get lineWidth() { return this.#lineWidth; }

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

  set shader(shader) {
    if (shader !== null && !(shader instanceof Shader)) {
      throw new TypeError("Renderable (shader): should " +
        "be a Shader (or null)");
    }

    this.#shader = shader;
  }

  set outline(outline) {
    if (!(outline instanceof Array)) {
      throw new TypeError("Renderable (outline): outline should " +
        "be an Array of Vec2");
    }
    
    this.#outline = outline;
  }

  set lineWidth(lineWidth) {
    if (typeof lineWidth !== 'number') {
      throw new TypeError("Renderable (lineWidth): should " +
        "be a Number");
    }

    this.#lineWidth = lineWidth;
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
      this.#shader === other.#shader
    );
  }

  asData(base) {
    // callback function used by default render pipeline to
    // retrieve render data - should return an array of
    // renderable data (RenderBatchData by default although
    // it is possible to define your own - see RenderBatchData)

    return base.asData();
  }
};

export default Renderable;
