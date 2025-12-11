import GL from './gl.js';
import Sol from './sol.js';

import BSTree from './bstree.js';
import Mat4 from './mat4.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Transformable3D from './transformable3d.js';
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';
import Vec4 from './vec4.js';
import VBOVertex from './vbovertex.js';

import * as enums from "./exportenums.js";

class VertexBatch {
  // a VertexBatch is a collection of raw vertex
  // data used for rendering

  //> internal properties //
  _verts     = new Array();
  _indices   = new Array();
  _normals   = new Array();
  _texCoords = new Array();
  _colors    = new Array();

  _texture = null;

  _transformable = new Transformable3D();
  _renderable    =      new Renderable();

  //> public properties //
  lighting = false;

  constructor(verts = undefined) {
    if (verts !== undefined) {
      this.verts = verts;
    }
  }

  //> getters //
  get verts()     { return this._verts;     }
  get indices()   { return this._indices;   }
  get normals()   { return this._normals;   }
  get texCoords() { return this._texCoords; }
  get colors()    { return this._colors;    }

  get transformable() { return this._transformable; }
  get renderable()    { return this._renderable;    }

  //> setters //
  set verts(verts) {
    Sol.CheckTypes(this, "set verts",
    [{verts}, [Array]]);

    let bbox = {
      lower: new Vec3(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      upper: new Vec3(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    };

    for (const vert of verts) {
      if (!(vert instanceof Vec3)) {
        throw new TypeError("VertexBatch (set verts): verts should " +
          "be an Array of Vec3");
      }

      bbox.lower.x = Math.min(vert.x, bbox.lower.x);
      bbox.lower.y = Math.min(vert.y, bbox.lower.y);
      bbox.lower.z = Math.min(vert.z, bbox.lower.z);

      bbox.upper.x = Math.max(vert.x, bbox.upper.x);
      bbox.upper.y = Math.max(vert.y, bbox.upper.y);
      bbox.upper.z = Math.max(vert.z, bbox.upper.z);
    }
    
    this.boundingBox = bbox;
    this._verts = verts;
  }

  set indices(indices) {
    Sol.CheckTypes(this, "set indices",
    [{indices}, [Array]]);

    for (const index of indices) {
      if (typeof index !== 'number') {
        throw new TypeError("VertexBatch (set indices): indices should " +
        "be an Array of Number");
      }
    }

    this._indices = indices;
  }

  set normals(normals) {
    Sol.CheckTypes(this, "set normals",
    [{normals}, [Array]]);

    for (const normal of normals) {
      if (!(normal instanceof Vec3)) {
        throw new TypeError("VertexBatch (set normals): normals " +
        "should be an Array of Vec3");
      }
    }

    this._normals = normals;
  }

  set texCoords(texCoords) {
    Sol.CheckTypes(this, "set indices",
    [{texCoords}, [Array]]);

    for (const coord of texCoords) {
      if (!(coord instanceof Vec3)) {
        throw new TypeError("VertexBatch (set texCoords): texCoords " +
        "should be an Array of Vec3");
      }
    }

    this._texCoords = texCoords;
  }

  set colors(colors) {
    Sol.CheckTypes(this, "set colors",
    [{colors}, [Array]]);

    for (const color of colors) {
      if (!(color instanceof Vec3)) {
        throw new TypeError("VertexBatch (set colors): colors should " +
        "be an Array of Vec3");
      }
    }

    this._colors = colors;
  }

  //> getters (transformable) //
  get position() { return this._transformable.position; }
  get origin()   { return this._transformable.origin;   }
  get transMat() { return this._transformable.transMat; }
  get scale()    { return this._transformable.scale;    }
  get rotation() { return this._transformable.rotation; }
  get boundingBox() { return this._transformable.boundingBox; }

  get bbWidth()  { return this._transformable.width;  }
  get bbHeight() { return this._transformable.height; }
  get bbDepth()  { return this._transformable.depth;  }

  //> setters (transformable) //
  set position(position) { this._transformable.position = position; }
  set origin(origin)     { this._transformable.origin = origin;     }
  set transMat(transMat) { this._transformable.transMat = transMat; }
  set scale(scale)       { this._transformable.scale = scale;       }
  set rotation(rotation) { this._transformable.rotation = rotation; }

  set boundingBox(boundingBox) {
    this._transformable.boundingBox = boundingBox;
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
  calculateNormals() {
    this._normals.splice(0, this._normals.length);
    
    const verts = new Array(3);
    for (let i = 2; i < this.indices.length; i += 3) {
      const v0 = this.verts[this.indices[i - 2]];
      const v1 = this.verts[this.indices[i - 1]];
      const v2 = this.verts[this.indices[i    ]];
      
      let v10 = new Vec3(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
      let v20 = new Vec3(v2.x - v0.x, v2.y - v0.y, v2.z - v0.z);

      let cross = v10.getCross(v20); cross.normalize();

      for (let j = 0; j < 3; ++j) {
        this._normals.push(cross);
      }
    }
  }

  asData() {
    // [!] render mode

    let transMat = this._transformable.asMat4();

    let vboVerts = new Array();

    // pad the normal array to match the number of vertices
    let diff = this._verts.length - this._normals.length;
    let normals = this._normals.slice();
    if (diff > 0) {
      normals = normals.concat(
        new Array(diff).fill(new Vec3(0.0, 0.0, 1.0))
      );
    }

    // pad the texture coordinate array
    diff = this._verts.length - this._texCoords.length;
    let texCoords = this._texCoords.slice();
    if (diff > 0) {
      texCoords = texCoords.concat(
        new Array(diff).fill(new Vec3(0.0, 0.0, 0))
      );
    }
    
    // pad the color array
    diff = this._verts.length - this._colors.length;
    let colors = this._colors.slice();
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }

    // [!] allow per-vertex transparency
    // diff = verts.length - this._colors.length;
    let alphas = [];
    diff = this._verts.length;
    if (diff > 0) {
      alphas = alphas.concat(
        new Array(diff).fill(this.alpha)
      );
    }

    for (let i = 0; i < this.verts.length; ++i) {
      const v  = this.verts[i];
      const n  = normals[i];
      const tc = texCoords[i];
      const c  = colors[i];
      const a  = alphas[i];

      let vboVert = new VBOVertex();

      let posVec = transMat.getMultVec4(new Vec4(v.x, v.y, v.z, 1.0));
      vboVert.x = posVec.x;
      vboVert.y = posVec.y;
      vboVert.z = posVec.z;
      
      vboVert.r = c.x; vboVert.g = c.y;
      vboVert.b = c.z; vboVert.a = a;

      vboVert.s = tc.x;
      vboVert.t = tc.y;
      vboVert.textureLayer = tc.z;
      
      let normVec = transMat.getMultVec4(new Vec4(n.x, n.y, n.z, 0.0));

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
      
      if (this.lighting) {
        vboVert.diffuseFlag = 1;
      }

      if (this._texture && this._texture.texture) {
        vboVert.textureFlag = 1;
      }

      vboVerts.push(vboVert);
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this.indices.slice();
    rbd.textureRef = (this._texture) ? this._texture.texture : null;
    rbd.renderMode = this.renderMode;
    rbd.depth = this.depth;

    return [rbd];
  }

  sortIndices(groupSize = 3) {
    // sorts the indices (in groups denoted by 'groupSize')
    // by their avaerage depth value, lowest to highest

    Sol.CheckTypes(this, "sortIndices",
    [{groupSize}, [Number]]);

    if (this._indices.length % groupSize !== 0) {
      throw new RangeError("VertexBatch (sortIndices): indices " +
      "not divisible by groupSize");
    }

    let tree = new BSTree();
    let compare = (a, b) => {
      return(a.depth < b.depth) ? -1 :
        (a.depth > b.depth) ? 1 : 0;
    }

    for (let i = 0; i < this._indices.length; i += groupSize) {
      // get the indices that make up the group and then calculate
      // the average depth of the verts they point to before
      // attempting to add them the the binary tree

      let indexGroup = new Array();
      for (let j = 0; j < groupSize; ++j) {
        indexGroup.push(this._indices[i + j]);
      }

      let aveDepth = indexGroup.reduce((acc, v) => {
        return (acc + this._verts[v].z); }, 0);

      let res = tree.add({ depth: aveDepth,
        indices: [indexGroup] }, compare);
      
      // if 'add' failed then an index group with the same average
      // depth already exists (and has been returned) so add
      // our current index group to the indices array of that

      if (res.success === false) {
        res.node._data.indices.push(indexGroup);
      }
    }

    // iterate through the array (lowest to highest depth)
    // and add the index groups to a new array, then flatten
    // and assign it as the vertex batch's indices

    let indices = new Array();
    tree.forEach((node) => {
      indices.push(node._data.indices);
    });

    this._indices = indices.flat(2);
  }
};

export default VertexBatch;
