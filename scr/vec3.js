class Vec3 {
  // private fields
    #x = 0;
    #y = 0;
    #z = 0;
  // ...

	constructor(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
	}

  // getters/setters
  get x() { return this.#x; }
  get y() { return this.#y; }
  get z() { return this.#z; }
  
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

  set yz(yz) {
    if (!(yz instanceof Array)) {
      throw new TypeError("Vec2 (yz): should be an Array");
    }

    this.y = yz[0];
    this.z = (yz[1] !== undefined) ? yz[1] : this.#y;
  }

  set xyz(xyz) {
    if (!(xyz instanceof Array)) {
      throw new TypeError("Vec2 (xyz): should be an Array");
    }

    this.x = xyz[0];
    this.y = (xyz[1] !== undefined) ? xyz[1] : this.#x;
    this.z = (xyz[2] !== undefined) ? xyz[2] : this.#y;
  }
  // ...

	copy(other) {
    if (!(other instanceof Vec3)) {
      throw new TypeError("Vec3 (copy): other should be a Vec3");
    }

    this.x = other.x;
		this.y = other.y;
    this.z = other.z;
  }

  getCopy() {
    let copy = new Vec3();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    if (!(other instanceof Vec3)) {
      throw new TypeError("Vec3 (equals): other should be a Vec3");
    } else if (typeof tolerance !== 'number') {
      throw new TypeError("Vec3 (equals): tolerance should " +
        "be a Number");
    }

    return (Math.abs(this.x - other.x) <= tolerance &&
            Math.abs(this.y - other.y) <= tolerance &&
            Math.abs(this.z - other.z) <= tolerance) ? true : false;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y) +
        (this.z * this.z));

    if (len !== 0) {
      let invLen = 1 / len;

      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
    }
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    if (!(other instanceof Vec3)) {
      throw new TypeError("Vec3 (getDot): other should be a Vec3");
    }

    let result = ((this.x * other.x) + (this.y * other.y) +
        (this.z * other.z));

    return result;
  }

  getCross(other) {
     if (!(other instanceof Vec3)) {
      throw new TypeError("Vec3 (getCross): other should be a Vec3");
    }

    let result = new Vec3(
      ((this.y * other.z) - (this.z * other.y)),
      ((this.z * other.x) - (this.x * other.z)),
      ((this.x * other.y) - (this.y * other.x))
    );

    return result;
  }

  asArray() {
    return [this.x, this.y, this.z];
  }

  fromArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError("Vec3 (fromArray): arr should be an Array");
    }

    // pad the input if necessary, using default value of 0
    // or the last value supplied
    let result = new Array(3);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec3 (fromArray): arr[${i}] should ` +
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
  }
};

export default Vec3;
