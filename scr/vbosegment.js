class VBOSegment {
  constructor(pass, shader, textureID, renderMode, count, offset) {
    this.pass = pass;
    this.shader = shader;
    this.textureID = textureID;
    this.renderMode = renderMode;

    this.count = count;
    this.offset = offset;
  }
};

export default VBOSegment;
