class Vec4 {
  // private fields
    #x = 0;
    #y = 0;
    #z = 0;
    #w = 0;
  // ...

	constructor(x = 0, y = x, z = y, w = z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
	}

  // getters/setters
  get x() { return this.#x; }
  get y() { return this.#y; }
  get z() { return this.#z; }
  get w() { return this.#w; }
  
  set x(x) {
    if (typeof x !== 'number') {
      throw new TypeError("Vec2 (x): should be a Number");
    }

    this.#x = x;
  }

  set y(y) {
    if (typeof y !== 'number') {
      throw new TypeError("Vec2 (y): should be a Number");
    }

    this.#y = y;
  }

  set z(z) {
    if (typeof z !== 'number') {
      throw new TypeError("Vec2 (z): should be a Number");
    }

    this.#z = z;
  }

  set w(w) {
    if (typeof w !== 'number') {
      throw new TypeError("Vec2 (w): should be a Number");
    }

    this.#w = w;
  }

  set xy(xy) {
    if (!(xy instanceof Array)) {
      throw new TypeError("Vec2 (xy): should be an Array");
    }

    this.x = xy[0];
    this.y = (xy[1] !== undefined) ? xy[1] : this.#x;
  }

  set xz(xz) {
    if (!(xz instanceof Array)) {
      throw new TypeError("Vec2 (xz): should be an Array");
    }

    this.x = xz[0];
    this.z = (xz[1] !== undefined) ? xz[1] : this.#x;
  }

  set xw(xw) {
    if (!(xw instanceof Array)) {
      throw new TypeError("Vec2 (xw): should be an Array");
    }

    this.x = xw[0];
    this.w = (xw[1] !== undefined) ? xw[1] : this.#x;
  }

  set yz(yz) {
    if (!(yz instanceof Array)) {
      throw new TypeError("Vec2 (yz): should be an Array");
    }

    this.y = yz[0];
    this.z = (yz[1] !== undefined) ? yz[1] : this.#y;
  }

  set yw(yw) {
    if (!(yw instanceof Array)) {
      throw new TypeError("Vec2 (yw): should be an Array");
    }

    this.y = yw[0];
    this.w = (yw[1] !== undefined) ? yw[1] : this.#y;
  }

  set zw(zw) {
    if (!(zw instanceof Array)) {
      throw new TypeError("Vec2 (zw): should be an Array");
    }

    this.z = zw[0];
    this.w = (zw[1] !== undefined) ? zw[1] : this.#z;
  }

  set xyz(xyz) {
    if (!(xyz instanceof Array)) {
      throw new TypeError("Vec2 (xyz): should be an Array");
    }

    this.x = xyz[0];
    this.y = (xyz[1] !== undefined) ? xyz[1] : this.#x;
    this.z = (xyz[2] !== undefined) ? xyz[2] : this.#y;
  }

  set xyw(xyw) {
    if (!(xyw instanceof Array)) {
      throw new TypeError("Vec2 (xyw): should be an Array");
    }

    this.x = xyw[0];
    this.y = (xyw[1] !== undefined) ? xyw[1] : this.#x;
    this.w = (xyw[2] !== undefined) ? xyw[2] : this.#y;
  }

  set xzw(xzw) {
    if (!(xzw instanceof Array)) {
      throw new TypeError("Vec2 (xzw): should be an Array");
    }

    this.x = xzw[0];
    this.z = (xzw[1] !== undefined) ? xzw[1] : this.#x;
    this.w = (xzw[2] !== undefined) ? xzw[2] : this.#z;
  }

  set yzw(yzw) {
    if (!(yzw instanceof Array)) {
      throw new TypeError("Vec2 (yzw): should be an Array");
    }

    this.y = yzw[0];
    this.z = (yzw[1] !== undefined) ? yzw[1] : this.#y;
    this.w = (yzw[2] !== undefined) ? yzw[2] : this.#z;
  }

  set xyzw(xyzw) {
    if (!(xyzw instanceof Array)) {
      throw new TypeError("Vec2 (xyzw): should be an Array");
    }

    this.x = xyzw[0];
    this.y = (xyzw[1] !== undefined) ? xyzw[1] : this.#x;
    this.z = (xyzw[2] !== undefined) ? xyzw[2] : this.#y;
    this.w = (xyzw[3] !== undefined) ? xyzw[3] : this.#z;
  }
  // ...

	copy(other) {
    if (!(other instanceof Vec4)) {
      throw new TypeError("Vec4 (copy): other should be a Vec4");
    }

    this.x = other.x;
		this.y = other.y;
    this.z = other.z;
    this.w = other.w;
  }

  getCopy() {
    let copy = new Vec4();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    if (!(other instanceof Vec4)) {
      throw new TypeError("Vec4 (equals): other should be a Vec4");
    } else if (typeof tolerance !== 'number') {
      throw new TypeError("Vec4 (equals): tolerance should " +
        "be a Number");
    }
    
    return (Math.abs(this.x - other.x) <= tolerance &&
            Math.abs(this.y - other.y) <= tolerance &&
            Math.abs(this.z - other.z) <= tolerance &&
            Math.abs(this.w - other.w) <= tolerance) ? true : false;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y) +
        (this.z * this.z) + (this.w * this.w));

    if (len !== 0) {
      let invLen = 1 / len;

      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
      this.w *= invLen;
    }
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    if (!(other instanceof Vec4)) {
      throw new TypeError("Vec4 (getDot): other should be a Vec4");
    }

    let result = ((this.x * other.x) + (this.y * other.y) +
        (this.z * other.z) + (this.w * other.w));

    return result;
  }

  asArray() {
    return [this.x, this.y, this.z, this.w];
  }

  fromArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError("Vec4 (fromArray): arr should be an Array");
    }

    // pad the input if necessary, using default value of 0
    // or the last value supplied
    let result = new Array(4);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec4 (fromArray): arr[${i}] should ` +
            `be a Number`);
        }

        result[i] = arr[i];
        padValue = arr[i];
      }
    }
    // ...

    this.x = result[0];
    this.y = result[1];
    this.z = result[2];
    this.w = result[3];
  }
};

export default Vec4;
