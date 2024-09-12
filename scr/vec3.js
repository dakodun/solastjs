class Vec3 {
	constructor(x, y, z) {
    this.x = 0.0;
    if (x != undefined) {
      this.x = x;
    }

    this.y = this.x;
    if (y != undefined) {
      this.y = y;
    }

    this.z = this.y;
    if (z != undefined) {
      this.z = z;
    }
	}

	copy(other) {
    this.x = other.x;
		this.y = other.y;
    this.z = other.z;
  }

  getCopy() {
    let copy = new Vec3(); copy.copy(this);
    return copy;
  }

  equals(other) {
    if (this.x == other.x && this.y == other.y && this.z == other.z) {
      return true;
    }

    return false;
  }

  negate() {
    let negated = new Vec3(-this.x, -this.y, -this.z);
    this.copy(negated);
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let normalized = this.getCopy();
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y) +
        (this.z * this.z));

    if (len != 0) {
      let invLen = 1 / len;
      normalized.x *= invLen; normalized.y *= invLen;
      normalized.z *= invLen;
    }

    this.copy(normalized);
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    let result = ((this.x * other.x) + (this.y * other.y) +
        (this.z * other.z));

    return result;
  }

  getCross(other) {
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
    let diff = this.asArray().length - arr.length;
    let padded = arr.slice();
    if (diff > 0) {
      padded = padded.concat(new Array(diff).fill(0));
    }

    this.x = padded[0];
    this.y = padded[1];
    this.z = padded[2];
  }
};

export default Vec3;
