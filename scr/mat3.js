import Vec2 from './vec2.js';
import Vec3 from './vec3.js';

class Mat3 {
  // private fields
    #arr = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  // ...

	constructor(arr = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    /*
    .-COL-MAJOR-.
    | 0   3   6 |
    | 1   4   7 |
    | 2   5   8 |
    '-----------'
    */
    
    this.arr = arr;
	} 

  // getters/setters
  get arr() { return this.#arr; }
  
  set arr(arr) {
    if (!(arr instanceof Array)) {
      throw new TypeError("Mat3 (arr): should be an Array");
    } else if (arr.length !== 9) {
      throw new RangeError("Mat3 (arr): should be an Array with " +
        "9 elements");
    }

    this.#arr = arr;
  }
  // ...

	copy(other) {
    if (!(other instanceof Mat3)) {
      throw new TypeError("Mat3 (copy): other should be a Mat3");
    }

    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat3(); copy.copy(this);
    return copy;
  }

  equals(other) {
    if (!(other instanceof Mat3)) {
      throw new TypeError("Mat3 (equals): other should be a Mat3");
    }

    for (let i = 0; i < this.#arr.length; ++i) {
      if (this.#arr[i] !== other.#arr[i]) {
        return false;
      }
    }

    return true;
  }

  identity() {
    this.arr.splice(0, this.arr.length);
    this.arr = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  transpose() {
    let copy = this.getCopy();

    for (let x = 0; x < 3; ++x) {
		  for (let y = 0; y < 3; ++y) {
        this.arr[(x * 3) + y] = copy.arr[(y * 3) + x];
      }
    }
  }

  getTranspose() {
    let transposed = this.getCopy();
    transposed.transpose();

    return transposed;
  }

  multMat3(other) {
    if (!(other instanceof Mat3)) {
      throw new TypeError("Mat3 (multMat3): other should be a Mat3");
    }

    let result = new Mat3();

    // post multiplication - this row * other column
    for (let x = 0; x < 3; ++x) {
		  for (let y = 0; y < 3; ++y) {
        result.arr[(x * 3) + y] =
          (this.arr[y    ] * other.arr[(x * 3)    ]) +
          (this.arr[y + 3] * other.arr[(x * 3) + 1]) +
          (this.arr[y + 6] * other.arr[(x * 3) + 2]);
      }
    }
    
    this.arr = result.arr;
  }

  getMultVec3(multVec) {
    /*
    .--MATRIX---.   .-V-.
    | 0   3   6 |   | 0 |
    | 1   4   7 | . | 1 |
    | 2   5   8 |   | 2 |
    '-----------'   '---'
    */
    
    if (!(multVec instanceof Vec3)) {
      throw new TypeError("Mat3 (getMultVec3): multVec should be a Vec3");
    }
    
    let arrIn = multVec.asArray();
    let arrOut = new Array();

    for (let i = 0; i < 3; ++i) {
      arrOut[i] =
        (this.arr[i    ] * arrIn[0]) +
        (this.arr[i + 3] * arrIn[1]) +
        (this.arr[i + 6] * arrIn[2]);
    }
    
    let result = new Vec3();
    result.fromArray(arrOut);
    return result;
  }

  translate(transVec) {
    /*
    .TRANSLATE-.
    | 1   0  tx|
    | 0   1  ty|
    | 0   0   1|
    '----------'
    */
    
    if (!(transVec instanceof Vec2)) {
      throw new TypeError("Mat3 (translate): transVec should be a Vec2");
    }
    
    let transMat = new Mat3();
    transMat.arr[6] = transVec.x;
    transMat.arr[7] = transVec.y;

    this.multMat3(transMat);
  }

  rotate(angle) {
    /*
    .--ROLL-----------.
    | cosZ -sinZ     0|
    | sinZ  cosZ     0|
    |    0     0     1|
    '-----------------'
    */
    
    if (typeof angle != 'number') {
      throw new TypeError("Mat3 (rotate): angle should be a Number");
    }

    let cZ = Math.cos(angle);
    let sZ = Math.sin(angle);

    let rotZ = new Mat3();
    rotZ.arr[0] =  cZ
    rotZ.arr[1] =  sZ;
    rotZ.arr[3] = -sZ;
    rotZ.arr[4] =  cZ;

    this.multMat3(rotZ);
  }

  scale(scaleVec) {
    /*
    .--SCALE----.
    | sx   0   0|
    |  0  sy   0|
    |  0   0   1|
    '-----------'
    */
    
    if (!(scaleVec instanceof Vec2)) {
      throw new TypeError("Mat3 (scale): scaleVec should be a Vec2");
    }

    let scaleMat = new Mat3();

    scaleMat.arr[0] = scaleVec.x;
    scaleMat.arr[4] = scaleVec.y;

    this.multMat3(scaleMat);
  }

  asString() {
    let matStr = "";

    for (let x = 0; x < 3; ++x) {
		  for (let y = 0; y < 3; ++y) {
        matStr += this.arr[(y * 3) + x];
        matStr += "  ";

        if (y == 2) {
          matStr += "\n";
        }
      }
    }

    return matStr;
  }
};

export default Mat3;
