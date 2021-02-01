import Transformable from './transformable.js';
import Vec2 from './vec2.js';

class Polygon extends Transformable(Object) {
  constructor() {
    super();

    this.verts = new Array();
    this.bounds = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );
  }

  copy(other) {
    super.copy(other);

    this.verts.splice(0, this.verts.length);
    for (let v of other.verts) {
      this.verts.push(v.getCopy());
    }

    this.bounds.splice(0, this.bounds.length);
    for (let b of other.bounds) {
      this.bounds.push(b.getCopy());
    }
  }

  getCopy() {
    let copy = new Polygon(); copy.copy(this);
    return copy;
  }

  pushVert(vert) {
    this.verts.push(vert.getCopy());
    
    this.bounds[0].x = Math.min(vert.x, this.bounds[0].x);
    this.bounds[0].y = Math.min(vert.y, this.bounds[0].y);

    this.bounds[1].x = Math.max(vert.x, this.bounds[1].x);
    this.bounds[1].y = Math.max(vert.y, this.bounds[1].y);
  }

  getWinding() {
    let area = 0.0;
    for (let i = 0; i < this.verts.length; ++i) {
      let ii = (i + 1) % this.verts.length;
      area += (this.verts[ii].x - this.verts[i].x) *
          (this.verts[ii].y + this.verts[i].y);
    }
    
    if (area >= 0.0) {
      return -1;
    }
    
    return 1;
  }

  reverseWinding() {
    let result = 1;
    if (this.getWinding() == result) {
      result = -1;
    }
    
    if (this.verts.length != 0) {
      this.verts.reverse();
    }
    
    return result;
  }

  updateGlobalBox() {
    // get trans mat
    
    // transform all points and store min and max

    // update gbox
  }

  updateGlobalMask() {
    // get trans mat

    // clear
    // add all the (transformed) points *shrug*
  }

  createLocalMask() {
    // clear
    // add all the points *shrug*
  }
};

export default Polygon;
