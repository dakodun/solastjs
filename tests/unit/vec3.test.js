import { describe, test, expect } from 'vitest';

import Vec3 from '../../scr/vec3.js';

describe("construction", () => {
  test("new Vec3(x, y, z, ...) should assign x, y and z fields " +
  "using the first 3 parameters supplied", () => {
    let vector = new Vec3(10, 20, 30, 40);
    let expected = [10, 20, 30];

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  test("new Vec3(x) should pad the input using the parameter " +
  "supplied", () => {
    let vector = new Vec3(10);
    let expected = 10;

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
  });

  test("new Vec3() should assign a default value of 0 to " +
  "x, y and z fields", () => {
    let vector = new Vec3();
    let expected = 0;

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
  });

  test("new Vec3(...) should throw an error if a parameter " + 
  "supplied is not a 'Number'", () => {
    let str = "str";

    expect(() => new Vec3(str, 1, 2)).toThrowError(/Number/);
    expect(() => new Vec3(0, str, 2)).toThrowError(/Number/);
    expect(() => new Vec3(0, 1, str)).toThrowError(/Number/);
  });
});

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let vector = new Vec3();
    let vectorOther = new Vec3(10, 20, 30);

    vector.copy(vectorOther);
    
    expect(vector).toEqual(vectorOther);
    expect(vector).not.toBe(vectorOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Vec3'", () => {
    let vector = new Vec3();
    let vectorStr = "vectorStr";

    expect(() => vector.copy(vectorStr)).toThrowError(/Vec3/);
  });

  test("this.copy(other) should not modify 'other'", () => {
    let vector = new Vec3();
    let vectorOther = new Vec3(10, 20, 30);
    let expected = [10, 20, 30];

    vector.copy(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
  });


  test("this.getCopy() should return a 'Vec3'", () => {
    let vectorOther = new Vec3();
    let vector = vectorOther.getCopy();

    expect(vector).toBeInstanceOf(Vec3);
  });

  test("this.getCopy() should return a 'Vec3' which is a deep copy " +
  "of 'this'", () => {
    let vectorOther = new Vec3(10, 20, 30);
    let vector = vectorOther.getCopy();

    expect(vectorOther).toEqual(vector);
    expect(vectorOther).not.toBe(vector);
  });
});

describe("comparison", () => {
  test("this.equals(other, tolerance) should throw an error if " +
  "'other' is not a 'Vec3'", () => {
    let vector = new Vec3();
    let vectorStr = "vectorStr";

    expect(() => vector.equals(vectorStr, 0.1)).toThrowError(/Vec3/);
  });

  test("this.equals(other, tolerance) should throw an error if " +
  "'tolerance' is not a 'Number'", () => {
    let vector = new Vec3();
    let vectorOther = new Vec3();
    let toleranceStr = "toleranceStr";

    expect(() => vector.equals(vectorOther, toleranceStr)).
      toThrowError(/Number/);
  });

  test("this.equals(other, tolerance) should return a 'Boolean'", () => {
    let vector = new Vec3();
    let vectorOther = new Vec3();

    let result = vector.equals(vectorOther);

    expect(result).toBeTypeOf('boolean');
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "within the tolerance supplied", () => {
    let vector = new Vec3(10, 20, 30);
    let vectorOther = new Vec3(10.4, 19.6, 29.8);
    let expected = true;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the tolerance supplied", () => {
    let vector = new Vec3(10, 20, 30);
    let vectorOther = new Vec3(-10.4, 19.2, 29);
    let expected = false;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });
  
  test("this.equals(other, tolerance) returns correct result when " +
  "within the default tolerance", () => {
    let vector = new Vec3(10, 20, 30);
    let vectorOther = new Vec3(10, 20, 30);
    let expected = true;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the default tolerance", () => {
    let vector = new Vec3(10, 20, 30);
    let vectorOther = new Vec3(10.05, 19.95, 29);
    let expected = false;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });
});

describe("modification", () => {
  test("this.negate() should reverse the signs of x, y and z fields " +
  "in place", () => {
    let vector = new Vec3(10, -20, 30);
    let expected = [-10, 20, -30];

    vector.negate();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });


  test("this.getNegated() should return a 'Vec3'", () => {
    let vector = new Vec3();
    let vectorOther = vector.getNegated();

    expect(vectorOther).toBeInstanceOf(Vec3);
  });

  test("this.getNegated() should not modify 'this'", () => {
    let vector = new Vec3(10, -20, 30);
    let expected = [10, -20, 30];

    vector.getNegated();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  test("this.getNegated() should return a 'Vec3' with the signs " +
  "of x, y and z fields reversed", () => {
    let vector = new Vec3(10, -20, 30);
    let vectorOther = vector.getNegated();
    let expected = [-10, 20, -30];

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
  });


  test("this.normalize() should normalize the x, y and z fields " +
  "in place", () => {
    let vector = new Vec3(1, 1, 1);
    let expected = 0.577;

    vector.normalize();

    expect(vector.x).toBeCloseTo(expected, 3);
    expect(vector.y).toBeCloseTo(expected, 3);
    expect(vector.z).toBeCloseTo(expected, 3);
  });

  test("this.normalize() should handle a vector with a " +
  "0 length", () => {
    let vector = new Vec3(0, 0, 0);
    let expected = [0, 0, 0];

    vector.normalize();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  
  test("this.getNormalized() should return a 'Vec3'", () => {
    let vector = new Vec3();
    let vectorOther = vector.getNormalized();

    expect(vectorOther).toBeInstanceOf(Vec3);
  });

  test("this.getNormalized() should not modify 'this'", () => {
    let vector = new Vec3(1, 1, 1);
    let expected = [1, 1, 1];

    vector.getNormalized();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  test("this.getNormalized() should return a 'Vec3' with " +
  "x, y and z fields normalized", () => {
    let vector = new Vec3(1, 1, 1);
    let vectorOther = vector.getNormalized();
    let expected = 0.577;

    expect(vectorOther.x).toBeCloseTo(expected, 3);
    expect(vectorOther.y).toBeCloseTo(expected, 3);
    expect(vectorOther.z).toBeCloseTo(expected, 3);
  });
});

describe("transform", () => {
  test("this.getDot(other) should throw an error if 'other' is not " +
  "a 'Vec3'", () => {
    let vector = new Vec3();
    let vectorStr = "vectorStr";

    expect(() => vector.getDot(vectorStr)).toThrowError(/Vec3/);
  });

  test("this.getDot(other) should return a 'Number'", () => {
    let vector = new Vec3();
    let vectorOther = new Vec3();

    let result = vector.getDot(vectorOther);

    expect(result).toBeTypeOf('number');
  });

  test("this.getDot(other) should return a 'Number' which is " +
  "the dot product of both vectors", () => {
    let vector = new Vec3(1, 2, 3);
    let vectorOther = new Vec3(4, 5, 6);
    let expected = 32;

    let result = vector.getDot(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.getDot(other) should not modify 'this'", () => {
    let vector = new Vec3(1, 2, 3);
    let vectorOther = new Vec3(4, 5, 6);
    let expected = [1, 2, 3];

    vector.getDot(vectorOther);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  test("this.getDot(other) should not modify 'other'", () => {
    let vector = new Vec3(1, 2, 3);
    let vectorOther = new Vec3(4, 5, 6);
    let expected = [4, 5, 6];

    vector.getDot(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
    expect(vectorOther.z).toEqual(expected[2]);
  });


  test.todo("this.getCross(other)");
});

describe("conversion", () => {
  test("this.asArray() should return an 'Array'", () => {
    let vector = new Vec3();
    let vectorArr = vector.asArray();

    expect(vectorArr).toBeInstanceOf(Array);
  });
  
  test("this.asArray() should return an 'Array' containing the " +
  "value of x, y and z fields", () => {
    let vector = new Vec3(10, 20, 30);
    let vectorArr = vector.asArray();

    expect(vectorArr.length).toEqual(3);

    expect(vectorArr[0]).toEqual(vector.x);
    expect(vectorArr[1]).toEqual(vector.y);
    expect(vectorArr[2]).toEqual(vector.z);
  });


  test("this.fromArray(arr) should throw an error if 'arr' is not " +
  "an 'Array'", () => {
    let vector = new Vec3();
    let arrayStr = "arrayStr";

    expect(() => vector.fromArray(arrayStr)).toThrowError(/Array/);
  });

  test("this.fromArray(arr) should throw an error if 'arr[i]' is not " +
  "a 'Number'", () => {
    let vector = new Vec3();
    let array = ["str", "str", "str"];

    expect(() => vector.fromArray(array)).toThrowError(/Number/);
  });

  test("this.fromArray([x, y, z, ...]) should assign x, y and z fields " +
  "using the first 3 parameters supplied", () => {
    let vector = new Vec3();
    let expected = [10, 20, 30];

    vector.fromArray([10, 20, 30, 40]);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
    expect(vector.z).toEqual(expected[2]);
  });

  test("this.fromArray([x]) should pad the input using the parameter " +
  "supplied", () => {
    let vector = new Vec3();
    let expected = 10;

    vector.fromArray([10]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
  });

  test("this.fromArray([]) should assign a default value of 0 to " +
  "x, y and z fields", () => {
    let vector = new Vec3();
    let expected = 0;

    vector.fromArray([]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
    expect(vector.z).toEqual(expected);
  });
});
