import Transformable from './transformable.js';
import Vec2 from './vec2.js';

class Polygon extends Transformable(Object) {
  constructor() {
    super();

    this.verts = new Array();
  }

  copy(other) {
    super.copy(other);

    this.verts.splice(0, this.verts.length);
    for (let v of other.verts) {
      this.verts.push(v.getCopy());
    }
  }

  getCopy() {
    let copy = new Polygon(); copy.copy(this);
    return copy;
  }

  pushVert(vert) {
    this.verts.push(vert.getCopy());
    
    this.localBox[0].x = Math.min(vert.x, this.localBox[0].x);
    this.localBox[0].y = Math.min(vert.y, this.localBox[0].y);

    this.localBox[1].x = Math.max(vert.x, this.localBox[1].x);
    this.localBox[1].y = Math.max(vert.y, this.localBox[1].y);
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
    if (this.verts.length > 0) {
      this.globalBox = new Array(
          new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
          new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
      );

      let transMat = this.transMat.getCopy();

      let offsetPos = new Vec2(this.position.x - this.origin.x,
          this.position.y - this.origin.y);
      transMat.translate(offsetPos);
      
      transMat.translate(this.origin);
      transMat.rotate(this.rotation);
      transMat.scale(this.scale);
      transMat.translate(this.origin.negate());

      for (const v of this.verts) {
        let vert = new Vec2();
        vert.x = (transMat.arr[0] * v.x) + (transMat.arr[3] * v.y) +
            (transMat.arr[6] * 1.0);
        vert.y = (transMat.arr[1] * v.x) + (transMat.arr[4] * v.y) +
            (transMat.arr[7] * 1.0);

        this.globalBox[0].x = Math.min(vert.x, this.globalBox[0].x);
        this.globalBox[0].y = Math.min(vert.y, this.globalBox[0].y);

        this.globalBox[1].x = Math.max(vert.x, this.globalBox[1].x);
        this.globalBox[1].y = Math.max(vert.y, this.globalBox[1].y);
      }
    }
  }

  updateGlobalMask() {
    this.globalMask.splice(0, this.globalMask.length);

    if (this.verts.length > 0) {
      let transMat = this.transMat.getCopy();

      let offsetPos = new Vec2(this.position.x - this.origin.x,
          this.position.y - this.origin.y);
      transMat.translate(offsetPos);
      
      transMat.translate(this.origin);
      transMat.rotate(this.rotation);
      transMat.scale(this.scale);
      transMat.translate(this.origin.negate());
      
      for (const v of this.verts) {
        let vert = new Vec2();
        vert.x = (transMat.arr[0] * v.x) + (transMat.arr[3] * v.y) +
            (transMat.arr[6] * 1.0);
        vert.y = (transMat.arr[1] * v.x) + (transMat.arr[4] * v.y) +
            (transMat.arr[7] * 1.0);
        
        this.globalMask.push(vert);
      }
    }
  }

  createLocalMask() {
    this.localMask.splice(0, this.localMask.length);

    for (const v of this.verts) {
      this.localMask.push(v.getCopy());
    }
  }
};

export default Polygon;
