class VBOVertex {
  static byteSize = 28;

	constructor() {
    this.x = 0.0; // (3 4-byte)
    this.y = 0.0;
    this.z = 0.0;

    this.r = 255; // (4 1-byte)
    this.g = 255;
    this.b = 255;
    this.a = 255;

    this.s = 0; // (2 2-byte)
    this.t = 0;

    this.textureFlag = 0; // (4 1-byte)
    this.diffuseFlag = 0;
    this.flag3 = 0;
    this.flag4 = 0;

    this.normal = 0; // (1 4-byte)
	}

	copy(other) {
    if (!(other instanceof VBOVertex)) {
      throw new TypeError("VBOVertex (copy): other should " +
        "be a VBOVertex");
    }

    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;

    this.s = other.s;
    this.t = other.t;

    this.textureFlag = other.textureFlag;
    this.diffuseFlag = other.diffuseFlag;
    this.flag3 = other.flag3;
    this.flag4 = other.flag4;

    this.normal = other.normal;
  }

  getCopy() {
    let copy = new VBOVertex();
    copy.copy(this);

    return copy;
  }

  toBuffer(buffer, index) {
    let offset = VBOVertex.byteSize * index;

    buffer.setFloat32(offset    , this.x, true);
    buffer.setFloat32(offset + 4, this.y, true);
    buffer.setFloat32(offset + 8, this.z, true);
    offset += 12;
    
    buffer.setUint8(offset    , this.r);
    buffer.setUint8(offset + 1, this.g);
    buffer.setUint8(offset + 2, this.b);
    buffer.setUint8(offset + 3, this.a);
    offset += 4;

    buffer.setUint16(offset    , this.s, true);
    buffer.setUint16(offset + 2, this.t, true);
    offset += 4;

    buffer.setUint8(offset    , this.textureFlag);
    buffer.setUint8(offset + 1, this.diffuseFlag);
    buffer.setUint8(offset + 2,       this.flag3);
    buffer.setUint8(offset + 3,       this.flag4);
    offset += 4;

    buffer.setUint32(offset, this.normal, true);
    offset += 4;
  }
};

export default VBOVertex;
