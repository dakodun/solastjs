import { describe, test, expect } from 'vitest';

import Vec2 from '../../src/vec2.js';

describe("construction", () => {
  test("new Vec2(x, y, ...)", () => {
    // assign x and y; ignore extra
      // => new Vec2(1, 2)
    let vector = new Vec2(1, 2, 3);

    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(2);
  });

  test("new Vec2(x)", () => {
    // assign x and y; pad input
      // => new Vec2(1, 1)
    let vector = new Vec2(1);

    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(1);
  });

  test("new Vec2()", () => {
    // assign x and y; default value
      // => new Vec2(0, 0, 0)
    let vector = new Vec2();

    expect(vector.x).toEqual(0);
    expect(vector.y).toEqual(0);
  });
});


describe("getters/setters", () => {
  describe("this.x and this.y", () => {
    test("x = this.x, ...", () => {
      // return x or y
      let vector = new Vec2(1, 2);

      let x = vector.x;
        expect(x).toEqual(vector.x);
      let y = vector.y;
        expect(y).toEqual(vector.y);
    });

    test("this.x = 'string', ...", () => {
      // throw an error
      let vector = new Vec2();

      expect(() => vector.x = "1").toThrowError(/Number/);
      expect(() => vector.y = "2").toThrowError(/Number/);
    });

    test("this.x = 1, ...", () => {
      // assign x or y
      let vector = new Vec2();

      vector.x = 1;
        expect(vector.x).toEqual(1);
      vector.y = 2;
        expect(vector.y).toEqual(2);
    });
  });

  describe("this.xy", () => {
    test("this.xy = 'string'", () => {
      // throw an error
      let vector = new Vec2();
      let arrStr = "string";

      expect(() => vector.xy  = arrStr).toThrowError(/Array/);
    });

    test("this.xy = [x, y, ...]", () => {
      // assign x and y; ignore extra
        // => new this.xy = [1, 2]
      let vector = new Vec2();
      vector.xy = [1, 2, 3];
        expect(vector.x).toEqual(1);
        expect(vector.y).toEqual(2);
    });

    test("this.xy = [x], ...", () => {
      // assign x and y; pad input
        // => new this.xy = [4, 4]
      let vector = new Vec2();
      vector.xy = [4];
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4);
    });
  });
});


describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let vector = new Vec2();
    let vectorOther = new Vec2(10, 20);

    vector.copy(vectorOther);
    
    expect(vector).toEqual(vectorOther);
    expect(vector).not.toBe(vectorOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Vec2'", () => {
    let vector = new Vec2();
    let vectorStr = "vectorStr";

    expect(() => vector.copy(vectorStr)).toThrowError(/Vec2/);
  });

  test("this.copy(other) should not modify 'other'", () => {
    let vector = new Vec2();
    let vectorOther = new Vec2(10, 20);
    let expected = [10, 20];

    vector.copy(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
  });


  test("this.getCopy() should return a 'Vec2'", () => {
    let vectorOther = new Vec2();
    let vector = vectorOther.getCopy();

    expect(vector).toBeInstanceOf(Vec2);
  });

  test("this.getCopy() should return a 'Vec2' which is a deep copy " +
  "of 'this'", () => {
    let vectorOther = new Vec2(10, 20);
    let vector = vectorOther.getCopy();

    expect(vectorOther).toEqual(vector);
    expect(vectorOther).not.toBe(vector);
  });
});

describe("comparison", () => {
  test("this.equals(other, tolerance) should throw an error if " +
  "'other' is not a 'Vec2'", () => {
    let vector = new Vec2();
    let vectorStr = "vectorStr";

    expect(() => vector.equals(vectorStr, 0.1)).toThrowError(/Vec2/);
  });

  test("this.equals(other, tolerance) should throw an error if " +
  "'tolerance' is not a 'Number'", () => {
    let vector = new Vec2();
    let vectorOther = new Vec2();
    let toleranceStr = "toleranceStr";

    expect(() => vector.equals(vectorOther, toleranceStr)).
      toThrowError(/Number/);
  });

  test("this.equals(other, tolerance) should return a 'Boolean'", () => {
    let vector = new Vec2();
    let vectorOther = new Vec2();

    let result = vector.equals(vectorOther);

    expect(result).toBeTypeOf('boolean');
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "within the tolerance supplied", () => {
    let vector = new Vec2(10, 20);
    let vectorOther = new Vec2(10.4, 19.6);
    let expected = true;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the tolerance supplied", () => {
    let vector = new Vec2(10, 20);
    let vectorOther = new Vec2(-10.4, 19.2);
    let expected = false;

    let result = vector.equals(vectorOther, 0.5);

    expect(result).toEqual(expected);
  });
  
  test("this.equals(other, tolerance) returns correct result when " +
  "within the default tolerance", () => {
    let vector = new Vec2(10, 20);
    let vectorOther = new Vec2(10, 20);
    let expected = true;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.equals(other, tolerance) returns correct result when " +
  "outwith the default tolerance", () => {
    let vector = new Vec2(10, 20);
    let vectorOther = new Vec2(10.05, 19.95);
    let expected = false;

    let result = vector.equals(vectorOther);

    expect(result).toEqual(expected);
  });
});

describe("modification", () => {
  test("this.negate() should reverse the signs of x and y fields " +
  "in place", () => {
    let vector = new Vec2(10, -20);
    let expected = [-10, 20];

    vector.negate();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });


  test("this.getNegated() should return a 'Vec2'", () => {
    let vector = new Vec2();
    let vectorOther = vector.getNegated();

    expect(vectorOther).toBeInstanceOf(Vec2);
  });

  test("this.getNegated() should not modify 'this'", () => {
    let vector = new Vec2(10, -20);
    let expected = [10, -20];

    vector.getNegated();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });

  test("this.getNegated() should return a 'Vec2' with the signs " +
  "of x and y fields reversed", () => {
    let vector = new Vec2(10, -20);
    let vectorOther = vector.getNegated();
    let expected = [-10, 20];

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
  });


  test("this.normalize() should normalize the x and y fields " +
  "in place", () => {
    let vector = new Vec2(1, 1);
    let expected = 0.707;

    vector.normalize();

    expect(vector.x).toBeCloseTo(expected, 3);
    expect(vector.y).toBeCloseTo(expected, 3);
  });

  test("this.normalize() should handle a vector with a " +
  "0 length", () => {
    let vector = new Vec2(0, 0);
    let expected = [0, 0];

    vector.normalize();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });

  
  test("this.getNormalized() should return a 'Vec2'", () => {
    let vector = new Vec2();
    let vectorOther = vector.getNormalized();

    expect(vectorOther).toBeInstanceOf(Vec2);
  });

  test("this.getNormalized() should not modify 'this'", () => {
    let vector = new Vec2(1, 1);
    let expected = [1, 1];

    vector.getNormalized();

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });

  test("this.getNormalized() should return a 'Vec2' with " +
  "x and y fields normalized", () => {
    let vector = new Vec2(1, 1);
    let vectorOther = vector.getNormalized();
    let expected = 0.707;

    expect(vectorOther.x).toBeCloseTo(expected, 3);
    expect(vectorOther.y).toBeCloseTo(expected, 3);
  });
});

describe("transform", () => {
  test("this.getDot(other) should throw an error if 'other' is not " +
  "a 'Vec2'", () => {
    let vector = new Vec2();
    let vectorStr = "vectorStr";

    expect(() => vector.getDot(vectorStr)).toThrowError(/Vec2/);
  });

  test("this.getDot(other) should return a 'Number'", () => {
    let vector = new Vec2();
    let vectorOther = new Vec2();

    let result = vector.getDot(vectorOther);

    expect(result).toBeTypeOf('number');
  });

  test("this.getDot(other) should return a 'Number' which is " +
  "the dot product of both vectors", () => {
    let vector = new Vec2(1, 2);
    let vectorOther = new Vec2(3, 4);
    let expected = 11;

    let result = vector.getDot(vectorOther);

    expect(result).toEqual(expected);
  });

  test("this.getDot(other) should not modify 'this'", () => {
    let vector = new Vec2(1, 1);
    let vectorOther = new Vec2(2, 2);
    let expected = [1, 1];

    vector.getDot(vectorOther);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });

  test("this.getDot(other) should not modify 'other'", () => {
    let vector = new Vec2(1, 1);
    let vectorOther = new Vec2(2, 2);
    let expected = [2, 2];

    vector.getDot(vectorOther);

    expect(vectorOther.x).toEqual(expected[0]);
    expect(vectorOther.y).toEqual(expected[1]);
  });


  test.todo("this.getDeterminant(other)");
});

describe("conversion", () => {
  test("this.asArray() should return an 'Array'", () => {
    let vector = new Vec2();
    let vectorArr = vector.asArray();

    expect(vectorArr).toBeInstanceOf(Array);
  });
  
  test("this.asArray() should return an 'Array' containing the " +
  "value of x and y fields", () => {
    let vector = new Vec2(10, 20);
    let vectorArr = vector.asArray();

    expect(vectorArr.length).toEqual(2);

    expect(vectorArr[0]).toEqual(vector.x);
    expect(vectorArr[1]).toEqual(vector.y);
  });


  test("this.fromArray(arr) should throw an error if 'arr' is not " +
  "an 'Array'", () => {
    let vector = new Vec2();
    let arrayStr = "arrayStr";

    expect(() => vector.fromArray(arrayStr)).toThrowError(/Array/);
  });

  test("this.fromArray(arr) should throw an error if 'arr[i]' is not " +
  "a 'Number'", () => {
    let vector = new Vec2();
    let array = ["str", "str"];

    expect(() => vector.fromArray(array)).toThrowError(/Number/);
  });

  test("this.fromArray([x, y, ...]) should assign x and y fields " +
  "using the first 2 parameters supplied", () => {
    let vector = new Vec2();
    let expected = [10, 20];

    vector.fromArray([10, 20, 30]);

    expect(vector.x).toEqual(expected[0]);
    expect(vector.y).toEqual(expected[1]);
  });

  test("this.fromArray([x]) should pad the input using the parameter " +
  "supplied", () => {
    let vector = new Vec2();
    let expected = 10;

    vector.fromArray([10]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
  });

  test("this.fromArray([]) should assign a default value of 0 to " +
  "x and y fields", () => {
    let vector = new Vec2();
    let expected = 0;

    vector.fromArray([]);

    expect(vector.x).toEqual(expected);
    expect(vector.y).toEqual(expected);
  });
});
