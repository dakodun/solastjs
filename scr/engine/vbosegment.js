class VBOSegment {
  constructor(pass, shader, textureID, count, offset) {
    this.pass = pass;
    this.shader = shader;
    this.textureID = textureID;

    this.count = count;
    this.offset = offset;
  }
};

export default VBOSegment;
