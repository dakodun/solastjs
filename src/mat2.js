import Sol from './sol.js';

import Vec2 from './vec3.js';

class Mat2 {
  // a 2-dimensional matrix in column-major order
  //
  // .-COL-MAJ-.
  // |  0   2  |
  // |  1   3  |
  // '---------'

  //> internal properties //
  _arr = [1, 0, 0, 1];

  //> constructor //
	constructor(arr = [1, 0, 0, 1]) {
    this.arr = arr;
	}

  //> getters/setters //
  get arr() { return this._arr; }
  
  set arr(arr) {
    Sol.checkTypes(this, "set arr", [{arr}, [Array]]);

    if (arr.length !== 4) {
      throw new RangeError("Mat2 (set arr): should be an Array " +
      "with 4 elements");
    }

    this._arr = arr;
  }

  //> public methods //
	copy(other) {
    Sol.checkTypes(this, "copy", [{other}, [Mat2]]);
    
    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat2();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals", [{other}, [Mat2]]);

    for (let i = 0; i < this._arr.length; ++i) {
      if (this._arr[i] !== other._arr[i]) {
        return false;
      }
    }

    return true;
  }

  identity() {
    this.arr.splice(0, this.arr.length);
    this.arr = [1, 0, 0, 1];
  }

  transpose() {
    let copy = this.getCopy();

    for (let x = 0; x < 2; ++x) {
		  for (let y = 0; y < 2; ++y) {
        this.arr[(x * 2) + y] = copy.arr[(y * 2) + x];
      }
    }
  }

  getTranspose() {
    let transposed = this.getCopy();
    transposed.transpose();

    return transposed;
  }

  getDeterminant() {
    // .--MAT--.
    // | a   b |
    // | c   d | => |MAT| = (a * d) - (b * c)
    // '-------'
    
    return (this._arr[0] * this._arr[3]) -
      (this._arr[2] * this._arr[1]);
  }

  multMat2(other) {
    Sol.checkTypes(this, "multMat2", [{other}, [Mat2]]);

    let result = new Mat2();

    // post multiplication - this row * other column
    for (let x = 0; x < 2; ++x) {
		  for (let y = 0; y < 2; ++y) {
        result.arr[(x * 2) + y] =
          (this.arr[y    ] * other.arr[(x * 2)    ]) +
          (this.arr[y + 2] * other.arr[(x * 2) + 1]);
      }
    }
    
    this.arr = result.arr;
  }

  getMultVec2(multVec) {
    // .--MAT--.   .-V-.
    // | 0   2 |   | 0 |
    // | 1   3 | . | 1 |
    // '-------'   '---'
    
    Sol.checkTypes(this, "getMultVec2", [{multVec}, [Vec2]]);
    
    let arrIn = multVec.asArray();
    let arrOut = new Array();

    for (let i = 0; i < 2; ++i) {
      arrOut[i] =
        (this.arr[i    ] * arrIn[0]) +
        (this.arr[i + 2] * arrIn[1]);
    }
    
    let result = new Vec2();
    result.fromArray(arrOut);
    return result;
  }

  asString() {
    let matStr = "";

    for (let x = 0; x < 2; ++x) {
		  for (let y = 0; y < 2; ++y) {
        matStr += this.arr[(y * 2) + x];
        matStr += "  ";

        if (y === 1) {
          matStr += "\n";
        }
      }
    }

    return matStr;
  }
};

export default Mat2;
