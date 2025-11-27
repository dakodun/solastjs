class VBOVertex {
  static byteSize = 32;

  _x = 0.0;
  _y = 0.0;
  _z = 0.0;

  _r = 255;
  _g = 255;
  _b = 255;
  _a = 255;

  _s = 0.0;
  _t = 0.0;

  _textureFlag  = 0;
  _textureLayer = 0;
  _diffuseFlag  = 0;
  _flag4        = 0;

  _normal = 0.0;

	constructor(initializerList = {}) {
    // (3 4-byte)
    this.x = initializerList.x || 0.0;
    this.y = initializerList.y || 0.0;
    this.z = initializerList.z || 0.0;

    // (4 1-byte)
    this.r = initializerList.r || 255;
    this.g = initializerList.g || 255;
    this.b = initializerList.b || 255;
    this.a = initializerList.a || 255;

    // (2 4-byte)
    this.s = initializerList.s || 0.0;
    this.t = initializerList.t || 0.0;

    // (4 1-byte)
    this.textureFlag  = initializerList.textureFlag  || 0;
    this.textureLayer = initializerList.textureLayer || 0;
    this.diffuseFlag  = initializerList.diffuseFlag  || 0;
    this.flag4        = initializerList.flag4        || 0;

    this.normal = initializerList.normal || 0.0; // (1 4-byte)
	}

  // getters

  get x() { return this._x; }
  get y() { return this._y; }
  get z() { return this._z; }

  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }
  get a() { return this._a; }

  get s() { return this._s; }
  get t() { return this._t; }

  get textureFlag()  { return this._textureFlag;  }
  get textureLayer() { return this._textureLayer; }
  get diffuseFlag()  { return this._diffuseFlag;  }
  get flag4()        { return this._flag4;        }

  get normal() { return this._normal; }

  // setters

  set x(x) {
    if (typeof x !== 'number') {
      throw new TypeError("VBOVertex (x): should be a Number");
    }

    this._x = x;
  }

  set y(y) {
    if (typeof y !== 'number') {
      throw new TypeError("VBOVertex (y): should be a Number");
    }

    this._y = y;
  }

  set z(z) {
    if (typeof z !== 'number') {
      throw new TypeError("VBOVertex (z): should be a Number");
    }

    this._z = z;
  }

  set r(r) {
    if (typeof r !== 'number') {
      throw new TypeError("VBOVertex (r): should be a Number");
    }

    this._r = r;
  }

  set g(g) {
    if (typeof g !== 'number') {
      throw new TypeError("VBOVertex (g): should be a Number");
    }

    this._g = g;
  }

  set b(b) {
    if (typeof b !== 'number') {
      throw new TypeError("VBOVertex (b): should be a Number");
    }

    this._b = b;
  }

  set a(a) {
    if (typeof a !== 'number') {
      throw new TypeError("VBOVertex (a): should be a Number");
    }

    this._a = a;
  }

  set s(s) {
    if (typeof s !== 'number') {
      throw new TypeError("VBOVertex (s): should be a Number");
    }

    this._s = s;
  }

  set t(t) {
    if (typeof t !== 'number') {
      throw new TypeError("VBOVertex (t): should be a Number");
    }

    this._t = t;
  }

  set textureFlag(textureFlag) {
    if (typeof textureFlag !== 'number') {
      throw new TypeError("VBOVertex (textureFlag): should be a Number");
    }

    this._textureFlag = textureFlag;
  }

  set textureLayer(textureLayer) {
    if (typeof textureLayer !== 'number') {
      throw new TypeError("VBOVertex (textureLayer): should be a Number");
    }

    this._textureLayer = textureLayer;
  }

  set diffuseFlag(diffuseFlag) {
    if (typeof diffuseFlag !== 'number') {
      throw new TypeError("VBOVertex (diffuseFlag): should be a Number");
    }

    this._diffuseFlag = diffuseFlag;
  }

  set flag4(flag4) {
    if (typeof flag4 !== 'number') {
      throw new TypeError("VBOVertex (flag4): should be a Number");
    }

    this._flag4 = flag4;
  }

  set normal(normal) {
    if (typeof normal !== 'number') {
      throw new TypeError("VBOVertex (normal): should be a Number");
    }

    this._normal = normal;
  }


	copy(other) {
    if (!(other instanceof VBOVertex)) {
      throw new TypeError("VBOVertex (copy): other should " +
        "be a VBOVertex");
    }

    this._x = other._x;
    this._y = other._y;
    this._z = other._z;

    this._r = other._r;
    this._g = other._g;
    this._b = other._b;
    this._a = other._a;

    this._s = other._s;
    this._t = other._t;

    this._textureFlag = other._textureFlag;
    this._textureLayer = other._textureLayer;
    this._diffuseFlag = other._diffuseFlag;
    this._flag4 = other._flag4;

    this._normal = other._normal;
  }

  getCopy() {
    let copy = new VBOVertex();
    copy.copy(this);

    return copy;
  }

  toBuffer(buffer, index) {
    let offset = VBOVertex.byteSize * index;

    buffer.setFloat32(offset    , this._x, true);
    buffer.setFloat32(offset + 4, this._y, true);
    buffer.setFloat32(offset + 8, this._z, true);
    offset += 12;
    
    buffer.setUint8(offset    , this._r);
    buffer.setUint8(offset + 1, this._g);
    buffer.setUint8(offset + 2, this._b);
    buffer.setUint8(offset + 3, this._a);
    offset += 4;

    buffer.setFloat32(offset    , this._s, true);
    buffer.setFloat32(offset + 4, this._t, true);
    offset += 8;

    buffer.setUint8(offset    ,  this._textureFlag);
    buffer.setUint8(offset + 1, this._textureLayer);
    buffer.setUint8(offset + 2,  this._diffuseFlag);
    buffer.setUint8(offset + 3,        this._flag4);
    offset += 4;

    buffer.setUint32(offset, this._normal, true);
    offset += 4;
  }
};

export default VBOVertex;
