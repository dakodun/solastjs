import { sol } from './init.js';

import Magic from './magic.js';

class Billboard {
  //
  
  //> internal properties //
  _shape = new sol.Shape();
  _focusPoint = new sol.Vec3();
  _boundingBox3D = {
    lower: new sol.Vec3(Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    upper: new sol.Vec3(Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
  };

  //> constructor //
  constructor(verts = []) {
    this.verts = verts;
  }

  //> getters (shape) //
  get animating() { return this._shape.animating; }
  get verts() { return this._shape.verts; }

  get transformable() { return this._shape.transformable; }
  get position() { return this._shape.position; }
  get origin()   { return this._shape.origin;   }
  get transMat() { return this._shape.transMat; }
  get scale()    { return this._shape.scale;    }
  get rotation() { return this._shape.rotation; }
  get boundingBox() { return this._shape.boundingBox; }

  get bbWidth()  { return this._shape.bbWidth;  }
  get bbHeight() { return this._shape.bbHeight; }

  get indices() { return this._shape.indices; }
  get colors() { return this._shape.colors; }
  get frames() { return this._shape.frames; }
  get currentFrame() { return this._shape.currentFrame; }
  get animation() { return this._shape.animation; }
  get timer() { return this._shape.timer; }

  get renderable() { return this._shape.renderable; }
  get color() { return this._shape.color; }
  get alpha() { return this._shape.alpha; }
  get depth() { return this._shape.depth; }
  get renderMode() { return this._shape.renderMode; }
  get shader() { return this._shape.shader; }
  get outline() { return this._shape.outline; }
  get lineWidth() { return this._shape.lineWidth; }

  //> setters (shape) //
  set animating(animating) {
    this._shape.animating = animating;
  }
  
  set verts(verts) { this._shape.verts = verts; }

  set position(position) { this._shape.position = position; }
  set origin(origin) { this._shape.origin = origin; }
  set transMat(transMat) { this._shape.transMat = transMat; }
  set scale(scale) { this._shape.scale = scale; }
  set rotation(rotation) { this._shape.rotation = rotation; }
  set boundingBox(boundingBox) {
    this._shape.boundingBox = boundingBox;
  }

  set indices(indices) { this._shape.indices = indices; }
  set colors(colors) { this._shape.colors = colors; }
  set frames(frames) { this._shape.frames = frames; }
  set currentFrame(currentFrame) {
    this._shape.currentFrame = currentFrame;
  }

  set animation(animation) {
    this._shape.animation = animation;
  }

  set timer(timer) { this._shape.timer = timer; }

  set color(color) { this._shape.color = color; }
  set alpha(alpha) { this._shape.alpha = alpha; }
  set depth(depth) { this._shape.depth = depth; }
  set renderMode(renderMode) {
    this._shape.renderMode = renderMode;
  }

  set shader(shader) { this._shape.shader = shader; }
  set outline(outline) { this._shape.outline = outline; }
  set lineWidth(lineWidth) {
    this._shape.lineWidth = lineWidth;
  }

  //> public methods //
  copy(other) {
    this._shape = other._shape.getCopy();
    this._focusPoint = other._focusPoint.getCopy();
  }

  getCopy() {
    let copy = new Billboard();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    return (
      this._shape.equals(other._shape) &&
      this._focusPoint.equals(other._focusPoint)
    );
  }

  process(dt) {
    this._shape.process(dt);
  }

  pushFrame(textureIn, layerIn, sIn, tIn) {
    this._shape.pushFrame(textureIn, layerIn, sIn, tIn);
  }

  pushFrameStrip(textureIn, layerIn, countIn, columnsIn = countIn,
  rowsIn = 1, startIn = 0, offset = new sol.Vec2()) {
    this._shape.pushFrameStrip(textureIn, layerIn, countIn,
      columnsIn, rowsIn, startIn, offset);
  }
  
  setAnimation(timingsIn = [], startIn = 0, endIn = -1,
  directionIn = "forward", loopsIn = -1) {
    this._shape.setAnimation(timingsIn, startIn,
      endIn, directionIn, loopsIn);
  }
  
  setAnimationArray(indices, timingsIn = [], directionIn = "forward",
  loopsIn = -1) {
    this._shape.setAnimationArray(indices,
      timingsIn, directionIn, loopsIn);
  }
  
  resetAnimation() {
    this._shape.resetAnimation();
  }

  pushVert(vert) {
    this._shape.pushVert(vert);
  }

  pushVerts(verts) {
    this._shape.pushVerts(verts);
  }

  asData() {
    // reset the 3D bounding box
    this._boundingBox3D = {
      lower: new sol.Vec3(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      upper: new sol.Vec3(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    };
    
    // calculate the center point of the billboard using
    // its position and the half width/height of its
    // bounding box

    let center = new sol.Vec3(
      this.position.x + (this.bbWidth * 0.5),
      this.position.y + (this.bbHeight * 0.5),
      this.depth
    );

    // the 'up' vector is the axis we are aligned to (usually
    // the positive y-axis), the 'look' vector is the normalized
    // vector from the billboard to the focus point (usually the
    // camera) and the 'right' vector is cross product

    let up = new sol.Vec3(0, 1, 0);
    let look = new sol.Vec3(
      center.x - this._focusPoint.x,
      0,
      center.z - this._focusPoint.z
    );

    look.normalize();
    let right = look.getCross(up);

    // construct a rotation matrix from the 3 vectors,
    // including the billboard's 'center' point to ensure
    // translation occurs at origin, then translate the
    // billboard back to its original position

    let mat = new sol.Mat4();
    mat.arr[ 0] = right.x;
    mat.arr[ 4] = right.y;
    mat.arr[ 8] = right.z;
    
    mat.arr[ 1] = up.x;
    mat.arr[ 5] = up.y;
    mat.arr[ 9] = up.z;
    
    mat.arr[ 2] = look.x;
    mat.arr[ 6] = look.y;
    mat.arr[10] = look.z;

    mat.arr[12] = center.x;
    mat.arr[13] = center.y;
    mat.arr[14] = center.z;

    mat.translate(center.getNegated());

    // get the billboards render data from the shape and modify
    // the vertices using our calculated transformation matrix

    let arr = this._shape.asData();
    for (let rbd of arr) {
      for (let vert of rbd.vertices) {
        let v = mat.getMultVec4(new sol.Vec4(vert.x, vert.y, vert.z, 1.0));
        vert.x = v.x;
        vert.y = v.y;
        vert.z = v.z;

        // update the 3D bounding box
        this._boundingBox3D.lower.x = Math.min(
          this._boundingBox3D.lower.x, vert.x);
        this._boundingBox3D.lower.y = Math.min(
          this._boundingBox3D.lower.y, vert.y);
        this._boundingBox3D.lower.z = Math.min(
          this._boundingBox3D.lower.z, vert.z);

        this._boundingBox3D.upper.x = Math.max(
          this._boundingBox3D.upper.x, vert.x);
        this._boundingBox3D.upper.y = Math.max(
          this._boundingBox3D.upper.y, vert.y);
        this._boundingBox3D.upper.z = Math.max(
          this._boundingBox3D.upper.z, vert.z);
      }
    }

    return arr;
  }
};

export default Billboard;
