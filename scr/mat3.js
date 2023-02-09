import EngineError from './error.js';
import Vec3 from './vec3.js';

class Mat3 {
  constructor() {
    this.arr = new Array();
    this.identity();
  }

  copy(other) {
    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat3(); copy.copy(this);
    return copy;
  }

  identity() {
    this.arr.splice(0, this.arr.length);
    this.arr = [1, 0, 0,
                0, 1, 0,
                0, 0, 1];
  }

  multMat3(other) {
    let result = new Mat3();

    for (var x = 0; x < 3; ++x) {
      for (var y = 0; y < 3; ++y) {
        // dot product of row (x * 3) vs column (y)
        result.arr[(x * 3) + y] = (this.arr[(x * 3)] * other.arr[y]) +
          (this.arr[(x * 3) + 1] * other.arr[y + 3]) +
          (this.arr[(x * 3) + 2] * other.arr[y + 6]);
      }
    }
    
    return result;
  }

  multVec3(other) {
    let result = new Vec3();
    let arr = new Array();

    for (var x = 0; x < 3; ++x) {
        arr[x] = (this.arr[(x * 3)] * other.x) +
          (this.arr[(x * 3) + 1] * other.y) +
          (this.arr[(x * 3) + 2] * other.z);
    }
    
    result.setArr(arr);
    return result;
  }

  translate(transVec) {
    let transMat = new Mat3();
    transMat.arr[6] = transVec.x;
    transMat.arr[7] = transVec.y;

    transMat.mult(this);
    this.arr = transMat.arr.slice();
  }

  rotate(angle) {
    let rotMat = new Mat3();
    
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    
    rotMat.arr[0] = c;
    rotMat.arr[1] = -s;

    rotMat.arr[3] = s;
    rotMat.arr[4] = c;

    rotMat.mult(this);
    this.arr = rotMat.arr.slice();
  }

  scale(scale) {
    let scaleMat = new Mat3();
    scaleMat.arr[0] = scale.x;
    scaleMat.arr[4] = scale.y;

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

      if (j == 2) {
        matStr += "\n";
        j = -1;
      }
    }

    return matStr;
  }

  // deprecated
  mult(other) {
    let result = new Mat3();

    for (var x = 0; x < 3; ++x) {
      for (var y = 0; y < 3; ++y) {
        // dot product of row (x * 3) vs column (y)
        result.arr[(x * 3) + y] = (this.arr[(x * 3)] * other.arr[y]) +
          (this.arr[(x * 3) + 1] * other.arr[y + 3]) +
          (this.arr[(x * 3) + 2] * other.arr[y + 6]);
      }
    }
    
    this.arr = result.arr;
  }
};

export default Mat3;
