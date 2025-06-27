import GL from './gl.js'

// import Font from './font.js';
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
      #t = new Vec2(1.0, 0.0);

      #limit = 0.0167;
    // ...

    constructor(texture = null, s = new Vec2(0.0, 1.0),
      t = new Vec2(1.0, 0.0), limit = 0) {

      this.texture = texture;
      this.s = s;
      this.t = t;
      this.limit = limit;
    }

    //
      get texture() { return this.#texture; }
      get s() { return this.#s; }
      get t() { return this.#t; }
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

  pushFrame(texture) {
    this.#frames.push(new Shape.Frame(texture));
  }

  pushFrameRect(texture, rect) {
    this.#frames.push(new Shape.Frame(texture, rect[0], rect[1]));
  }

  pushFrameStrip(texture, count, row = count, column = 1,
    start = 0, offset = new Vec2()) {

    let width = texture.width / row;
    let height = texture.height / column;

    let increment = new Vec2((width - offset.x) / texture.width,
      (height - offset.y) / texture.height);

    let spacing = new Vec2(offset.x / texture.width,
      offset.y / texture.height);

    for (let i = start; i < count + start; ++i) {
      let s = i % row;
      let t = Math.trunc(i / row);

      let min = new Vec2((s * increment.x) + (s * spacing.x),
          ((t + 1) * increment.y) + (t * spacing.y));
			let max = new Vec2(((s + 1) * increment.x) + (s * spacing.x),
          (t * increment.y) + (t * spacing.y));

      this.#frames.push(new Shape.Frame(texture, min, max));
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

    let texRect = [new Vec2(0.0, 1.0), new Vec2(1.0, 0.0)];
    let tex = null;
    if (this.currentFrame < this.#frames.length) {
      texRect = [this.#frames[this.currentFrame].s,
        this.#frames[this.currentFrame].t];
      tex = this.#frames[this.currentFrame].texture.texture;
    }

    let transMat = this.transformable.asMat3();

    let vboVerts = new Array();
    let invMinMax = new Vec2(
      1 / (this.boundingBox.upper.x - this.boundingBox.lower.x),
      1 / (this.boundingBox.upper.y - this.boundingBox.lower.y)
    );
    
    // [!] for colors and outline we need to double the
    // colors

    // pad the color array to match the number of vertices
    let diff = verts.length - this.#colors.length;
    let colors = this.#colors.slice();
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }

    for (let i = 0; i < verts.length; ++i) {
      const v = verts[i];
      const c = colors[i];

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
      vboVert.b = c.z; vboVert.a = this.alpha;

      let ratio = new Vec2(
        (v.x - this.boundingBox.lower.x) * invMinMax.x,
        (v.y - this.boundingBox.lower.y) * invMinMax.y
      );

      // pack floating point values into unsigned short
      vboVert.s = (((1 - ratio.x) * texRect[0].x) +
        (ratio.x * texRect[1].x)) * 65535;
      vboVert.t = (((1 - ratio.y) * texRect[0].y) +
        (ratio.y * texRect[1].y)) * 65535;
      
      if (tex) {
        vboVert.textureFlag = 1;
      }

      vboVerts.push(vboVert);
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this.#indices.slice();
    rbd.renderMode = renderMode;
    rbd.textureRef = tex;
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

  /* fromText(text, font, fontSize, width = 0) {
    if (typeof text !== 'string') {
      throw new TypeError("Shape (fromText): text should be a String");
    } else if (!(font instanceof Font)) {
      throw new TypeError("Shape (fromText): font should be a Font");
    } else if (typeof fontSize !== 'number') {
      throw new TypeError("Shape (fromText): fontSize should be a Number");
    } else if (typeof width !== 'number') {
      throw new TypeError("Shape (fromText): width should be a Number");
    }

    let textArr = text.split("\n");

    // set up a temporary canvas used solely for text measuring...
    let cnv = new OffscreenCanvas(1, 1);
    let ctx = cnv.getContext("2d", { alpha: true });

    let fontFamily = font.family;
    ctx.font = fontSize + "px " + fontFamily;
    // ...

    // split text according to width (if any)...
    let lines = {
      arr: new Array(),
      width: 0,
    }

    for (const txt of textArr) {
      // calculate the width of the entire line
      let txtMet = ctx.measureText(txt);
      let txtWidth = txtMet.actualBoundingBoxRight +
        txtMet.actualBoundingBoxLeft;

      if (width <= 0) {
        // no maximum width supplied (or is negative which is
        // invalid) so just add the whole line
        lines.arr.push(txt);
        lines.width = Math.max(lines.width, txtWidth);
      } else {
        if (txtWidth <= width) {
          // add entire line if it fits
          lines.arr.push(txt);
          lines.width = Math.max(lines.width, txtWidth);
        } else {
          let words = txt.split(' ');
          let str = "";

          for (const word of words) {
            txtMet = ctx.measureText(str + word);
            txtWidth = txtMet.actualBoundingBoxRight +
              txtMet.actualBoundingBoxLeft;

            if (txtWidth <= width) {
              // add current word to current string if it fits
              str += word + " ";
            } else {
              if (str === "") {
                //  current word will never fit so just add it
                lines.arr.push(word);
                lines.width = Math.max(lines.width, txtWidth);
              } else {
                // add current string minus extra space at end
                // and set to current word
                lines.arr.push(str.substring(0, str.length - 1));
                lines.width = Math.max(lines.width, txtWidth);
                str = word + " ";
              }
            }
          }

          if (str !== "") {
            // add leftover string if not empty
            lines.arr.push(str);
            lines.width = Math.max(lines.width, txtWidth);
          }
        }
      }
    }

    // resize the canvas for rendering...
    cnv.width = lines.width;
    cnv.height = fontSize * lines.arr.length;

    ctx.font = fontSize + "px " + fontFamily;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#FFFFFF";
    // ...

    // render the text to the canvas, copy it over to a texture
    // and then recreate this shape from it...
    let y = 1;
    for (let l of lines.arr) {
      // [!] alignment?

      let w = 0;
      let h = fontSize * y;

      ctx.fillText(l, w, h);
      
      ++y;
    }

    let tex = new Texture();
    tex.createImage(cnv);
    this.copy(tex.asShape());
    // ...
  } */
  // ...public methods


  // private methods...
  #generateOutline() {
    let halfWidth = this.lineWidth * 0.5;
    
    let rects   = new Array();
    const verts = this.verts;

    let indices = new Array();

    for (let i = 0; i < verts.length; ++i) {
      // calculate the rectangles that surround
      // the polygon's lines

      const a = verts[i];
      const b = verts[(i + 1) % verts.length];

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
      // every rectangle will have one side that intersects
      // and on side that has a gap unless they are collinear

      let j = (i + 4) % rects.length;

      // [!] find which lines in the rectangle we are
      // checking for intersection and which we are connecting

      // deal with the intersection...
      let intersect = Polygon.SegSeg(
        [rects[i], rects[i + 1]],
        [rects[j], rects[j +1]]
      );

      if (intersect.intersects) {
        rects[i + 1] = intersect.point.getCopy();
        rects[j    ] = intersect.point.getCopy();
      }
      // ...

      // deal with the gap...

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
      // ...

      let offs = i;
      indices.push(
            offs, offs + 3, offs + 1,
        offs + 1, offs + 3, offs + 2
      );
      // ...
    }

    this.outline = rects;
    this.#indices = indices;
  }
  // ...private methods
};

export default Shape;
