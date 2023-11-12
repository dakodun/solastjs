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
    return negated;
  }

  normalise() {
    let normal = this.getCopy();
    let len = Math.sqrt((this.x * this.x) + (this.y * this.y));

    if (len != 0) {
      let invLen = 1 / len;
      normal.x *= invLen; normal.y *= invLen;
    }

    return normal;
  }

  getArr() {
    return [this.x, this.y];
  }

  setArr(arr) {
    let padValue = 0.0;

    if (arr.length != 0) {
      padValue = arr[arr.length - 1];
    }
    
    if (arr.length < 2) {
      let len = arr.length;
      arr.length = 2;
      for (let i = len; i < arr.length; ++i) {
        arr[i] = padValue;
      }
    }

    this.x = arr[0];
    this.y = arr[1];
  }
};

export default Vec2;
