import { describe, test, expect } from 'vitest';

import Mat4 from '../../scr/mat4.js';

import Vec3 from '../../scr/vec3.js';
import Vec4 from '../../scr/vec4.js';

describe("construction", () => {
  test("new Mat4() should populate 'arr' field with " +
  "identity matrix", () => {
    let matrix = new Mat4();
    let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    expect(matrix.arr).toEqual(expected);
  });
});

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let matrix = new Mat4();
    let matrixOther = new Mat4();
      matrixOther.arr[ 3] = 2;
      matrixOther.arr[ 6] = 2;
      matrixOther.arr[ 9] = 2;
      matrixOther.arr[12] = 2;

    matrix.copy(matrixOther);
    
    expect(matrix).toEqual(matrixOther);
    expect(matrix).not.toBe(matrixOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Mat4'", () => {
    let matrix = new Mat4();
    let matrixStr = "matrixStr";

    expect(() => matrix.copy(matrixStr)).toThrowError(/Mat4/);
  });

  test("this.copy(other) should not modify 'other'", () => {
    let matrix = new Mat4();
    let matrixOther = new Mat4();
      matrixOther.arr[ 3] = 2;
      matrixOther.arr[ 6] = 2;
      matrixOther.arr[ 9] = 2;
      matrixOther.arr[12] = 2;
    let expected = [1, 0, 0, 2, 0, 1, 2, 0, 0, 2, 1, 0, 2, 0, 0, 1];

    matrix.copy(matrixOther);

    expect(matrixOther.arr).toEqual(expected);
  });


  test("this.getCopy() should return a 'Mat4'", () => {
    let matrixOther = new Mat4();
    let matrix = matrixOther.getCopy();

    expect(matrix).toBeInstanceOf(Mat4);
  });

  test("this.getCopy() should return a 'Mat4' which is a deep copy " +
  "of 'this'", () => {
    let matrixOther = new Mat4();
      matrixOther.arr[ 3] = 2;
      matrixOther.arr[ 6] = 2;
      matrixOther.arr[ 9] = 2;
      matrixOther.arr[12] = 2;

    let matrix = matrixOther.getCopy();

    expect(matrixOther).toEqual(matrix);
    expect(matrixOther).not.toBe(matrix);
  });
});


describe("modification", () => {
  test("this.identity() should set 'this.arr' to the 4-dimensional " +
  "identity matrix", () => {
    let matrix = new Mat4();
      matrix.arr[ 0] = 2;
      matrix.arr[ 3] = 2;
      matrix.arr[ 9] = 2;
      matrix.arr[15] = 2;
    let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    matrix.identity();

    expect(matrix.arr).toEqual(expected);
  });


  test("this.transpose() should switch between column and row major " +
  "order", () => {
    let matrix = new Mat4();
      matrix.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let expected = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
    
    matrix.transpose();

    expect(matrix.arr).toEqual(expected);
  });


  test("this.getTranspose() should return a 'Mat4'", () => {
    let matrixOther = new Mat4();
    let matrix = matrixOther.getTranspose();

    expect(matrix).toBeInstanceOf(Mat4);
  });

  test("this.getTranspose() should return a 'Mat4' which is the " +
  "transpose of 'this'", () => {
    let matrixOther = new Mat4();
      matrixOther.arr =
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let expected = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
    
    let matrix = matrixOther.getTranspose();

    expect(matrix.arr).toEqual(expected);
  });

  test("this.getTranspose() should not modify 'this'", () => {
    let matrixOther = new Mat4();
      matrixOther.arr =
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    let matrix = matrixOther.getTranspose();

    expect(matrixOther.arr).toEqual(expected);
  });
});

describe("multiplication", () => {
  test("this.multMat4(other) should modify 'this.arr' with the result " +
  "of (this) row * (other) column", () => {
    let matrix = new Mat4();
      matrix.arr[ 3] = 2;
      matrix.arr[ 6] = 2;
      matrix.arr[ 9] = 2;
      matrix.arr[12] = 2;
    let matrixOther = new Mat4();
      matrixOther.arr[ 0] = 2;
      matrixOther.arr[ 5] = 3;
      matrixOther.arr[10] = 2;
      matrixOther.arr[15] = 3;
    let expected = [2, 0, 0, 4, 0, 3, 6, 0, 0, 4, 2, 0, 6, 0, 0, 3];
    
    matrix.multMat4(matrixOther);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.multMat4(other) should throw an error if 'other' is not " +
  "a 'Mat4'", () => {
    let matrix = new Mat4();
    let matrixStr = "matrixStr";

    expect(() => matrix.multMat4(matrixStr)).toThrowError(/Mat4/);
  });

  test("this.multMat4(other) should not modify 'other'", () => {
    let matrix = new Mat4();
    let matrixOther = new Mat4();
      matrixOther.arr[ 3] = 2;
      matrixOther.arr[ 6] = 2;
      matrixOther.arr[ 9] = 2;
      matrixOther.arr[12] = 2;
    let expected = [1, 0, 0, 2, 0, 1, 2, 0, 0, 2, 1, 0, 2, 0, 0, 1];

    matrix.multMat4(matrixOther);

    expect(matrixOther.arr).toEqual(expected);
  });


  test("this.getMultVec4(multVec) should return a 'Vec4'", () => {
    let matrix = new Mat4();
    let vectorIn = new Vec4();

    let vectorOut = matrix.getMultVec4(vectorIn);

    expect(vectorOut).toBeInstanceOf(Vec4);
  });

  test("this.getMultVec4(multVec) should return a 'Vec4' with the result " +
  "of (this) row * (multVec) column", () => {
    let matrix = new Mat4();
      matrix.arr[ 3] = 2;
      matrix.arr[ 6] = 2;
      matrix.arr[ 9] = 2;
      matrix.arr[12] = 2;
    let vectorIn = new Vec4();
      vectorIn.x = 1;
      vectorIn.y = 2;
      vectorIn.z = 3;
      vectorIn.w = 4;
    let expected = [9, 8, 7, 6];

    let vectorOut = matrix.getMultVec4(vectorIn);
    let arr = [vectorOut.x, vectorOut.y, vectorOut.z, vectorOut.w];

    expect(arr).toEqual(expected);
  });

  test("this.getMultVec4(multVec) should throw an error if 'multVec' is " +
  "not a 'Vec4'", () => {
    let matrix = new Mat4();
    let vectorStr = "vectorStr";

    expect(() => matrix.getMultVec4(vectorStr)).toThrowError(/Vec4/);
  });
  
  test("this.getMultVec4(multVec) should not modify 'this'", () => {
    let matrix = new Mat4();
      matrix.arr[ 3] = 2;
      matrix.arr[ 6] = 2;
      matrix.arr[ 9] = 2;
      matrix.arr[12] = 2;
    let vector = new Vec4();
      vector.x = 1;
      vector.y = 2;
      vector.z = 3;
      vector.w = 4;
    let expected = [1, 0, 0, 2, 0, 1, 2, 0, 0, 2, 1, 0, 2, 0, 0, 1];

    matrix.getMultVec4(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.getMultVec4(multVec) should not modify 'multVec'", () => {
    let matrix = new Mat4();
      matrix.arr[ 3] = 2;
      matrix.arr[ 6] = 2;
      matrix.arr[ 9] = 2;
      matrix.arr[12] = 2;
    let vector = new Vec4();
      vector.x = 1;
      vector.y = 2;
      vector.z = 3;
      vector.w = 4;
    let expected = [1, 2, 3, 4];

    matrix.getMultVec4(vector);
    let arr = [vector.x, vector.y, vector.z, vector.w];

    expect(arr).toEqual(expected);
  });
});

describe("projections", () => {
  test.todo("ortho()");
  test.todo("perspective()");
  test.todo("frustum()");
});

describe("transforms", () => {
  test("this.translate(transVec) should modify 'this.arr' with " +
  "the result of (this) row * (translation matrix - constructed " +
  "from 'transVec') column", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = 10;
      vector.y = -20;
      vector.z = 30;
    let expected = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 80, 30, 10, 1];
    
    matrix.translate(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.translate(transVec) should throw an error if 'transVec' " +
  "not a 'Vec3'", () => {
    let matrix = new Mat4();
    let vectorStr = "vectorStr";

    expect(() => matrix.translate(vectorStr)).toThrowError(/Vec3/);
  });

  test("this.translate(transVec) should not modify 'transVec'", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = 10;
      vector.y = -20;
      vector.z = 30;
    let expected = [10, -20, 30];

    matrix.translate(vector);
    let arr = [vector.x, vector.y, vector.z];

    expect(arr).toEqual(expected);
  });


  test.todo("rotateAxis(angle, axis)");


  test("this.rotateEuler(angles) should modify 'this.arr' with " +
  "the result of (this) row * (rotation matrix - constructed " +
  "from 'angles') column", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = Math.PI;
      vector.y = Math.PI;
      vector.z = Math.PI;
    let expected = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    
    matrix.rotateEuler(vector);
    matrix.arr.forEach((val, ind, arr) => arr[ind] = Math.round(val));

    expect(matrix.arr).toEqual(expected);
  });

  test("this.rotateEuler(angles) should throw an error if 'angles' " +
  "is not a 'Vec3'", () => {
    let matrix = new Mat4();
    let vectorStr = "vectorStr";

    expect(() => matrix.rotateEuler(vectorStr)).toThrowError(/Vec3/);
  });

  test("this.rotateEuler(angles) should not modify 'angles'", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = 1;
      vector.y = 1;
      vector.z = 1;
    let expected = [1, 1, 1];

    matrix.rotateEuler(vector);
    let arr = [vector.x, vector.y, vector.z];

    expect(arr).toEqual(expected);
  });


  test("this.scale(scaleVec) should modify 'this.arr' with " +
  "the result of (this) row * (scaling matrix - constructed " +
  "from 'scaleVec') column", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = 10;
      vector.y = -20;
      vector.z = 30;
    let expected = 
      [10, 10, 20, 0, -20, -20, -20, 0, 60, 30, 30, 0, 30, 10, -20, 1];
    
    matrix.scale(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.scale(scaleVec) should throw an error if 'scaleVec' " +
  "not a 'Vec3'", () => {
    let matrix = new Mat4();
    let vectorStr = "vectorStr";

    expect(() => matrix.scale(vectorStr)).toThrowError(/Vec3/);
  });

  test("this.scale(scaleVec) should not modify 'scaleVec'", () => {
    let matrix = new Mat4();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec3();
      vector.x = 10;
      vector.y = -20;
      vector.z = 30;
    let expected = [10, -20, 30];

    matrix.scale(vector);
    let arr = [vector.x, vector.y, vector.z];

    expect(arr).toEqual(expected);
  });
});

describe("conversion", () => {
  test.todo("decompose()");

  test("this.asString() should return string object", () => {
    let matrix = new Mat4();
    let matrixStr = matrix.asString();

    expect(matrixStr).toBeTypeOf('string');
  });
});
