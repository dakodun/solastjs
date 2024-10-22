class Vec3 {
	constructor(x = 0, y = x, z = y) {
    if (typeof x !== 'number') {
      throw new TypeError("Vec2 (constructor): x should be a Number");
    } else if (typeof y !== 'number') {
      throw new TypeError("Vec2 (constructor): y should be a Number");
    } else if (typeof z !== 'number') {
      throw new TypeError("Vec2 (constructor): z should be a Number");
    }

    this.x = x;
    this.y = y;
    this.z = z;
	}

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
          throw new TypeError(`Vec3 (fromArray): arr[${i}] should `
          + "be a Number");
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
