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
};

export default Vec3;
