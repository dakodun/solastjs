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

  negate() {
    let negated = new Vec3(-this.x, -this.y, -this.z);
    return negated;
  }

  getArr() {
    return [this.x, this.y, this.z];
  }

  setArr(arr) {
    let padValue = 0.0;

    if (arr.length != 0) {
      padValue = arr[arr.length - 1];
    }
    
    if (arr.length < 3) {
      let len = arr.length;
      arr.length = 3;
      for (let i = len; i < arr.length; ++i) {
        arr[i] = padValue;
      }
    }

    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];
  }
};

export default Vec3;
