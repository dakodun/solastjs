import GL from './gl.js'

class RenderBatchData {
  constructor() {
    this.vertices = new Array();
    this.indices = new Array();

    this.tag = "";
    this.pass = 0;
    this.renderMode = GL.TRIANGLES;

    this.shaderRef  = null;
    this.textureRef = null;

    this.depth = 0;
    this.depthSort = false;
  }

  copy(other) {
    if (!(other instanceof RenderBatchData)) {
      throw new TypeError("RenderBatchData (copy): other should " +
        "be a RenderBatchData");
    }

    this.vertices.splice(0, this.vertices.length);
    for (const vert of other.vertices) {
      this.vertices.push(vert.getCopy());
    }

    this.indices = other.indices.slice();

    this.tag = other.tag;
    this.pass = other.pass;
    this.renderMode = other.renderMode;

    this.shaderRef  =  other.shaderRef;
    this.textureRef = other.textureRef;

    this.depth = other.depth;
    this.depthSort = other.depthSort;
  }

  getCopy() {
    let copy = new RenderBatchData();
    copy.copy(this);

    return copy;
  }
};

export default RenderBatchData;
