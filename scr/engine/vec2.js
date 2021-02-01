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
};

export default Vec2;
