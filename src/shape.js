import GL from './gl.js'

import Mat3 from './mat3.js';
import Polygon from './polygon.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Texture from './texture.js'
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';
import VBOVertex from './vbovertex.js';

import * as enums from "./exportenums.js";

class Shape extends Polygon {
  static Frame = class {
    // ...
      #texture = null;

      #s = new Vec2(0.0, 1.0);
      #t = new Vec2(0.0, 1.0);
      #layer = 0;

      #limit = 0.0167;
    // ...

    constructor(initializerList = {}) {

      this.texture = (initializerList.texture !== undefined) ?
        initializerList.texture : null;
      
      this.s = initializerList.s || new Vec2(0.0, 1.0);
      this.t = initializerList.t || new Vec2(0.0, 1.0);
      this.layer = initializerList.layer || 0;

      this.limit = initializerList.limit || 0.0167;
    }

    //
      get texture() { return this.#texture; }
      get s() { return this.#s; }
      get t() { return this.#t; }
      get layer() { return this.#layer; }
      get limit() { return this.#limit; }

      set texture(texture) {
        if (texture !== null && !(texture instanceof Texture)) {
          throw new TypeError("Shape.Frame (texture): should " +
            "be a Texture (or null)");
        }

        this.#texture = texture;
      }

      set s(s) {
        if (!(s instanceof Vec2)) {
          throw new TypeError("Shape.Frame (s): should " +
            "be a Vec2");
        }

        this.#s = s;
      }

      set t(t) {
        if (!(t instanceof Vec2)) {
          throw new TypeError("Shape.Frame (texture): should " +
            "be a Vec2");
        }

        this.#t = t;
      }

      set layer(layer) {
        if (typeof layer !== 'number') {
          throw new TypeError("Shape.Frame (layer): should " +
            "be a Number");
        }

        this.#layer = layer;
      }

      set limit(limit) {
        if (typeof limit !== 'number') {
          throw new TypeError("Shape.Frame (limit): should " +
            "be a Number");
        }

        this.#limit = limit;
      }
    // ...

    copy(other) {
      if (!(other instanceof Shape.Frame)) {
        throw new TypeError("Shape.Frame (copy): other should " +
          "be a Shape.Frame");
      }

      this.#texture = other.#texture;

      this.#s = other.#s.getCopy();
      this.#t = other.#t.getCopy();
      this.#layer = other.#layer;

      this.#limit = other.#limit;
    }

    getCopy() {
      let copy = new Shape.Frame();
      copy.copy(this);

      return copy;
    }

    equals(other) {
      if (!(other instanceof Shape.Frame)) {
        throw new TypeError("Shape.Frame (equals): other should " +
          "be a Shape.Frame");
      }
      
      return (
        this.#texture === other.#texture &&

        this.#s.equals(other.#s) &&
        this.#t.equals(other.#t) &&
        this.#layer === other.#layer &&

        this.#limit === other.#limit
      );
    }
  };
  

  // public fields...
    animated = false;
  // ...public fields

  // private fields...
    #indices = new Array();
    #colors = new Array();

    #frames = new Array();
    #currentFrame = 0;
    
    #startFrame   = 0;
    #endFrame     = 0;
    #direction    = 1;
    #loopCount    = 0;
    #loopMax      = 0;
    #timer        = 0;

    #renderable = new Renderable();
  // ...private fields


	constructor(verts = undefined) {
    // call super constructor with no argument
    // to prevent calling derived setter for
    // verts without fully initialising derived
    // class (this.#indices)
    super();

    if (verts !== undefined) {
      this.verts = verts;
    }
  }


  // getters/setters...
  get verts() { return super.verts; }

  set verts(verts) {
    super.verts = verts;
    this.#indices.splice(0, this.#indices.length);
  }

  get indices() { return this.#indices; }
  get colors() { return this.#colors; }

  get frames() { return this.#frames; }
  get currentFrame() { return this.#currentFrame; }
  
  get startFrame() { return this.#startFrame; }
  get endFrame()   { return this.#endFrame;   }
  get direction()  { return this.#direction;  }
  get loopCount()  { return this.#loopCount;  }
  get loopMax()    { return this.#loopMax;    }
  get timer()      { return this.#timer;      }

  set indices(indices) {
    if (!(indices instanceof Array)) {
      throw new TypeError("Shape (indices): indices should " +
        "be an Array of Number");
    }

    for (const index of indices) {
      if (typeof index !== 'number') {
        throw new TypeError("Shape (indices): index should " +
          "be a Number");
      }
    }

    this.#indices = indices;
  }

  set colors(colors) {
    if (!(colors instanceof Array)) {
      throw new TypeError("Shape (colors): colors should " +
        "be an Array of Vec3");
    }

    for (const color of colors) {
      if (!(color instanceof Vec3)) {
        throw new TypeError("Shape (colors): color should " +
          "be a Vec3");
      }
    }

    this.#colors = colors;
  }

  set frames(frames) {
    if (!(frames instanceof Array)) {
      throw new TypeError("Shape (frames): frames should " +
        "be an Array of Shape.Frame");
    }

    for (const frame of frames) {
      if (!(frame instanceof Shape.Frame)) {
        throw new TypeError("Shape (frames): frame should " +
          "be a Shape.Frame");
      }
    }

    this.#frames = frames;
  }

  set currentFrame(currentFrame) {
    if (typeof currentFrame !== 'number') {
      throw new TypeError("Shape (currentFrame): should be a Number");
    } else if (currentFrame < 0 ||
      currentFrame > this.#frames.length) {

      throw new RangeError("Shape (currentFrame): should be an " +
      "integer between 0 and total number of frames (inclusively)");
    }

    this.#timer = 0.0;
    this.#currentFrame = currentFrame;
  }

  set startFrame(startFrame) {
    if (typeof startFrame !== 'number') {
      throw new TypeError("Shape (startFrame): should " +
        "be a Number");
    }

    this.#startFrame = startFrame;
  }

  set endFrame(endFrame) {
    if (typeof endFrame !== 'number') {
      throw new TypeError("Shape (endFrame): should " +
        "be a Number");
    }

    this.#endFrame = endFrame;
  }
  
  set direction(direction) {
    if (typeof direction !== 'number') {
      throw new TypeError("Shape (direction): should " +
        "be a Number");
    }

    this.#direction = direction;
  }

  set loopCount(loopCount) {
    if (typeof loopCount !== 'number') {
      throw new TypeError("Shape (loopCount): should " +
        "be a Number");
    }

    this.#loopCount = loopCount;
  }

  set loopMax(loopMax) {
    if (typeof loopMax !== 'number') {
      throw new TypeError("Shape (loopMax): should " +
        "be a Number");
    }

    this.#loopMax = loopMax;
  }
  
  set timer(timer) {
    if (typeof timer !== 'number') {
      throw new TypeError("Shape (timer): should " +
        "be a Number");
    }

    this.#timer = timer;
  }

  // helpers for working with renderable - error
  // handling occurs in Renderable class
  get renderable() { return this.#renderable; }

  get color() { return this.#renderable.color; }
  get alpha() { return this.#renderable.alpha; }
  get depth() { return this.#renderable.depth; }
  get renderMode() { return this.#renderable.renderMode; }
  get shader() { return this.#renderable.shader; }
  get outline() { return this.#renderable.outline; }
  get lineWidth() { return this.#renderable.lineWidth; }

  set color(color) { this.#renderable.color = color; }
  set alpha(alpha) { this.#renderable.alpha = alpha; }
  set depth(depth) { this.#renderable.depth = depth; }

  set renderMode(renderMode) {
    if (renderMode !== this.#renderable.renderMode) {
      this.#indices.splice(0, this.#indices.length);
    }

    this.#renderable.renderMode = renderMode;
  }

  set shader(shader) {
    this.#renderable.shader = shader;
  }

  set outline(outline) {
    this.#renderable.outline = outline;
  }

  set lineWidth(lineWidth) {
    this.#renderable.lineWidth = lineWidth;
  }
  // ...getters/setters
  

  // public methods...
  copy(other) {
    if (!(other instanceof Shape)) {
      throw new TypeError("Shape (copy): other should be " +
        "a Shape");
    }

    super.copy(other);

    this.#indices = other.#indices.slice();

    this.#colors.splice(0, this.#colors.length);
    for (let c of other.#colors) {
      this.#colors.push(c.getCopy());
    }

    this.#frames.splice(0, this.#frames.length);
    for (let f of other.#frames) {
      this.#frames.push(f.getCopy());
    }

    this.#currentFrame = other.#currentFrame;
    this.animated = other.animated;
    
    this.#startFrame = other.#startFrame;
    this.#endFrame   =   other.#endFrame;
    this.#direction  =  other.#direction;
    this.#loopCount  =  other.#loopCount;
    this.#loopMax    =    other.#loopMax;
    this.#timer      =      other.#timer;

    this.#renderable = other.#renderable.getCopy();
  }

  getCopy() {
    let copy = new Shape();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    if (!(other instanceof Shape)) {
      throw new TypeError("Shape (equals): other should be " +
        "a Shape");
    }

    return (
      super.equals(other) &&

      this.#indices.length === other.#indices.length &&
      this.#indices.every((e, i) => {
        return e === other.#indices[i];
      }) &&

      this.#colors.length === other.#colors.length &&
      this.#colors.every((e, i) => {
        return e.equals(other.#colors[i]);
      }) &&

      this.#frames.length === other.#frames.length &&
      this.#frames.every((e, i) => {
        return e.equals(other.#frames[i]);
      }) &&

      // this.#currentFrame === this.#currentFrame &&
      this.animated === other.animated &&
      
      this.#startFrame === other.#startFrame &&
      this.#endFrame   ===   other.#endFrame &&
      this.#direction  ===  other.#direction &&
      this.#loopCount  ===  other.#loopCount &&
      this.#loopMax    ===    other.#loopMax &&
      // this.#timer      ===      other.#timer &&

      this.#renderable.equals(other.#renderable)
    );
  }

  process(dt) {
    if (this.animated && this.#frames.length > 0) {
      this.#timer += dt;

      let currFrame = this.currentFrame;
      let limit = this.#frames[currFrame].limit;

      while (this.#timer >= limit) {
        this.#timer -= limit;

        if (currFrame === this.#endFrame) {
          if (this.#loopCount != 0) {
            if (this.#loopCount > 0) {
              --this.#loopCount;
            }

            currFrame = this.#startFrame - this.#direction;
          } else {
            this.animated = false;
            break;
          }
        }
        
        currFrame = (currFrame + this.#direction) % this.#frames.length;
        if (currFrame < 0) {
          currFrame = this.#frames.length - 1;
        }
        
        limit = this.#frames[currFrame].limit;
      }

      if (this.currentFrame !== currFrame) {
        this.currentFrame = currFrame;
        return true;
      }
    }

    return false;
  }

  pushFrame(textureIn, layerIn, sIn, tIn) {
    this.#frames.push(new Shape.Frame({
      texture: textureIn,
      layer: layerIn,
      s: sIn,
      t: tIn,
    }));
  }

  pushFrameStrip(textureIn, layerIn, count, row = count, column = 1,
    start = 0, offset = new Vec2()) {

    let width = textureIn.width / row;
    let height = textureIn.height / column;

    let increment = new Vec2((width - offset.x) / textureIn.width,
      (height - offset.y) / textureIn.height);

    let spacing = new Vec2(offset.x / textureIn.width,
      offset.y / textureIn.height);

    for (let i = start; i < count + start; ++i) {
      // calculate the s and t coordinates for each frame by
      // splitting the texture into the specified number of
      // rows and columns

      let s = i % row;
      let t = Math.trunc(i / row);

      let sOut = new Vec2((s * increment.x) + (s * spacing.x),
        ((s + 1) * increment.x) + (s * spacing.x));
			let tOut = new Vec2((t * increment.y) + (t * spacing.y),
        ((t + 1) * increment.y) + (t * spacing.y));

      this.pushFrame(textureIn, layerIn, sOut, tOut);
    }
  }

  setAnimation(speeds, start, end, direction, loops) {
    if (this.#frames.length !== 0) {
      this.#startFrame = Math.min(this.#frames.length - 1, start);
      this.#endFrame = Math.min(this.#frames.length - 1, end);
    } else {
      this.#startFrame = 0;
      this.#endFrame = 0;
    }

    if (this.#startFrame !== this.#endFrame && direction !== 0) {
      this.animated = true;
      this.#direction = direction;

      let frameCount = 0;

      { // calculate the number of frames between start and end
        // frame accounting for animation direction and looping
        // past the start or end of the frames array

        let s = this.#startFrame;
        let e = this.#endFrame;
        
        if (direction < 0) {
          let t = s;
          s = e;
          e = t;
        }

        if (s < e) {
          frameCount = (e + 1) - s;
        } else {
          frameCount = (this.#frames.length - s) +(e + 1);
        }
      }

      
      { // if there is insufficient speed values for every frame of the
        // animation then pad the values with either default
        // (1/60 of a second) if there are no values at all,
        // or with the last speed value

        let speedPad = 0.0167;

        if (speeds.length !== 0) {
          speedPad = speeds[speeds.length - 1];
        }
        
        if (speeds.length < frameCount) {
          let len = speeds.length;
          speeds.length = frameCount;
          for (let i = len; i < speeds.length; ++i) {
            speeds[i] = speedPad;
          }
        }
      }

      // assign the speed values to each frame of the animation in order
      for (let i = this.#startFrame, j = 0; ; i += this.#direction, ++j) {
        i = i % this.#frames.length;
        
        this.#frames[i].limit = speeds[j];
        
        if (i === this.#endFrame) {
          break;
        } else if (i === 0 && this.#direction < 0) {
          i = this.#frames.length;
        }
      }

      this.#loopCount = -1;
      if (loops !== undefined) {
        this.#loopCount = loops;
      }

      this.#loopMax = this.#loopCount;
      this.#timer = 0.0;
      this.currentFrame = this.#startFrame;
    } else {
      this.animated = false;
    }
  }

  resetAnimation() {
    this.#loopCount = this.#loopMax;

    this.#timer = 0.0;
    this.currentFrame = this.#startFrame;
  }

  // a naive ear clipping algorithm
  triangulate() {
    if (this.verts.length > 2) {
      if (!this.isCCW()) {
        this.reverseWinding();
      }

      let indices = new Array();
      let indexArray = new Array();
      
      // create a doubly linked list of indices
      let len = this.verts.length;
      for (let i = 0; i < len; ++i) {
        indexArray.push([i, (((i - 1) % len) + len) % len,
            (i + 1) % len]);
      }

      let indexCount = this.verts.length;
      let loopCount = 0;
      let curr = 0;
      
      while (indexCount > 3 && loopCount < indexCount) {
        const i  = indexArray[curr             ][0];
        const i2 = indexArray[indexArray[i ][2]][0];
        const i3 = indexArray[indexArray[i2][2]][0];

        const v  = this.verts[i ];
        const v2 = this.verts[i2];
        const v3 = this.verts[i3];

        // we don't need the exact angle; a negative determinant
        // indicates a convex angle (a determinant of 0 means vertices
        // are in parallel i.e., in a line so we treat them as convex
        // for the purposes of rendering
        
        const v2v  = new Vec2( v.x - v2.x,  v.y - v2.y);
        const v2v3 = new Vec2(v3.x - v2.x, v3.y - v2.y);
        const det = v2v.getDeterminant(v2v3);
        
        if (det <= 0) {
          let success = true;
          let c = indexArray[indexArray[i3][2]][0];

          do {
            // check all other vertices in the polygon to ensure none
            // are inside the 'ear' we are clipping

            let poly = new Polygon;
            poly.pushVerts([v, v2, v3]);
            let pt = this.verts[c];

            if (!poly.isPointInside(pt)) {
              c = indexArray[indexArray[c][2]][0];
            } else {
              c = i;
              success = false;
            }
          } while (c != i);

          if (success) {  // if the current triangle is a valid 'ear'...
            indices.push(i, i2, i3);
            indexArray[curr][2] = i3;
            indexArray[i3  ][1] = curr;
            --indexCount;
            loopCount = 0;
          } else {
            curr = i2;
            ++loopCount;
          }
        } else { // current 'ear' is not valid (concave)
          curr = i2;
          ++loopCount;
        }
      }

      if (loopCount === indexCount) { // if we broke out of loop due to
        // not finding a valid 'ear' after looping all vertices
        
        throw new RangeError("triangulate(): failed to triangulate " +
        "polygon (no valid ears)");
      }

      if (indexCount === 3) { // handle the last triangle
        const i  = indexArray[             curr][0];
        const i2 = indexArray[indexArray[i ][2]][0];
        const i3 = indexArray[indexArray[i2][2]][0];

        indices.push(i, i2, i3);
      }

      this.#indices = indices.slice();
    }
  }

  asData() {
    let renderMode = this.renderMode;
    let verts = this.verts;

    switch (renderMode) {
      case GL.POINTS :
        if (this.#indices.length === 0) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.#indices.push(i);
          }
        }

        break;
      case GL.LINES :
        if (this.#indices.length === 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.#indices.push(i);
          }
        }

        break;
      case GL.LINE_LOOP :
        renderMode = GL.LINES; // manually loop lines

        if (this.#indices.length === 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.#indices.push(i);

            if (i + 1 < this.verts.length) {
              this.#indices.push(i + 1);
            } else {
              this.#indices.push(0);
            }
          }
        }

        break;
      case enums.Rendering.LINES :
        if (this.#indices.length === 0) {
          this.#generateOutline("lines");
        }

        // render outline as triangles
        verts = this.outline;
        renderMode = GL.TRIANGLES;

        break;
      case enums.Rendering.LINE_LOOP :
        if (this.#indices.length === 0) {
          this.#generateOutline();
        }

        // render outline as triangles
        verts = this.outline;
        renderMode = GL.TRIANGLES;

        break;
      case GL.TRIANGLES :
      default :
        if (this.#indices.length === 0) {
          this.triangulate();
        }

        break;
    }

    let frame = new Shape.Frame();
    if (this.currentFrame < this.#frames.length) {
      frame.copy(this.#frames[this.currentFrame]);
    }

    let transMat = this.transformable.asMat3();

    let vboVerts = new Array();
    let invMinMax = new Vec2(
      1 / (this.boundingBox.upper.x - this.boundingBox.lower.x),
      1 / (this.boundingBox.upper.y - this.boundingBox.lower.y)
    );
    
    let colors = this.#colors.slice();

    if (this.renderMode === enums.Rendering.LINES||
      this.renderMode === enums.Rendering.LINE_LOOP) {

      // if rendermode is an outline then color values need to
      // be adjusted like so (as a 2 vertex line is now a 4
      // vertex rectangle):
      //   [0, 1, 2, 3] -> [0, 1, 1, 0, 2, 3, 3, 2]
      // (an odd numbered colors array needs to be padded with
      // the base color beforehand)

      if (colors.length % 2 === 1) {
        colors.push(this.color.getCopy());
      }

      colors = colors.flatMap((ele, ind, arr) => {
        if (ind % 2 === 1) {
          return [arr[ind - 1], ele, ele, arr[ind - 1]];
        }

        return [];
      });
    }

    // pad the color array to match the number of vertices
    let diff = verts.length - this.#colors.length;
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }
    
    // [!] allow per-vertex transparency
    // diff = verts.length - this.#colors.length;
    let alphas = [];
    diff = verts.length;
    if (diff > 0) {
      alphas = alphas.concat(
        new Array(diff).fill(this.alpha)
      );
    }

    for (let i = 0; i < verts.length; ++i) {
      const v = verts[i];
      const c = colors[i];
      const a = alphas[i];

      let vboVert = new VBOVertex();

      vboVert.x = (transMat.arr[0] * v.x) +
        (transMat.arr[3] * v.y) + transMat.arr[6];
      vboVert.y = (transMat.arr[1] * v.x) +
        (transMat.arr[4] * v.y) + transMat.arr[7];
      vboVert.z = this.depth;

      let normVec = transMat.getMultVec3(new Vec3(0.0, 0.0, 1.0));

      // normalize normal vector between [0.0: 1.0]
      normVec.normalize();
      normVec.x = (normVec.x + 1.0) * 0.5;
      normVec.y = (normVec.y + 1.0) * 0.5;
      normVec.z = (normVec.z + 1.0) * 0.5;
      
      // pack normal into 32bit unsigned int which is normalized
      // to the range [-1.0: 1.0] when unpacked
      vboVert.normal =              0 | ((normVec.z * 1023) << 20);
      vboVert.normal = vboVert.normal | ((normVec.y * 1023) << 10);
      vboVert.normal = vboVert.normal | ((normVec.x * 1023) <<  0);

      vboVert.r = c.x; vboVert.g = c.y;
      vboVert.b = c.z; vboVert.a = a;

      let ratio = new Vec2(
        (v.x - this.boundingBox.lower.x) * invMinMax.x,
        (v.y - this.boundingBox.lower.y) * invMinMax.y
      );

      // pack floating point values into unsigned short
      vboVert.s = (((1 - ratio.x) * frame.s.x) +
        (ratio.x * frame.s.y)) * 65535;
      vboVert.t = (((1 - ratio.y) * frame.t.x) +
        (ratio.y * frame.t.y)) * 65535;
      vboVert.textureLayer = frame.layer;
      
      if (frame.texture && frame.texture.texture) {
        vboVert.textureFlag = 1;
      }

      vboVerts.push(vboVert);
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this.#indices.slice();
    rbd.renderMode = renderMode;
    rbd.textureRef = (frame.texture) ? frame.texture.texture : null;
    rbd.depth = this.depth;

    return [rbd];
  }

  pushVert(vert) {
    super.pushVert(vert);
    this.#indices.splice(0, this.#indices.length);
  }

  pushVerts(verts) {
    super.pushVerts(verts);
    this.#indices.splice(0, this.#indices.length);
  }
  // ...public methods


  // private methods...
  #generateOutline(mode) {
    let halfWidth = this.lineWidth * 0.5;
    
    let rects   = new Array();
    const verts = this.verts;

    let indices = new Array();

    // if render mode is "lines" then we need to check
    // them in pairs (0 + 1, 2 + 3, 4 + 5, etc) rather than
    // sequentially (0 + 1, 1 + 2, 2 + 3, etc)

    let length = (mode === "lines") ? verts.length - (verts.length % 2) :
      verts.length;
    let inc = (mode === "lines") ? 2 : 1;

    for (let i = 0; i < length; i += inc) {
      // calculate the rectangles that surround
      // the polygon's lines

      const a = verts[i];
      const b = (mode === "lines") ? verts[(i + 1)] : 
        verts[(i + 1) % verts.length];

      if (!a.equals(b, 0.01)) {
        // if vertices are not coincident then get the
        // _perpendicular_ unit vector from this point
        // to the next (A -> B)

        let ab = new Vec2(a.y - b.y, b.x - a.x);
        let norm = ab.getNormalized();

        let offs = new Vec2(norm.x * halfWidth,
            norm.y * halfWidth);

        rects.push(
          new Vec2(a.x + offs.x, a.y + offs.y),
          new Vec2(b.x + offs.x, b.y + offs.y),
          new Vec2(b.x - offs.x, b.y - offs.y),
          new Vec2(a.x - offs.x, a.y - offs.y)
        );
      }
    }

    for (let i = 0; i < rects.length; i += 4) {
      if (mode !== "lines") {
        // every rectangle will have one side that intersects
        // and one side that has a gap unless they are collinear

        let j = (i + 4) % rects.length;

        // [!] differentiate which lines in the rectangle we are
        // checking for intersection and which we are connecting
        // beforehand

        // deal with the intersection

        let intersect = Polygon.SegSeg(
          [rects[i], rects[i + 1]],
          [rects[j], rects[j +1]]
        );

        if (intersect.intersects) {
          rects[i + 1] = intersect.point.getCopy();
          rects[j    ] = intersect.point.getCopy();
        }

        // deal with the gap

        // square miter: just connect them together with
        // another line segment and half it
        let lne = new Vec2(
          (rects[j + 3].x + rects[i + 2].x) * 0.5,
          (rects[j + 3].y + rects[i + 2].y) * 0.5
        )

        // [!] point miter: find the point of intersection
        // of both lines extended

        // [!] round miter: add triangles to form an arc
        // depending on resolution (and length of gap)

        rects[i + 2] = lne.getCopy();
        rects[j + 3] = lne.getCopy();
      }

      indices.push(
            i, i + 3, i + 1,
        i + 1, i + 3, i + 2
      );
    }

    this.outline = rects;
    this.#indices = indices;
  }
  // ...private methods
};

export default Shape;
