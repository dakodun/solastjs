import EngineError from './error.js';

class Mat4 {
	constructor() {
    this.arr = new Array();
    this.identity();
	}

	copy(other) {
    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat4(); copy.copy(this);
    return copy;
  }

  identity() {
    this.arr.splice(0, this.arr.length);
    this.arr = [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1];
  }

  ortho(left, right, top, bottom, near, far) {
    this.identity();
    let invRL = 1 / (right - left);
    let invTB = 1 / (top - bottom);
    let invFN = 1 / (far - near);

    this.arr[0] = 2 * invRL;
    this.arr[5] = 2 * invTB;
    this.arr[10] = -2 * invFN;

    this.arr[12] = -(right + left) * invRL;
    this.arr[13] = -(top + bottom) * invTB;
    this.arr[14] = -(far + near) * invFN;
  }

  perspective(fovy, aspect, near, far) {
    this.identity();

    let invSP = 1.0 / Math.tan(fovy / 2);

    this.arr[0] = invSP / aspect;
    this.arr[5] = invSP;
    this.arr[10] = -(far + near) / (far - near);
    this.arr[11] = -1;

    this.arr[12] = 0;
    this.arr[13] = 0;
    this.arr[14] = (2 * (far * near)) / (near - far);

    this.arr[15] = 0;
  }

  mult(other) {
    let result = new Mat4();

    for (var x = 0; x < 4; ++x) {
		  for (var y = 0; y < 4; ++y) {
        // dot product of row (x * 4) vs column (y)
        result.arr[(x * 4) + y] = (this.arr[(x * 4)] * other.arr[y]) +
          (this.arr[(x * 4) + 1] * other.arr[y + 4]) +
          (this.arr[(x * 4) + 2] * other.arr[y + 8]) +
          (this.arr[(x * 4) + 3] * other.arr[y + 12]);
      }
    }
    
    this.arr = result.arr;
  }

  translate(transVec) {
    let transMat = new Mat4();
    transMat.arr[12] = transVec.x;
    transMat.arr[13] = transVec.y;
    transMat.arr[14] = transVec.z;

    transMat.mult(this);
    this.arr = transMat.arr.slice();
  }

  rotate(angle, axis) {
    let rotMat = new Mat4();
    
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let t = 1 - c;

    let x = axis.x;
    let y = axis.y;
    let z = axis.z;

    // normalise the axis
    let len = Math.sqrt((x * x) + (y * y) + (z * z));
    if (Math.abs(len < 0.00001)) {
      throw new EngineError("ee: normalised axis has length of 0");
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    //
    
    rotMat.arr[0] = (t * (x * x)) + c;
    rotMat.arr[1] = (t * (x * y)) - (z * s);
    rotMat.arr[2] = (t * (x * z)) + (y * s);

    rotMat.arr[4] = (t * (x * y)) + (z * s);
    rotMat.arr[5] = (t * (y * y)) + c;
    rotMat.arr[6] = (t * (y * z)) - (x * s);

    rotMat.arr[8] = (t * (x * z)) - (y * s);
    rotMat.arr[9] = (t * (y * z)) + (x * s);
    rotMat.arr[10] = (t * (z * z)) + c;

    rotMat.mult(this);
    this.arr = rotMat.arr.slice();
  }

  scale(scale) {
    let scaleMat = new Mat4();
    scaleMat.arr[0] = scale.x;
    scaleMat.arr[5] = scale.y;
    scaleMat.arr[10] = scale.z;

    scaleMat.mult(this);
    this.arr = scaleMat.arr.slice();
  }

  asArr() {
    return Float32Array.from(this.arr);
  }

  asString() {
    let matStr = "";
    for (let i = 0, j = 0; i < this.arr.length; ++i, ++j) {
      matStr += this.arr[i];
      matStr += "  ";

      if (j == 3) {
        matStr += "\n";
        j = -1;
      }
    }

    return matStr;
  }
};

export default Mat4;
