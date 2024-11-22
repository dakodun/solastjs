import GL from './gl.js'

import Mat4 from './mat4.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Transformable3D from './transformable3d.js';
import Vec3 from './vec3.js';
import Vec4 from './vec4.js';
import VBOVertex from './vbovertex.js';

class VertexBatch {
  // private fields
    #transformable = new Transformable3D();
    #renderable = new Renderable();
  // ...

  constructor() {
    this.#renderable.asData = function() {
      return this.#asData();
    }.bind(this);

    this.verts   = new Array();
    this.indices = new Array();
    this.normals = new Array();
    
    this.colors  = new Array();

    this.lighting = false;
  }

  // getters/setters
  // helpers for working with transformable - error
  // handling occurs in Transformable3D class
  get transformable() { return this.#transformable; }
  
  get position() { return this.#transformable.position; }
  get origin()   { return this.#transformable.origin;   }
  get transMat() { return this.#transformable.transMat; }
  get scale()    { return this.#transformable.scale;    }
  get rotation() { return this.#transformable.rotation; }
  get boundingBox() { return this.#transformable.boundingBox; }
  get asData() { return this.#renderable.asData; }

  set position(position) { this.#transformable.position = position; }
  set origin(origin)     { this.#transformable.origin = origin;     }
  set transMat(transMat) { this.#transformable.transMat = transMat; }
  set scale(scale)       { this.#transformable.scale = scale;       }
  set rotation(rotation) { this.#transformable.rotation = rotation; }

  set boundingBox(boundingBox) {
    this.#transformable.boundingBox = boundingBox;
  }

  // helpers for working with renderable - error
  // handling occurs in Renderable class
  get renderable() { return this.#renderable; }

  get color() { return this.#renderable.color; }
  get alpha() { return this.#renderable.alpha; }
  get depth() { return this.#renderable.depth; }
  get renderMode() { return this.#renderable.renderMode; }
  get shaderRef() { return this.#renderable.shaderRef; }

  set color(color) { this.#renderable.color = color; }
  set alpha(alpha) { this.#renderable.alpha = alpha; }
  set depth(depth) { this.#renderable.depth = depth; }

  set renderMode(renderMode) {
    this.#renderable.renderMode = renderMode;
  }

  set shaderRef(shaderRef) {
    this.#renderable.shaderRef = shaderRef;
  }
  // ...

  #asData() {
    let transMat = this.transMat.getCopy();

    let offsetPos = new Vec3(this.position.x - this.origin.x,
      this.position.y - this.origin.y, this.position.z - this.origin.z);
    transMat.translate(offsetPos);
    
    transMat.translate(this.origin);
    transMat.rotateEuler(this.rotation);
    transMat.scale(this.scale);
    transMat.translate(this.origin.getNegated());

    let vboVerts = new Array();

    // pad the normal array to match the number of vertices
    let diff = this.verts.length - this.normals.length;
    let normals = this.normals.slice();
    if (diff > 0) {
      normals = normals.concat(
        new Array(diff).fill(new Vec3(0.0, 0.0, 1.0))
      );
    }
    
    // pad the color array
    diff = this.verts.length - this.colors.length;
    let colors = this.colors.slice();
    if (diff > 0) {
      colors = colors.concat(
        new Array(diff).fill(this.color.getCopy())
      );
    }

    for (let i = 0; i < this.verts.length; ++i) {
      const v = this.verts[i];
      const n = normals[i];
      const c = colors[i];

      let vboVert = new VBOVertex();

      // passing w as 1 ensures translation is applied
      let posVec = transMat.getMultVec4(new Vec4(v.x, v.y, v.z, 1.0));
      vboVert.x = posVec.x;
      vboVert.y = posVec.y;
      vboVert.z = posVec.z;
      
      vboVert.r = c.x; vboVert.g = c.y;
      vboVert.b = c.z; vboVert.a = this.alpha;

      vboVert.s = 0;
      vboVert.t = 0;
      
      // es 1.0
      let normVec = transMat.getMultVec4(new Vec4(n.x, n.y, n.z, 0.0));
      normVec.normalize();
      vboVert.nx = normVec.x;
      vboVert.ny = normVec.y;
      vboVert.nz = normVec.z;

      // es 3.0
      /* vboVert.normal = vboVert.normal | (0 << 30); // padding
      vboVert.normal = vboVert.normal | (511 << 20); // z
      vboVert.normal = vboVert.normal | (0 << 10); // y
      vboVert.normal = vboVert.normal | (0 << 0); // x */

      vboVerts.push(vboVert);

      if (this.lighting) {
        vboVert.diffuseFlag = 255;
      }
    }

    let rbd = new RenderBatchData();
    rbd.vertices = vboVerts;
    rbd.indices = this.indices.slice();
    rbd.textureRef = null;
    rbd.renderMode = this.renderMode;
    rbd.depth = this.depth;

    return [rbd];
  }

  calculateNormals() {
    this.normals.splice(0, this.normals.length);
    
    const verts = new Array(3);
    for (let i = 2; i < this.indices.length; i += 3) {
      const v0 = this.verts[this.indices[i - 2]];
      const v1 = this.verts[this.indices[i - 1]];
      const v2 = this.verts[this.indices[i    ]];
      
      let v10 = new Vec3(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
      let v20 = new Vec3(v2.x - v0.x, v2.y - v0.y, v2.z - v0.z);

      let cross = v10.getCross(v20); cross.normalize();

      for (let j = 0; j < 3; ++j) {
        this.normals.push(cross);
      }
    }
  }
};

export default VertexBatch;
