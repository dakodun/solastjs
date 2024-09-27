class Vec2 {
	constructor(x, y) {
    this.x = 0.0;
    if (x != undefined) {
      this.x = x;
    }

    this.y = this.x;
    if (y != undefined) {
      this.y = y;
    }
	}

	copy(other) {
    this.x = other.x;
		this.y = other.y;
  }

  getCopy() {
    let copy = new Vec2(); copy.copy(this);
    return copy;
  }

  equals(other) {
    if (this.x == other.x && this.y == other.y) {
      return true;
    }

    return false;
  }

  negate() {
    let negated = new Vec2(-this.x, -this.y);
    this.copy(negated);
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let normalized = this.getCopy();
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y));

    if (len != 0) {
      let invLen = 1 / len;
      normalized.x *= invLen; normalized.y *= invLen;
    }

    this.copy(normalized);
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    let result = ((this.x * other.x) + (this.y * other.y));

    return result;
  }

  getDeterminant(other) {
    let result = (this.x * other.y) - (other.x * this.y);

    return result;
  }

  asArray() {
    return [this.x, this.y];
  }

  fromArray(arr) {
    let diff = this.asArray().length - arr.length;
    let padded = arr.slice();
    if (diff > 0) {
      padded = padded.concat(new Array(diff).fill(0));
    }

    this.x = padded[0];
    this.y = padded[1];
  }
};

export default Vec2;
