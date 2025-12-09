import Sol from './sol.js';

import BSTree from './bstree.js';
import Mat2 from './mat2.js';
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';

class Mat3 {
  // a 3-dimensional matrix in column-major order
  //
  // .-COL-MAJOR-.
  // | 0   3   6 |
  // | 1   4   7 |
  // | 2   5   8 |
  // '-----------'

  //> static properties //
  static _signChart = [1, -1, 1, -1, 1, -1, 1, -1, 1];
  
  //> internal properties //
  _arr = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  //> constructor //
	constructor(arr = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    this.arr = arr;
	} 

  //> getters/setters //
  get arr() { return this._arr; }
  
  set arr(arr) {
    Sol.CheckTypes(this, "set arr", [{arr}, [Array]]);

    if (arr.length !== 9) {
      throw new RangeError("Mat3 (set arr): should be an Array " +
      "with 9 elements");
    }

    this._arr = arr;
  }

  //> public methods //
	copy(other) {
    Sol.CheckTypes(this, "copy", [{other}, [Mat3]]);

    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat3();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.CheckTypes(this, "equals", [{other}, [Mat3]]);

    for (let i = 0; i < this._arr.length; ++i) {
      if (this._arr[i] !== other._arr[i]) {
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

  getDeterminant() {
    // find the determinant of a 3x3 matrix via
    // expansion using minors and cofactors

    let result = 0;

    let getIndex = (col, row) => {
      // return the index in the data array pointed to
      // by the supplied column and row, wrapping around
      // to 0

      return (((col) % 3) * 3) + (((row) % 3));
    }

    // use the first column ([0], [1], and [2]) to find
    // our determinant

    // [!] reduce work by choosing a row or column with
    //     the highest number of zeroes

    // for (let col = 0; col < 1; ++col) {
      for (let row = 0; row < 3; ++row) {
      // let ind = (col * 3) + row;
      let ind = row;
      
      // calculate the indices that make up the determinant
      // (2x2 matrix) for the current element and add them to
      // a tree, returning it as a sorted array

      let tree = new BSTree();
        tree.add(getIndex(1, row + 1));
        tree.add(getIndex(1, row + 2));

        tree.add(getIndex(2, row + 1));
        tree.add(getIndex(2, row + 2));
      
      let arr = tree.asArray();
      
      // create the 2x2 matrix from the values located
      // at the indices in this matrix's data array and
      // use it to get the determinant for the current
      // element

      let mat = new Mat2((() => {
        let res = new Array();

        arr.forEach((e) => {
          res.push(this._arr[e]);
        });

        return res;
      })());

      let minor = mat.getDeterminant()
      let cofactor = (Mat3._signChart[ind] * minor);
      result += this._arr[ind] * cofactor;
    }
    // }

    return result;
  }

  multMat3(other) {
    Sol.CheckTypes(this, "multMat3", [{other}, [Mat3]]);

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
    // .--MATRIX---.   .-V-.
    // | 0   3   6 |   | 0 |
    // | 1   4   7 | . | 1 |
    // | 2   5   8 |   | 2 |
    // '-----------'   '---'
    
    Sol.CheckTypes(this, "getMultVec3", [{multVec}, [Vec3]]);
    
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
    // .TRANSLATE-.
    // | 1   0  tx|
    // | 0   1  ty|
    // | 0   0   1|
    // '----------'
    
    Sol.CheckTypes(this, "translate", [{transVec}, [Vec2]]);
    
    let transMat = new Mat3();
    transMat.arr[6] = transVec.x;
    transMat.arr[7] = transVec.y;

    this.multMat3(transMat);
  }

  rotate(angle) {
    // .--ROLL-----------.
    // | cosZ -sinZ     0|
    // | sinZ  cosZ     0|
    // |    0     0     1|
    // '-----------------'
    
    Sol.CheckTypes(this, "rotate", [{angle}, [Number]]);

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
    // .--SCALE----.
    // | sx   0   0|
    // |  0  sy   0|
    // |  0   0   1|
    // '-----------'
    
    Sol.CheckTypes(this, "scale", [{scaleVec}, [Vec2]]);

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

        if (y === 2) {
          matStr += "\n";
        }
      }
    }

    return matStr;
  }
};

export default Mat3;
