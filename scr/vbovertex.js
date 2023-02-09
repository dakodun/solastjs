class VBOVertex {
  constructor() {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;

    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 255;

    this.s = 0;
    this.t = 0;

    this.textureFlag = 0;
    this.flag2 = 0;
    this.flag3 = 0;
    this.flag4 = 0;
  }

  copy(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;

    this.s = other.s;
    this.t = other.t;

    this.textureFlag = other.textureFlag;
    this.flag2 = other.flag2;
    this.flag3 = other.flag3;
    this.flag4 = other.flag4;
  }

  getCopy() {
    let copy = new VBOVertex(); copy.copy(this);
    return copy;
  }
};

export default VBOVertex;
