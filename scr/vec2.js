class Vec2 {
	constructor(x = 0, y = x) {
    if (typeof x !== 'number') {
      throw new TypeError("Vec2 (constructor): x should be a Number");
    } else if (typeof y !== 'number') {
      throw new TypeError("Vec2 (constructor): y should be a Number");
    }

    this.x = x;
    this.y = y;
	}

	copy(other) {
    if (!(other instanceof Vec2)) {
      throw new TypeError("Vec2 (copy): other should be a Vec2");
    }

    this.x = other.x;
		this.y = other.y;
  }

  getCopy() {
    let copy = new Vec2();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    if (!(other instanceof Vec2)) {
      throw new TypeError("Vec2 (equals): other should be a Vec2");
    } else if (typeof tolerance !== 'number') {
      throw new TypeError("Vec2 (equals): tolerance should " +
        "be a Number");
    }

    return (Math.abs(this.x - other.x) <= tolerance &&
            Math.abs(this.y - other.y) <= tolerance) ? true : false;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y));
    
    if (len !== 0) {
      let invLen = 1 / len;

      this.x *= invLen;
      this.y *= invLen;
    }
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    if (!(other instanceof Vec2)) {
      throw new TypeError("Vec2 (getDot): other should be a Vec2");
    }

    let result = ((this.x * other.x) + (this.y * other.y));

    return result;
  }

  getDeterminant(other) {
    if (!(other instanceof Vec2)) {
      throw new TypeError("Vec2 (getDeterminant): other should " + 
        "be a Vec2");
    }

    let result = (this.x * other.y) - (other.x * this.y);

    return result;
  }

  asArray() {
    return [this.x, this.y];
  }

  fromArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError("Vec2 (fromArray): arr should be an Array");
    }

    // pad the input if necessary, using default value of 0
    // or the last value supplied
    let result = new Array(2);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec2 (fromArray): arr[${i}] should `
          + "be a Number");
        }

        result[i] = arr[i];
        padValue = arr[i];
      }
    }
    // ...

    this.x = result[0];
    this.y = result[1];
  }
};

export default Vec2;
