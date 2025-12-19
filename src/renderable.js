import GL from './gl.js'
import Sol from './sol.js'

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

  //> internal properties //
  _color = new Vec3(255, 255, 255);
  _alpha =  255;
  _depth = -1.0;

  _renderMode = (GL) ? GL.TRIANGLES : 0;

  _shader = null;

  // for rendering lines with a set width
  // - internally rendered as triangles
  _outline = new Array();
  _lineWidth = 1;

  //> constructor //
  constructor() {

  }

  //> getters //
  get color() { return this._color; }
  get alpha() { return this._alpha; }
  get depth() { return this._depth; }
  get renderMode() { return this._renderMode; }
  get shader() { return this._shader; }
  get outline() { return this._outline; }
  get lineWidth() { return this._lineWidth; }

  //> setters //
  set color(color) {
    Sol.checkTypes(this, "set color",
    [{color}, [Vec3]]);

    this._color = color;
  }

  set alpha(alpha) {
    Sol.checkTypes(this, "set alpha",
    [{alpha}, [Number]]);

    this._alpha = alpha;
  }

  set depth(depth) {
    Sol.checkTypes(this, "set depth",
    [{depth}, [Number]]);

    this._depth = depth;
  }

  set renderMode(renderMode) {
    Sol.checkTypes(this, "set renderMode",
    [{renderMode}, [Number]]);

    this._renderMode = renderMode;
  }

  set shader(shader) {
    Sol.checkTypes(this, "set renderMode",
    [{shader}, [Shader]]);

    this._shader = shader;
  }

  set outline(outline) {
    Sol.checkTypes(this, "set outline",
    [{outline}, [Array]]);
    
    this._outline = outline;
  }

  set lineWidth(lineWidth) {
    Sol.checkTypes(this, "set lineWidth",
    [{lineWidth}, [Number]]);

    this._lineWidth = lineWidth;
  }

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
    [{other}, [Renderable]]);

    this._color = other._color.getCopy();
		this._alpha = other._alpha;
    this._depth = other._depth;

    this._renderMode = other._renderMode;
    this._shader = other._shader;
  }

  getCopy() {
    let copy = new Renderable();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
    [{other}, [Renderable]]);
    
    return (
      this._color.equals(other._color) &&
      this._alpha === other._alpha &&
      this._depth === other._depth &&
      this._renderMode === other._renderMode &&
      this._shader === other._shader
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
