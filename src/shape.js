import GL from './gl.js';
import Sol from './sol.js';

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
  //> nested class //
  static Frame = class Frame {
    // a frame is essentially just a reference to a texture
    // and a set of corresponding coordinates

    //> internal properties //
    _texture = null;

    _s = new Vec2(0.0, 1.0);
    _t = new Vec2(0.0, 1.0);
    _layer = 0;

    //> constructor //
    constructor(initializerList = {}) {
      if (initializerList) {
        this.texture = (initializerList.texture !== undefined) ?
          initializerList.texture : null;
        
        this.s = initializerList.s || new Vec2(0.0, 1.0);
        this.t = initializerList.t || new Vec2(0.0, 1.0);
        this.layer = initializerList.layer || 0;
      }
    }

    //> getters //
    get texture() { return this._texture; }
    get s() { return this._s; }
    get t() { return this._t; }
    get layer() { return this._layer; }

    //> setters //
    set texture(texture) {
      Sol.checkTypes("Shape.Frame", "set texture",
      [{texture}, [Texture, null]]);

      this._texture = texture;
    }

    set s(s) {
      Sol.checkTypes("Shape.Frame", "set s",
      [{s}, [Vec2]]);

      this._s = s;
    }

    set t(t) {
      Sol.checkTypes("Shape.Frame", "set t",
      [{t}, [Vec2]]);

      this._t = t;
    }

    set layer(layer) {
      Sol.checkTypes("Shape.Frame", "set layer",
      [{layer}, [Number]]);

      this._layer = layer;
    }

    //> public methods //
    copy(other) {
      Sol.checkTypes("Shape.Frame", "copy",
      [{other}, [Shape.Frame]]);

      this._texture = other._texture;

      this._s = other._s.getCopy();
      this._t = other._t.getCopy();
      this._layer = other._layer;
    }

    getCopy() {
      let copy = new Shape.Frame();
      copy.copy(this);

      return copy;
    }

    equals(other) {
      Sol.checkTypes("Shape.Frame", "equals",
      [{other}, [Shape.Frame]]);
      
      return (
        this._texture === other._texture &&

        this._s.equals(other._s) &&
        this._t.equals(other._t) &&
        this._layer === other._layer
      );
    }
  };


  //> nested class //
  static Animation = class Animation {
    // an animation object holds information dictating how frames
    // (as stored in a shape's _frames property) are displayed
    // (that is, in what order and for how long)
    
    //> internal properties //
    _index = 0;

    _frames = new Array();
    _dirInit = 1;
    _loopMax = -1;
    _loopDir = 1;

    _loopCount = -1;
    _dirCurr = 1;

    //> constructor //
    constructor() {
      
    }

    //> getters //
    get currentIndex() {
      return (this._index < this._frames.length) ?
        this._frames[this._index]._index : -1;
    }

    get currentTime() {
      return (this._index < this._frames.length) ?
        this._frames[this._index]._time : -1;
    }

    //> public methods //
    copy(other) {
      Sol.checkTypes("Shape.Animation", "copy",
      [{other}, [Shape.Animation]]);

      this._index = other._index;

      this._frames.splice(0, this._frames.length);
      for (let f of other._frames) {
        this._frames.push({_index: f._index, _time: f._time});
      }

      this._dirInit = other._dirInit;
      this._loopMax = other._loopMax;
      this._loopDir = other._loopDir;

      this._loopCount = other._loopCount;
      this._dirCurr = other._dirCurr;
    }

    getCopy() {
      let copy = new Shape.Animation();
      copy.copy(this);

      return copy;
    }

    equals(other) {
      Sol.checkTypes("Shape.Animation", "equals",
      [{other}, [Shape.Animation]]);

      // only check if the animation's initial state
      // matches other
      
      return (
        this._frames.length === other._frames.length &&
        this._frames.every((e, i) => {
          return (
            e._index === other._frames[i]._index &&
            e._time  === other._frames[i]._time
          );
        }) &&

        this._dirInit === other._dirInit &&
        this._loopMax === other._loopMax &&
        this._loopDir === other._loopDir
      );
    }

    fromRange(frameCount, timingsIn = [], startIn = 0, endIn = frameCount,
      directionIn = "forward", loopsIn = -1) {

      // create the animation from an inclusive range from start
      // to end, first creating an array of indices and then passing
      // it to the fromArray method to do the actual creation

      Sol.checkTypes("Shape.Animation", "fromRange",
      [{frameCount}, [Number]], [{timingsIn}, [Array]],
      [{startIn}, [Number]], [{endIn}, [Number]],
      [{directionIn}, [String]], [{loopsIn}, [Number]]);
      
      let indices = new Array();

      if (frameCount > 0) {
        // sanitise the start and end indices to be within the range
        // 0 > n > frameCount - 1

        let len = frameCount;
        let max = Math.max(len - 1, 0);
        let start = Math.max(Math.min(max, startIn), 0);
        let end = Math.max(Math.min(max, endIn), 0);

        // create the index array with indices from start to end
        // (inclusive), moving in the requested direction and wrapping
        // around (-1 to (frameCount - 1)) and (frameCount to 0)

        let dir = (directionIn.match(/reverse/i) !== null) ? -1 : 1;
        let curr = start;
        indices.push(curr);

        while (curr !== end) {
          curr = ((curr + dir) + len) % len;
          indices.push(curr);
        }

        this.fromArray(indices, timingsIn, directionIn, loopsIn);
      }
    }

    fromArray(indices, timingsIn = [], directionIn = "forward",
      loopsIn = -1) {

      // create the animation from an array of frame indices
      // which correspond to frames as they are store in the
      // parent shape's frame array

      Sol.checkTypes("Shape.Animation", "fromArray",
      [{timingsIn}, [Array]], [{indices}, [Array]],
      [{directionIn}, [String]], [{loopsIn}, [Number]]);

      let anim = new Shape.Animation();

      anim._loopMax = loopsIn;
      anim._loopCount = loopsIn;

      // use the input direction string to decide both initial
      // animation direction as well as how to loop animation
      // (either continue in same direction or reverse direction)

      switch (directionIn) {
        case "forward-bounce" :
          anim._loopDir = -1;
          break;
        case "reverse" :
          anim._dirInit = -1;
          
          anim._dirCurr = -1;
          break;
        case "reverse-bounce" :
          anim._dirInit = -1;
          anim._loopDir = -1;

          anim._dirCurr = -1;
          break;
        default :
          break;
      }

      // reverse the timings so we can pull from the end
      // until we run out of values (at which point we
      // just use the previous value)

      let timings = timingsIn.toReversed();
      let time = Sol.minFrameTime;

      // populate the frames array with pairs of frame indices
      // (as they exist in shape frames array) and frame times 
      
      for (let ind of indices) {
        time = (timings.length > 0) ?
          Math.max(timings.pop(), Sol.minFrameTime) : time;
        
        anim._frames.push({
          _index: Math.max(ind, 0),
          _time: time
        });
      }

      this.copy(anim);
    }

    reset() {
      // reset the animation state back to its initial values

      this._index = 0;

      this._loopCount = this._loopMax;
      this._dirCurr = this._dirInit;
    }

    advance() {
      // increment the current index until we reach the end
      // and then handle looping logic

      // return false if animation has finished, otherwise
      // return true

      if ((this._index === this._frames.length - 1 && this._dirCurr > 0) ||
        (this._index === 0 && this._dirCurr < 0)) {

        if (this._loopCount === 0) {
          return false;
        }

        this._loopCount = Math.max(this._loopCount - 1, -1);
        this._dirCurr *= this._loopDir;
      }

      this._index = ((this._index + this._dirCurr) +
        this._frames.length) % this._frames.length;

      return true;
    }
  };
  

  // a shape is a polygon that can be rendered to the context

  //> public properties //
  animating = false;

  //> internal properties //
  _indices = new Array();
  _colors = new Array();

  _frames = new Array();
  _currentFrame = 0;
  _animation = new Shape.Animation();
  _timer = 0;

  _renderable = new Renderable();

  //> constructor //
	constructor(verts = undefined) {
    // call super constructor with no argument
    // to prevent calling derived setter for
    // verts without fully initialising derived
    // class (this._indices)

    super();

    if (verts !== undefined) {
      this.verts = verts;
    }
  }

  //> getters/setters (polygon) //
  get verts() { return super.verts; }

  set verts(verts) {
    super.verts = verts;
    this._indices.splice(0, this._indices.length);
  }

  //> getters //
  get indices() { return this._indices; }
  get colors() { return this._colors; }
  get frames() { return this._frames; }
  get currentFrame() { return this._currentFrame; }
  get animation() { return this._animation; }
  get timer() { return this._timer; }
  get renderable() { return this._renderable; }

  //> setters //
  set indices(indices) {
    Sol.checkTypes(this, "set indices",
    [{indices}, [Array]]);

    for (const index of indices) {
      if (typeof index !== 'number') {
        throw new TypeError("Shape (set indices): indices should " +
        "be an Array of Number");
      }
    }

    this._indices = indices;
  }

  set colors(colors) {
    Sol.checkTypes(this, "set colors",
    [{colors}, [Array]]);

    for (const color of colors) {
      if (!(color instanceof Vec3)) {
        throw new TypeError("Shape (set colors): colors should " +
        "be an Array of Vec3");
      }
    }

    this._colors = colors;
  }

  set frames(frames) {
    Sol.checkTypes(this, "set frames",
    [{frames}, [Array]]);

    for (const frame of frames) {
      if (!(frame instanceof Shape.Frame)) {
        throw new TypeError("Shape (set frames): frames should " +
        "be an Array of Shape.Frame");
      }
    }

    this._frames = frames;
  }

  set currentFrame(currentFrame) {
    Sol.checkTypes(this, "set currentFrame",
    [{currentFrame}, [Number]]);

    this._currentFrame = currentFrame;
  }
  
  set animation(animation) {
    Sol.checkTypes(this, "set animation",
    [{animation}, [Shape.Animation]]);

    this._animation = animation;
  }

  set timer(timer) {
    Sol.checkTypes(this, "set timer",
    [{timer}, [Number]]);

    this._timer = timer;
  }

  //> getters (renderable) //
  get color() { return this._renderable.color; }
  get alpha() { return this._renderable.alpha; }
  get depth() { return this._renderable.depth; }
  get renderMode() { return this._renderable.renderMode; }
  get shader() { return this._renderable.shader; }
  get outline() { return this._renderable.outline; }
  get lineWidth() { return this._renderable.lineWidth; }

  //> setters (renderable) //
  set color(color) { this._renderable.color = color; }
  set alpha(alpha) { this._renderable.alpha = alpha; }
  set depth(depth) { this._renderable.depth = depth; }

  set renderMode(renderMode) {
    if (renderMode !== this._renderable.renderMode) {
      this._indices.splice(0, this._indices.length);
    }

    this._renderable.renderMode = renderMode;
  }

  set shader(shader) {
    this._renderable.shader = shader;
  }

  set outline(outline) {
    this._renderable.outline = outline;
  }

  set lineWidth(lineWidth) {
    this._renderable.lineWidth = lineWidth;
  }
  
  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
    [{other}, [Shape]]);

    super.copy(other);

    this.animating = other.animating;
    this._indices = other._indices.slice();

    this._colors.splice(0, this._colors.length);
    for (let c of other._colors) {
      this._colors.push(c.getCopy());
    }

    this._frames.splice(0, this._frames.length);
    for (let f of other._frames) {
      this._frames.push(f.getCopy());
    }

    this._animation = other._animation.getCopy();
    this._currentFrame = other._currentFrame;
    this._timer = other._timer;

    this._renderable = other._renderable.getCopy();
  }

  getCopy() {
    let copy = new Shape();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
    [{other}, [Shape]]);

    // for the sake of equality we don't care about the current
    // state of the animation (current frame and timer) only the
    // initial state (eg, loop count, direction, etc)

    return (
      super.equals(other) &&

      this._indices.length === other._indices.length &&
      this._indices.every((e, i) => {
        return e === other._indices[i];
      }) &&

      this._colors.length === other._colors.length &&
      this._colors.every((e, i) => {
        return e.equals(other._colors[i]);
      }) &&

      this._frames.length === other._frames.length &&
      this._frames.every((e, i) => {
        return e.equals(other._frames[i]);
      }) &&

      this._animation.equals(other._animation) &&

      this._renderable.equals(other._renderable)
    );
  }

  process(dt) {
    // if shape is currently animating then check if current
    // frame time has elapsed and switch to the next as
    // specified by the shape's assigned animation, or
    // indicate animation has finished if no next frame

    Sol.checkTypes(this, "process", [{dt}, [Number]]);

    if (this.animating === true) {
      let limit = this._animation.currentTime;

      while (this._timer >= limit && limit > 0) {
        this._timer -= limit;

        if (this._animation.advance() === true) {
          this.currentFrame = this._animation.currentIndex;

          limit = this._animation.currentTime;
        } else {
          this.animating = false;
          break;
        }
      }

      this._timer += dt;
    }
  }

  pushFrame(textureIn, layerIn, sIn, tIn) {
    this._frames.push(new Shape.Frame({
      texture: textureIn,
      layer: layerIn,
      s: sIn,
      t: tIn,
    }));
  }

  pushFrameStrip(textureIn, layerIn, countIn, columnsIn = countIn,
    rowsIn = 1, startIn = 0, offset = new Vec2()) {

    // add multiple frames by dividing a single texture into
    // rectangles (columns and rows), separated by an optional
    // offset
    
    // (layerIn type is checked in Shape.Frame constructor)

    Sol.checkTypes(this, "pushFrameStrip", [{textureIn}, [Texture]],
    [{countIn}, [Number]], [{columnsIn}, [Number]], [{rowsIn}, [Number]],
    [{startIn}, [Number]], [{offset}, [Vec2]]);

    // sanitise the input to be within acceptable ranges
    
    let cols = Math.min(Math.max(columnsIn, 1), textureIn.width);
    let rows = Math.min(Math.max(rowsIn, 1), textureIn.height);

    let start = Math.max(startIn, 0);
    let count = Math.min(Math.max(countIn, 1) + start, cols * rows);

    // calculate the dimensions of a frame in terms of
    // texture coordinates, as well as the gaps between
    // frames (if applicable)

    let totalOffset = new Vec2(
      offset.x * (cols - 1),
      offset.y * (rows - 1)
    );

    let frameDimensions = new Vec2(
      (textureIn.width - totalOffset.x) / cols,
      (textureIn.height - totalOffset.y) / rows
    );

    let increment = new Vec2(frameDimensions.x / textureIn.width,
      frameDimensions.y / textureIn.height);

    let spacing = new Vec2(offset.x / textureIn.width,
      offset.y / textureIn.height);

    for (let i = start; i < count; ++i) {
      // calculate the s and t coordinates for each frame by
      // splitting the texture into the specified number of
      // rows and columns

      let s = i % cols;
      let t = Math.trunc(i / cols);

      let sOut = new Vec2((s * increment.x) + (s * spacing.x),
        ((s + 1) * increment.x) + (s * spacing.x));
			let tOut = new Vec2((t * increment.y) + (t * spacing.y),
        ((t + 1) * increment.y) + (t * spacing.y));

      this.pushFrame(textureIn, layerIn, sOut, tOut);
    }
  }

  setAnimation(timingsIn = [], startIn = 0, endIn = -1,
    directionIn = "forward", loopsIn = -1) {

    // create an animation using the range startIn >= n >= endIn
    // and start the animation if valid

    Sol.checkTypes(this, "setAnimation", [{endIn}, [Number]]);

    let anim = new Shape.Animation();
    let end = (endIn < 0) ? this._frames.length - 1 : endIn;

    anim.fromRange(this._frames.length, timingsIn,
      startIn, end, directionIn, loopsIn);
    
    this._animation = anim;
    this.resetAnimation();
  }

  setAnimationArray(indices, timingsIn = [], directionIn = "forward",
    loopsIn = -1) {

    let anim = new Shape.Animation();

    anim.fromArray(indices, timingsIn, directionIn, loopsIn);

    this._animation = anim;
    this.resetAnimation();
  }

  resetAnimation() {
    // reset the current animation back to its initial state
    // and update shape's animation status accordingly

    this._animation.reset();

    this._timer = 0;

    this.animating = (this._animation._frames.length > 0) ? true : false;
    this.currentFrame = (this._animation._frames.length > 0)
      ? this._animation._frames[0]._index : 0;
  }

  triangulate() {
    // [!] can be drastically improved
    // a naive ear clipping algorithm

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
        // for the purposes of rendering)
        
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

      this._indices = indices.slice();
    }
  }

  asData() {
    let renderMode = this.renderMode;
    let verts = this.verts;

    switch (renderMode) {
      case GL.POINTS :
        if (this._indices.length === 0) {
          for (let i = 0; i < this.verts.length; ++i) {
            this._indices.push(i);
          }
        }

        break;
      case GL.LINES :
        if (this._indices.length === 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this._indices.push(i);
          }
        }

        break;
      case GL.LINE_LOOP :
        renderMode = GL.LINES; // manually loop lines

        if (this._indices.length === 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this._indices.push(i);

            if (i + 1 < this.verts.length) {
              this._indices.push(i + 1);
            } else {
              this._indices.push(0);
            }
          }
        }

        break;
      case enums.Rendering.LINES :
        if (this._indices.length === 0) {
          this._generateOutline("lines");
        }

        // render outline as triangles
        verts = this.outline;
        renderMode = GL.TRIANGLES;

        break;
      case enums.Rendering.LINE_LOOP :
        if (this._indices.length === 0) {
          this._generateOutline();
        }

        // render outline as triangles
        verts = this.outline;
        renderMode = GL.TRIANGLES;

        break;
      case GL.TRIANGLES :
      default :
        if (this._indices.length === 0) {
          this.triangulate();
        }

        break;
    }

    let frame = new Shape.Frame();
    if (this.currentFrame < this._frames.length) {
      frame.copy(this._frames[this.currentFrame]);
    }

    let transMat = this.transformable.asMat3();

    let vboVerts = new Array();
    let invMinMax = new Vec2(
      1 / (this.boundingBox.upper.x - this.boundingBox.lower.x),
      1 / (this.boundingBox.upper.y - this.boundingBox.lower.y)
    );
    
    let colors = this._colors.slice();

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
    let diff = verts.length - this._colors.length;
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }
    
    // [!] allow per-vertex transparency
    // diff = verts.length - this._colors.length;
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

      vboVert.s = (((1 - ratio.x) * frame.s.x) +
        (ratio.x * frame.s.y));
      vboVert.t = (((1 - ratio.y) * frame.t.x) +
        (ratio.y * frame.t.y));
      vboVert.textureLayer = frame.layer;
      
      if (frame.texture && frame.texture.texture) {
        vboVert.textureFlag = 1;
      }

      vboVerts.push(vboVert);
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this._indices.slice();
    rbd.renderMode = renderMode;
    rbd.shaderRef = (this.shader) ? this.shader : null;
    rbd.textureRef = (frame.texture) ? frame.texture.texture : null;
    rbd.depth = this.depth;

    return [rbd];
  }

  pushVert(vert) {
    super.pushVert(vert);
    this._indices.splice(0, this._indices.length);
  }

  pushVerts(verts) {
    super.pushVerts(verts);
    this._indices.splice(0, this._indices.length);
  }

  //> internal methods //
  _generateOutline(mode) {
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

        let intersect = Polygon.segSeg(
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
    this._indices = indices;
  }
};

export default Shape;
