import GL from './gl.js'

import Mat3 from './mat3.js';
import Polygon from './polygon.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import * as util from './utility.js';
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';
import VBOVertex from './vbovertex.js';

class Shape extends Renderable(Polygon) {
	constructor() {
    super();

    this.indices = new Array();

    this.frames = new Array();
    this.currentFrame = 0;

    this.animated = false;
    this.startFrame = 0;
    this.endFrame = 0;
    this.direction = 1;
    this.loopCount = 0;
    this.loopMax = 0;
    this.timer = 0;

    this.colors = new Array();
  }
  
  copy(other) {
    super.copy(other);

    this.indices = other.indices.slice();

    this.frames.splice(0, this.frames.length);
    for (let f of other.frames) {
      let a = new Array();
      for (let g of f) {
        a.push(g);
      }
      
      this.frames.push(a);
    }

    this.currentFrame = other.currentFrame;

    this.animated = other.animated;
    this.startFrame = other.startFrame;
    this.endFrame = other.endFrame;
    this.direction = other.direction;
    this.loopCount = other.loopCount;
    this.loopMax = other.loopMax;
    this.timer = other.timer;

    this.colors.splice(0, this.colors.length);
    for (let c of other.colors) {
      this.colors.push(c);
    }
  }

  getCopy() {
    let copy = new Shape(); copy.copy(this);
    return copy;
  }

  process(dt) {
    if (this.animated && this.frames.length > 0) {
      this.timer += dt;

      let currFrame = this.currentFrame;
      let limit = this.frames[currFrame][2];

      while (this.timer >= limit) {
        this.timer -= limit;

        if (currFrame == this.endFrame) {
          if (this.loopCount != 0) {
            if (this.loopCount > 0) {
              --this.loopCount;
            }

            currFrame = this.startFrame - this.direction;
          }
          else {
            this.animated = false;
            break;
          }
        }
        
        currFrame = (currFrame + this.direction) % this.frames.length;
        if (currFrame < 0) {
          currFrame = this.frames.length - 1;
        }
        
        limit = this.frames[currFrame][2];
      }

      if (this.currentFrame != currFrame) {
        this.currentFrame = currFrame;
        return true;
      }
    }

    return false;
  }

  pushVert(vert) {
    super.pushVert(vert);
    this.indices.splice(0, this.indices.length);
  }

  pushFrame(texture) {
    let coords = [new Vec2(0.0, 1.0), new Vec2(1.0, 0.0)];
    this.frames.push([texture, coords, 0.0]);
  }

  pushFrameRect(texture, rect) {
    let coords = [rect[0], rect[1]];
    this.frames.push([texture, coords, 0.0]);
  }

  pushFrameStrip(texture, count, row, column, start, offset) {
    let off = offset;
    if (off == undefined) {
      off = new Vec2(0.0, 0.0);
    }
    
    let width = texture.width / row;
    let height = texture.height / column;

    let increment = new Vec2((width - off.x) / texture.width,
        (height - off.y) / texture.height);
    let spacing = new Vec2(off.x / texture.width,
        off.y / texture.height);

    for (let i = start; i < count + start; ++i) {
      let s = i % row;
      let t = Math.trunc(i / row);

      let min = new Vec2((s * increment.x) + (s * spacing.x),
          ((t + 1) * increment.y) + (t * spacing.y));
			let max = new Vec2(((s + 1) * increment.x) + (s * spacing.x),
          (t * increment.y) + (t * spacing.y));

      let coords = [min, max];
      this.frames.push([texture, coords, 0.0]);
    }
  }

  setAnimation(speeds, start, end, direction, loops) {
    if (this.frames.length != 0) {
      this.startFrame = Math.min(this.frames.length - 1, start);
      this.endFrame = Math.min(this.frames.length - 1, end);
    }
    else {
      this.startFrame = 0;
      this.endFrame = 0;
    }

    if (this.startFrame != this.endFrame && direction != 0) {
      this.animated = true;
      this.direction = direction;

      let frameCount = 0;

      
      { // calculate the number of frames between start and end
        // frame accounting for animation direction and looping
        // past the start or end of the frames array

        let s = this.startFrame;
        let e = this.endFrame;
        
        if (direction < 0) {
          let t = s;
          s = e;
          e = t;
        }

        if (s < e) {
          frameCount = (e + 1) - s;
        }
        else {
          frameCount = (this.frames.length - s) +(e + 1);
        }
      }

      
      { // if there is insufficient speed values for every frame of the
        // animation then pad the values with either default
        // (1/60 of a second) if there are no values at all,
        // or with the last speed value

        let speedPad = 0.0167;

        if (speeds.length != 0) {
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
      for (let i = this.startFrame, j = 0; ; i += this.direction, ++j) {
        i = i % this.frames.length;
        
        this.frames[i][2] = speeds[j];
        
        if (i == this.endFrame) {
          break;
        }
        else if (i == 0 && this.direction < 0) {
          i = this.frames.length;
        }
      }

      this.loopCount = -1;
      if (loops != undefined) {
        this.loopCount = loops;
      }

      this.loopMax = this.loopCount;
      this.timer = 0.0;
      this.currentFrame = this.startFrame;
    }
    else {
      this.animated = false;
    }
  }

  resetAnimation() {
    this.loopCount = this.loopMax;

    this.timer = 0.0;
    this.currentFrame = this.startFrame;
  }

  setCurrentFrame(frame) {
    if (this.frames.length > 0) {
      this.timer = 0.0;
      this.currentFrame = Math.min(this.frames.length - 1, frame);
    }
  }

  // a naive ear clipping algorithm
  triangulate() {
    if (this.getWinding() < 0) {
      this.reverseWinding();
    }

    let indices = new Array();
    let indexArray = new Array();

    { // create a doubly linked list of indices
      let len = this.verts.length;
      for (let i = 0; i < len; ++i) {
        indexArray.push([i, (((i - 1) % len) + len) % len,
            (i + 1) % len]);
      }
    }

    {
      let indexCount = this.verts.length;
      let curr = 0;
      
      while (indexCount > 3) {
        const i = indexArray[curr][0];
        const i2 = indexArray[indexArray[i][2]][0];
        const i3 = indexArray[indexArray[i2][2]][0];

        const v = this.verts[i];
        const v2 = this.verts[i2];
        const v3 = this.verts[i3];

        let l = new Vec2(v.x - v2.x, v.y - v2.y);
        let l2 = new Vec2(v3.x - v2.x, v3.y - v2.y);

        if (util.isConvex(v, v2, v3) > 0) { // is middle vertex convex?
          let success = true;
          let c = indexArray[indexArray[i3][2]][0];

          do { // for all other remaining points
            let p = this.verts[c];

            if (!util.pointInPolygon([v, v2, v3], p)) {
              c = indexArray[indexArray[c][2]][0];
            }
            else {
              c = i;
              success = false;
            }
          } while (c != i);

          if (success) {
            indices.push(i, i2, i3);
            indexArray[curr][2] = i3;
            indexArray[i3][1] = curr;
            --indexCount;
          }
          else {
            curr = i2;
          }
        }
        else {
          curr = i2;
        }
      }

      if (indexCount == 3) { // handle the last triangle
        const i = indexArray[curr][0];
        const i2 = indexArray[indexArray[i][2]][0];
        const i3 = indexArray[indexArray[i2][2]][0];

        indices.push(i, i2, i3);
      }
    }

    this.indices = indices.slice();
  }

  getRenderBatchData() {
    let renderMode = this.renderMode;

    switch (renderMode) {
      case GL.POINTS :
        if (this.indices.length == 0) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.indices.push(i);
          }
        }

        break;
      case GL.LINES :
        if (this.indices.length == 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.indices.push(i);
          }
        }

        break;
      case GL.LINE_LOOP :
        renderMode = GL.LINES; // manually loop lines

        if (this.indices.length == 0 && this.verts.length > 1) {
          for (let i = 0; i < this.verts.length; ++i) {
            this.indices.push(i);
            if (i + 1 < this.verts.length) {
              this.indices.push(i + 1);
            }
            else {
              this.indices.push(0);
            }
          }
        }

        break;
      case GL.TRIANGLES :
      default :
        if (this.indices.length == 0) {
          this.triangulate();
        }

        break;
    }

    let texRect = [new Vec2(0.0, 1.0), new Vec2(1.0, 0.0)];
    let texID = null;
    if (this.currentFrame < this.frames.length) {
      texRect = this.frames[this.currentFrame][1];
      texID = this.frames[this.currentFrame][0].textureID;
    }

    let transMat = this.transMat.getCopy();

    let offsetPos = new Vec2(this.position.x - this.origin.x,
        this.position.y - this.origin.y);
    transMat.translate(offsetPos);
    
    transMat.translate(this.origin);
    transMat.rotate(this.rotation);
    transMat.scale(this.scale);
    transMat.translate(this.origin.getNegated());

    let vboVerts = new Array();
    let invMinMax = new Vec2(1 / (this.localBox[1].x - this.localBox[0].x),
        1 / (this.localBox[1].y - this.localBox[0].y));
    
    // pad the color array to match the number of vertices
    let diff = this.verts.length - this.colors.length;
    let colors = this.colors.slice();
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }

    for (let i = 0; i < this.verts.length; ++i) {
      const v = this.verts[i];
      const c = colors[i];

      let vboVert = new VBOVertex();

      vboVert.x = (transMat.arr[0] * v.x) + (transMat.arr[3] * v.y) +
          transMat.arr[6];
      vboVert.y = (transMat.arr[1] * v.x) + (transMat.arr[4] * v.y) +
          transMat.arr[7];
      vboVert.z = this.depth;

      // es 1.0
      let normVec = transMat.getMultVec(new Vec4(0.0, 0.0, 1.0, 0.0));
      normVec.normalize();
      vboVert.nx = normVec.x;
      vboVert.ny = normVec.y;
      vboVert.nz = normVec.z;

      // es 3.0
      /* vboVert.normal = vboVert.normal | (0 << 30); // padding
      vboVert.normal = vboVert.normal | (511 << 20); // z
      vboVert.normal = vboVert.normal | (0 << 10); // y
      vboVert.normal = vboVert.normal | (0 << 0); // x */

      vboVert.r = c.x; vboVert.g = c.y;
      vboVert.b = c.z; vboVert.a = this.alpha;

      let ratio = new Vec2((v.x - this.localBox[0].x)  * invMinMax.x,
          (v.y - this.localBox[0].y)  * invMinMax.y);

      // pack floating point values into unsigned short
      vboVert.s = (((1 - ratio.x) * texRect[0].x) +
          (ratio.x * texRect[1].x)) * 65535;
      vboVert.t = (((1 - ratio.y) * texRect[0].y) +
          (ratio.y * texRect[1].y)) * 65535;
      
      if (texID) {
        vboVert.textureFlag = 255;
      }

      vboVerts.push(vboVert);
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this.indices.slice();
    rbd.textureID = texID;
    rbd.renderMode = renderMode;
    rbd.depth = this.depth;

    return [rbd];
  }

  reverseWinding() {
    this.indices.splice(0, this.indices.length);
    
    return super.reverseWinding();
  }

  setRenderMode(renderMode) {
    if (renderMode != this.renderMode) {
      this.indices.splice(0, this.indices.length);
      this.renderMode = renderMode;
    }
  }
};

export default Shape;
