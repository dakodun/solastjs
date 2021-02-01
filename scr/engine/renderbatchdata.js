class RenderBatchData {
  constructor() {
    this.vertices = new Array();
    this.indices = new Array();

    this.pass = 0;
    this.textureID = 0;
    this.tag = "";
  }
};

export default RenderBatchData;
