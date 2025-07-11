class VBOVertex {
  static byteSize = 28;

  #x = 0.0;
  #y = 0.0;
  #z = 0.0;

  #s = 0.0;
  #t = 0.0;

  #textureFlag = 0;
  #textureLayer = 0;

	constructor(initializerList = {}) {
    // (3 4-byte)
    this.x = initializerList.x || 0.0;
    this.y = initializerList.y || 0.0;
    this.z = initializerList.z || 0.0;

    this.r = 255; // (4 1-byte)
    this.g = 255;
    this.b = 255;
    this.a = 255;

    // (2 2-byte)
    this.s = initializerList.s || 0.0;
    this.t = initializerList.t || 0.0;

    // (4 1-byte)
    this.textureFlag = initializerList.textureFlag || 0;
    this.textureLayer = initializerList.textureLayer || 0;
    this.diffuseFlag = 0;
    this.flag4 = 0;

    this.normal = 0; // (1 4-byte)
	}

  get x() { return this.#x; }
  get y() { return this.#y; }
  get z() { return this.#z; }

  get s() { return this.#s; }
  get t() { return this.#t; }

  get textureFlag()  { return this.#textureFlag;  }
  get textureLayer() { return this.#textureLayer; }

  set x(x) {
    if (typeof x !== 'number') {
      throw new TypeError("VBOVertex (x): should be a Number");
    }

    this.#x = x;
  }

  set y(y) {
    if (typeof y !== 'number') {
      throw new TypeError("VBOVertex (y): should be a Number");
    }

    this.#y = y;
  }

  set z(z) {
    if (typeof z !== 'number') {
      throw new TypeError("VBOVertex (z): should be a Number");
    }

    this.#z = z;
  }

  set s(s) {
    if (typeof s !== 'number') {
      throw new TypeError("VBOVertex (s): should be a Number");
    }

    this.#s = s;
  }

  set t(t) {
    if (typeof t !== 'number') {
      throw new TypeError("VBOVertex (t): should be a Number");
    }

    this.#t = t;
  }

  set textureFlag(textureFlag) {
    if (typeof textureFlag !== 'number') {
      throw new TypeError("VBOVertex (textureFlag): should be a Number");
    }

    this.#textureFlag = textureFlag;
  }

  set textureLayer(textureLayer) {
    if (typeof textureLayer !== 'number') {
      throw new TypeError("VBOVertex (textureLayer): should be a Number");
    }

    this.#textureLayer = textureLayer;
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
    this.textureLayer = other.textureLayer;
    this.diffuseFlag = other.diffuseFlag;
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

    buffer.setUint8(offset    ,  this.textureFlag);
    buffer.setUint8(offset + 1, this.textureLayer);
    buffer.setUint8(offset + 2,  this.diffuseFlag);
    buffer.setUint8(offset + 3,        this.flag4);
    offset += 4;

    buffer.setUint32(offset, this.normal, true);
    offset += 4;
  }
};

export default VBOVertex;
