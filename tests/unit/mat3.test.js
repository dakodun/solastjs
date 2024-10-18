import { describe, test, expect } from 'vitest';

import Mat3 from '../../scr/mat3.js';

import Vec2 from '../../scr/vec2.js';
import Vec3 from '../../scr/vec3.js';

describe("construction", () => {
  test("new Mat3() should populate 'arr' field with " +
  "identity matrix", () => {
    let matrix = new Mat3();
    let expected = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    expect(matrix.arr).toEqual(expected);
  });
});

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let matrix = new Mat3();
    let matrixOther = new Mat3();
      matrixOther.arr[2] = 2;
      matrixOther.arr[4] = 2;
      matrixOther.arr[6] = 2;

    matrix.copy(matrixOther);
    
    expect(matrix).toEqual(matrixOther);
    expect(matrix).not.toBe(matrixOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Mat3'", () => {
    let matrix = new Mat3();
    let matrixStr = "matrixStr";

    expect(() => matrix.copy(matrixStr)).toThrowError(/Mat3/);
  });

  test("this.copy(other) should not modify 'other'", () => {
    let matrix = new Mat3();
    let matrixOther = new Mat3();
      matrixOther.arr[2] = 2;
      matrixOther.arr[4] = 2;
      matrixOther.arr[6] = 2;
    let expected = [1, 0, 2, 0, 2, 0, 2, 0, 1];

    matrix.copy(matrixOther);

    expect(matrixOther.arr).toEqual(expected);
  });


  test("this.getCopy() should return a 'Mat3'", () => {
    let matrixOther = new Mat3();
    let matrix = matrixOther.getCopy();

    expect(matrix).toBeInstanceOf(Mat3);
  });

  test("this.getCopy() should return a 'Mat3' which is a deep copy " +
  "of 'this'", () => {
    let matrixOther = new Mat3();
      matrixOther.arr[2] = 2;
      matrixOther.arr[4] = 2;
      matrixOther.arr[6] = 2;

    let matrix = matrixOther.getCopy();

    expect(matrixOther).toEqual(matrix);
    expect(matrixOther).not.toBe(matrix);
  });
});


describe("modification", () => {
  test("this.identity() should set 'this.arr' to the 3-dimensional " +
  "identity matrix", () => {
    let matrix = new Mat3();
      matrix.arr[0] = 2;
      matrix.arr[4] = 2;
      matrix.arr[8] = 2;
    let expected = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    matrix.identity();

    expect(matrix.arr).toEqual(expected);
  });


  test("this.transpose() should switch between column and row major " +
  "order", () => {
    let matrix = new Mat3();
      matrix.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let expected = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    
    matrix.transpose();

    expect(matrix.arr).toEqual(expected);
  });


  test("this.getTranspose() should return a 'Mat3'", () => {
    let matrixOther = new Mat3();
    let matrix = matrixOther.getTranspose();

    expect(matrix).toBeInstanceOf(Mat3);
  });

  test("this.getTranspose() should return a 'Mat3' which is the " +
  "transpose of 'this'", () => {
    let matrixOther = new Mat3();
      matrixOther.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let expected = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    
    let matrix = matrixOther.getTranspose();

    expect(matrix.arr).toEqual(expected);
  });

  test("this.getTranspose() should not modify 'this'", () => {
    let matrixOther = new Mat3();
      matrixOther.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let expected = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    matrixOther.getTranspose();

    expect(matrixOther.arr).toEqual(expected);
  });
});

describe("multiplication", () => {
  test("this.multMat3(other) should modify 'this.arr' with the result " +
  "of (this) row * (other) column", () => {
    let matrix = new Mat3();
      matrix.arr[2] = 2;
      matrix.arr[4] = 2;
      matrix.arr[6] = 2;
    let matrixOther = new Mat3();
      matrixOther.arr[0] = 2;
      matrixOther.arr[4] = 3;
      matrixOther.arr[7] = 2;
    let expected = [2, 0, 4, 0, 6, 0, 2, 4, 1];
    
    matrix.multMat3(matrixOther);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.multMat3(other) should throw an error if 'other' is not " +
  "a 'Mat3'", () => {
    let matrix = new Mat3();
    let matrixStr = "matrixStr";

    expect(() => matrix.multMat3(matrixStr)).toThrowError(/Mat3/);
  });

  test("this.multMat3(other) should not modify 'other'", () => {
    let matrix = new Mat3();
    let matrixOther = new Mat3();
      matrixOther.arr[2] = 2;
      matrixOther.arr[4] = 2;
      matrixOther.arr[6] = 2;
    let expected = [1, 0, 2, 0, 2, 0, 2, 0, 1];

    matrix.multMat3(matrixOther);

    expect(matrixOther.arr).toEqual(expected);
  });


  test("this.getMultVec3(multVec) should return a 'Vec3'", () => {
    let matrix = new Mat3();
    let vectorIn = new Vec3();

    let vectorOut = matrix.getMultVec3(vectorIn);

    expect(vectorOut).toBeInstanceOf(Vec3);
  });

  test("this.getMultVec3(multVec) should return a 'Vec3' with the result " +
  "of (this) row * (multVec) column", () => {
    let matrix = new Mat3();
      matrix.arr[2] = 2;
      matrix.arr[4] = 2;
      matrix.arr[6] = 2;
    let vectorIn = new Vec3();
      vectorIn.x = 1;
      vectorIn.y = 2;
      vectorIn.z = 3;
    let expected = [7, 4, 5];

    let vectorOut = matrix.getMultVec3(vectorIn);
    let arr = [vectorOut.x, vectorOut.y, vectorOut.z];

    expect(arr).toEqual(expected);
  });

  test("this.getMultVec3(multVec) should throw an error if 'multVec' is " +
  "not a 'Vec3'", () => {
    let matrix = new Mat3();
    let vectorStr = "vectorStr";

    expect(() => matrix.getMultVec3(vectorStr)).toThrowError(/Vec3/);
  });
  
  test("this.getMultVec3(multVec) should not modify 'this'", () => {
    let matrix = new Mat3();
      matrix.arr[2] = 2;
      matrix.arr[4] = 2;
      matrix.arr[6] = 2;
    let vector = new Vec3();
      vector.x = 1;
      vector.y = 2;
      vector.z = 3;
    let expected = [1, 0, 2, 0, 2, 0, 2, 0, 1];

    matrix.getMultVec3(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.getMultVec3(multVec) should not modify 'multVec'", () => {
    let matrix = new Mat3();
      matrix.arr[2] = 2;
      matrix.arr[4] = 2;
      matrix.arr[6] = 2;
    let vector = new Vec3();
      vector.x = 1;
      vector.y = 2;
      vector.z = 3;
    let expected = [1, 2, 3];

    matrix.getMultVec3(vector);
    let arr = [vector.x, vector.y, vector.z];

    expect(arr).toEqual(expected);
  });
});

describe("transforms", () => {
  test("this.translate(transVec) should modify 'this.arr' with " +
  "the result of (this) row * (translation matrix - constructed " +
  "from 'transVec') column", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 2, 0, 2, 1, 0, 30, 10, 1];
    let vector = new Vec2();
      vector.x = 10;
      vector.y = -20;
    let expected = [1, 2, 0, 2, 1, 0, 0, 10, 1];
    
    matrix.translate(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.translate(transVec) should throw an error if 'transVec' " +
  "not a 'Vec2'", () => {
    let matrix = new Mat3();
    let vectorStr = "vectorStr";

    expect(() => matrix.translate(vectorStr)).toThrowError(/Vec2/);
  });

  test("this.translate(transVec) should not modify 'transVec'", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 2, 0, 2, 1, 0, 30, 10, 1];
    let vector = new Vec2();
      vector.x = 10;
      vector.y = -20;
    let expected = [10, -20];

    matrix.translate(vector);
    let arr = [vector.x, vector.y];

    expect(arr).toEqual(expected);
  });

  
  test("this.rotate(angle) should modify 'this.arr' with " +
  "the result of (this) row * (rotation matrix - constructed " +
  "from 'angle') column", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 2, 0, 2, 1, 0, 30, 10, 1];
    let theta = Math.PI;
    let expected = [-1, -2, 0, -2, -1, 0, 30, 10, 1];
    
    matrix.rotate(theta);
    matrix.arr.forEach((val, ind, arr) => arr[ind] = Math.round(val));

    expect(matrix.arr).toEqual(expected);
  });

  test("this.rotate(angle) should throw an error if 'angle' " +
  "is not a 'Number'", () => {
    let matrix = new Mat3();
    let thetaStr = "thetaStr";

    expect(() => matrix.rotate(thetaStr)).toThrowError(/Number/);
  });

  test("this.rotate(angle) should not modify 'angle'", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 2, 0, 2, 1, 0, 30, 10, 1];
    let theta = Math.PI;

    matrix.rotate(theta);

    expect(theta).toBeCloseTo(Math.PI);
  });


  test("this.scale(scaleVec) should modify 'this.arr' with " +
  "the result of (this) row * (scaling matrix - constructed " +
  "from 'scaleVec') column", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 2, 0, 2, 1, 0, 30, 10, 1];
    let vector = new Vec2();
      vector.x = 10;
      vector.y = -20;
    let expected = 
      [10, 20, 0, -40, -20, 0, 30, 10, 1];
    
    matrix.scale(vector);

    expect(matrix.arr).toEqual(expected);
  });

  test("this.scale(scaleVec) should throw an error if 'scaleVec' " +
  "not a 'Vec2'", () => {
    let matrix = new Mat3();
    let vectorStr = "vectorStr";

    expect(() => matrix.scale(vectorStr)).toThrowError(/Vec2/);
  });

  test("this.scale(scaleVec) should not modify 'scaleVec'", () => {
    let matrix = new Mat3();
      matrix.arr = [1, 1, 2, 0, 1, 1, 1, 0, 2, 1, 1, 0, 30, 10, -20, 1];
    let vector = new Vec2();
      vector.x = 10;
      vector.y = -20;
    let expected = [10, -20];

    matrix.scale(vector);
    let arr = [vector.x, vector.y];

    expect(arr).toEqual(expected);
  });
});

describe("conversion", () => {
  test("this.asString() should return string object", () => {
    let matrix = new Mat3();
    let matrixStr = matrix.asString();

    expect(matrixStr).toBeTypeOf('string');
  });
});
