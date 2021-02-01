class VBOSegment {
  constructor(pass, textureID, count, offset) {
    this.pass = pass;
    this.textureID = textureID;

    this.count = count;
    this.offset = offset;
  }
};

export default VBOSegment;
