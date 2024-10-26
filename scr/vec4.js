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
