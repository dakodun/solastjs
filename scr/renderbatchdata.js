import GL from './gl.js'

class RenderBatchData {
  constructor() {
    this.vertices = new Array();
    this.indices = new Array();

    this.pass = 0;
    this.shader = null;
    this.textureID = null;
    this.renderMode = GL.TRIANGLES;
    this.tag = "";
  }
};

export default RenderBatchData;
