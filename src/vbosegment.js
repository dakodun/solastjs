class VBOSegment {
  constructor(pass, shaderRef, textureRef, renderMode, count, offset) {
    this.pass = pass;
    this.shaderRef = shaderRef;
    this.textureRef = textureRef;
    this.renderMode = renderMode;

    this.count = count;
    this.offset = offset;
  }
};

export default VBOSegment;
