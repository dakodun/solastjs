import { describe, test, expect } from 'vitest';

import Vec4 from '../../scr/vec4.js';

describe("construction", () => {
  test("new Vec4(x, y, z, w ...) should assign x, y, z and w fields " +
  "using the first 4 parameters supplied", () => {
    let vector = new Vec4(10, 20, 30, 40, 50);
    let expected = [10, 20, 30, 40];

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
    expect(vector.w).toEqual(expected[3]);
  });

  test("new Vec4(x) should pad the input using the parameter " +
  "supplied", () => {
    let vector = new Vec4(10);
    let expected = 10;

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });

  test("new Vec4() should assign a default value of 0 to " +
  "x, y, z and w fields", () => {
    let vector = new Vec4();
    let expected = 0;

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });

  test("new Vec4(...) should throw an error if a parameter " + 
  "supplied is not a 'Number'", () => {
    let str = "str";

    expect(() => new Vec4(str, 1, 2, 3)).toThrowError(/Number/);
    expect(() => new Vec4(0, str, 2, 3)).toThrowError(/Number/);
    expect(() => new Vec4(0, 1, str, 3)).toThrowError(/Number/);
    expect(() => new Vec4(0, 1, 2, str)).toThrowError(/Number/);
  });
});

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let vector = new Vec4();
    let vectorOther = new Vec4(10, 20, 30, 40);

    vector.copy(vectorOther);
    
    expect(vector).toEqual(vectorOther);
    expect(vector).not.toBe(vectorOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Vec4'", () => {
    let vector = new Vec4();
    let vectorStr = "vectorStr";

    expect(() => vector.copy(vectorStr)).toThrowError(/Vec4/);
  });

  test("this.copy(other) should not modify 'other'", () => {
    let vector = new Vec4();
    let vectorOther = new Vec4(10, 20, 30, 40);
    let expected = [10, 20, 30, 40];

    vector.copy(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
    expect(vectorOther.w).toEqual(expected[3]);
  });


  test("this.getCopy() should return a 'Vec4'", () => {
    let vectorOther = new Vec4();
    let vector = vectorOther.getCopy();

    expect(vector).toBeInstanceOf(Vec4);
  });

  test("this.getCopy() should return a 'Vec4' which is a deep copy " +
  "of 'this'", () => {
    let vectorOther = new Vec4(10, 20, 30, 40);
    let vector = vectorOther.getCopy();

    expect(vectorOther).toEqual(vector);
    expect(vectorOther).not.toBe(vector);
  });
});

describe("comparison", () => {
  test("this.equals(other, tolerance) should throw an error if " +
  "'other' is not a 'Vec4'", () => {
    let vector = new Vec4();
    let vectorStr = "vectorStr";

    expect(() => vector.equals(vectorStr, 0.1)).toThrowError(/Vec4/);
  });

  test("this.equals(other, tolerance) should throw an error if " +
  "'tolerance' is not a 'Number'", () => {
    let vector = new Vec4();
    let vectorOther = new Vec4();
    let toleranceStr = "toleranceStr";

    expect(() => vector.equals(vectorOther, toleranceStr)).
      toThrowError(/Number/);
  });

  test("this.equals(other, tolerance) should return a 'Boolean'", () => {
    let vector = new Vec4();
    let vectorOther = new Vec4();

    let result = vector.equals(vectorOther);

    expect(result).toBeTypeOf('boolean');
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "within the tolerance supplied", () => {
    let vector = new Vec4(10, 20, 30, 40);
    let vectorOther = new Vec4(10.4, 19.6, 29.8, 40.2);
    let expected = true;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the tolerance supplied", () => {
    let vector = new Vec4(10, 20, 30, 40);
    let vectorOther = new Vec4(-10.4, 19.2, 29, 41);
    let expected = false;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });
  
  test("this.equals(other, tolerance) returns correct result when " +
  "within the default tolerance", () => {
    let vector = new Vec4(10, 20, 30, 40);
    let vectorOther = new Vec4(10, 20, 30, 40);
    let expected = true;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the default tolerance", () => {
    let vector = new Vec4(10, 20, 30, 40);
    let vectorOther = new Vec4(10.05, 19.95, 29, 41);
    let expected = false;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });
});

describe("modification", () => {
  test("this.negate() should reverse the signs of x, y, z and w fields " +
  "in place", () => {
    let vector = new Vec4(10, -20, 30, -40);
    let expected = [-10, 20, -30, 40];

    vector.negate();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
    expect(vector.w).toEqual(expected[3]);
  });


  test("this.getNegated() should return a 'Vec4'", () => {
    let vector = new Vec4();
    let vectorOther = vector.getNegated();

    expect(vectorOther).toBeInstanceOf(Vec4);
  });

  test("this.getNegated() should not modify 'this'", () => {
    let vector = new Vec4(10, -20, 30, -40);
    let expected = [10, -20, 30, -40];

    vector.getNegated();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
    expect(vector.w).toEqual(expected[3]);
  });

  test("this.getNegated() should return a 'Vec4' with the signs " +
  "of x, y, z and w fields reversed", () => {
    let vector = new Vec4(10, -20, 30, -40);
    let vectorOther = vector.getNegated();
    let expected = [-10, 20, -30, 40];

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
    expect(vectorOther.w).toEqual(expected[3]);
  });


  test("this.normalize() should normalize the x, y, z and w fields " +
  "in place", () => {
    let vector = new Vec4(1, 1, 1, 1);
    let expected = 0.5;

    vector.normalize();

    expect(vector.x).toBeCloseTo(expected, 3);
    expect(vector.y).toBeCloseTo(expected, 3);
    expect(vector.z).toBeCloseTo(expected, 3);
    expect(vector.w).toBeCloseTo(expected, 3);
  });

  test("this.normalize() should handle a vector with a " +
  "0 length", () => {
    let vector = new Vec4(0, 0, 0, 0);
    let expected = 0;

    vector.normalize();

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });

  
  test("this.getNormalized() should return a 'Vec4'", () => {
    let vector = new Vec4();
    let vectorOther = vector.getNormalized();

    expect(vectorOther).toBeInstanceOf(Vec4);
  });

  test("this.getNormalized() should not modify 'this'", () => {
    let vector = new Vec4(1, 1, 1, 1);
    let expected = 1;

    vector.getNormalized();

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });

  test("this.getNormalized() should return a 'Vec4' with " +
  "x, y, z and w fields normalized", () => {
    let vector = new Vec4(1, 1, 1, 1);
    let vectorOther = vector.getNormalized();
    let expected = 0.5;

    expect(vectorOther.x).toBeCloseTo(expected, 3);
    expect(vectorOther.y).toBeCloseTo(expected, 3);
    expect(vectorOther.z).toBeCloseTo(expected, 3);
    expect(vectorOther.w).toBeCloseTo(expected, 3);
  });
});

describe("transform", () => {
  test("this.getDot(other) should throw an error if 'other' is not " +
  "a 'Vec4'", () => {
    let vector = new Vec4();
    let vectorStr = "vectorStr";

    expect(() => vector.getDot(vectorStr)).toThrowError(/Vec4/);
  });

  test("this.getDot(other) should return a 'Number'", () => {
    let vector = new Vec4();
    let vectorOther = new Vec4();

    let result = vector.getDot(vectorOther);

    expect(result).toBeTypeOf('number');
  });

  test("this.getDot(other) should return a 'Number' which is " +
  "the dot product of both vectors", () => {
    let vector = new Vec4(1, 2, 3, 4);
    let vectorOther = new Vec4(5, 6, 7, 8);
    let expected = 70;

    let result = vector.getDot(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.getDot(other) should not modify 'this'", () => {
    let vector = new Vec4(1, 2, 3, 4);
    let vectorOther = new Vec4(5, 6, 7, 8);
    let expected = [1, 2, 3, 4];

    vector.getDot(vectorOther);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
    expect(vector.w).toEqual(expected[3]);
  });

  test("this.getDot(other) should not modify 'other'", () => {
    let vector = new Vec4(1, 2, 3, 4);
    let vectorOther = new Vec4(5, 6, 7, 8);
    let expected = [5, 6, 7, 8];

    vector.getDot(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
    expect(vectorOther.w).toEqual(expected[3]);
  });
});

describe("conversion", () => {
  test("this.asArray() should return an 'Array'", () => {
    let vector = new Vec4();
    let vectorArr = vector.asArray();

    expect(vectorArr).toBeInstanceOf(Array);
  });
  
  test("this.asArray() should return an 'Array' containing the " +
  "value of x, y, z and w fields", () => {
    let vector = new Vec4(10, 20, 30, 40);
    let vectorArr = vector.asArray();

    expect(vectorArr.length).toEqual(4);

    expect(vectorArr[0]).toEqual(vector.x);
    expect(vectorArr[1]).toEqual(vector.y);
    expect(vectorArr[2]).toEqual(vector.z);
    expect(vectorArr[3]).toEqual(vector.w);
  });


  test("this.fromArray(arr) should throw an error if 'arr' is not " +
  "an 'Array'", () => {
    let vector = new Vec4();
    let arrayStr = "arrayStr";

    expect(() => vector.fromArray(arrayStr)).toThrowError(/Array/);
  });

  test("this.fromArray(arr) should throw an error if 'arr[i]' is not " +
  "a 'Number'", () => {
    let vector = new Vec4();
    let array = ["str", "str", "str", "str"];

    expect(() => vector.fromArray(array)).toThrowError(/Number/);
  });

  test("this.fromArray([x, y, z, w ...]) should assign x, y, z " +
  "and w fields using the first 4 parameters supplied", () => {
    let vector = new Vec4();
    let expected = [10, 20, 30, 40];

    vector.fromArray([10, 20, 30, 40, 50]);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
    expect(vector.w).toEqual(expected[3]);
  });

  test("this.fromArray([x]) should pad the input using the parameter " +
  "supplied", () => {
    let vector = new Vec4();
    let expected = 10;

    vector.fromArray([10]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });

  test("this.fromArray([]) should assign a default value of 0 to " +
  "x, y, z and w fields", () => {
    let vector = new Vec4();
    let expected = 0;

    vector.fromArray([]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
    expect(vector.w).toEqual(expected);
  });
});
