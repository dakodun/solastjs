import { describe, test, expect } from 'vitest';

import Vec4 from '../../src/vec4.js';

describe("construction", () => {
  test("new Vec4(x, y, z, w, ...)", () => {
    // assign x, y, z, and w; ignore extra
      // => new Vec4(1, 2, 3, 4)
    let vector = new Vec4(1, 2, 3, 4, 5);

    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(2);
    expect(vector.z).toEqual(3);
    expect(vector.w).toEqual(4);
  });

  test("new Vec4(x)", () => {
    // assign x, y, z, and w; pad input
      // => new Vec4(1, 1, 1, 1)
    let vector = new Vec4(1);

    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(1);
    expect(vector.z).toEqual(1);
    expect(vector.w).toEqual(1);
  });

  test("new Vec4()", () => {
    // assign x, y, z and w; default value
      // => new Vec4(0, 0, 0, 0)
    let vector = new Vec4();

    expect(vector.x).toEqual(0);
    expect(vector.y).toEqual(0);
    expect(vector.z).toEqual(0);
    expect(vector.w).toEqual(0);
  });
});


describe("getters/setters", () => {
  describe("this.x, this.y, this.z, and this.w", () => {
    test("x = this.x, ...", () => {
      // return x, y, z, or w
      let vector = new Vec4(1, 2, 3, 4);

      let x = vector.x;
        expect(x).toEqual(vector.x);
      let y = vector.y;
        expect(y).toEqual(vector.y);
      let z = vector.z;
        expect(z).toEqual(vector.z);
      let w = vector.w;
        expect(w).toEqual(vector.w);
    });

    test("this.x = 'string', ...", () => {
      // throw an error
      let vector = new Vec4();

      expect(() => vector.x = "1").toThrowError(/Number/);
      expect(() => vector.y = "2").toThrowError(/Number/);
      expect(() => vector.z = "3").toThrowError(/Number/);
      expect(() => vector.w = "4").toThrowError(/Number/);
    });

    test("this.x = 1, ...", () => {
      // assign x, y, z, or w
      let vector = new Vec4();

      vector.x = 1;
        expect(vector.x).toEqual(1);
      vector.y = 2;
        expect(vector.y).toEqual(2);
      vector.z = 3;
        expect(vector.z).toEqual(3);
      vector.w = 4;
        expect(vector.w).toEqual(4);
    });
  });

  describe("this.xy, this.xz, this.xw, this.yz, this.yw and " +
  "this.zw", () => {
    test("this.xy = 'string', ...", () => {
      // throw an error
      let vector = new Vec4();
      let arrStr = "string";

      expect(() => vector.xy  = arrStr).toThrowError(/Array/);
      expect(() => vector.xz  = arrStr).toThrowError(/Array/);
      expect(() => vector.xw  = arrStr).toThrowError(/Array/);
      expect(() => vector.yz  = arrStr).toThrowError(/Array/);
      expect(() => vector.yw  = arrStr).toThrowError(/Array/);
      expect(() => vector.zw  = arrStr).toThrowError(/Array/);
    });

    test("this.xy = [x, y, ...], ...", () => {
      // assign x, y, z, or w; ignore extra
        // => new this.xy = [1, 2]
      let vector = new Vec4();
      vector.xy = [1, 2, 3];
        expect(vector.x).toEqual(1);
        expect(vector.y).toEqual(2);

      vector = new Vec4();
      vector.xz = [1, 2, 3];
        expect(vector.x).toEqual(1);
        expect(vector.z).toEqual(2);
      
      vector = new Vec4();
      vector.xw = [1, 2, 3];
        expect(vector.x).toEqual(1);
        expect(vector.w).toEqual(2);

      vector = new Vec4();
      vector.yz = [1, 2, 3];
        expect(vector.y).toEqual(1);
        expect(vector.z).toEqual(2);

      vector = new Vec4();
      vector.yw = [1, 2, 3];
        expect(vector.y).toEqual(1);
        expect(vector.w).toEqual(2);

      vector = new Vec4();
      vector.zw = [1, 2, 3];
        expect(vector.z).toEqual(1);
        expect(vector.w).toEqual(2);
    });

    test("this.xy = [x], ...", () => {
      // assign x, y, z, or w; pad input
        // => new this.xy = [4, 4]
      let vector = new Vec4();
      vector.xy = [4];
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4);

      vector = new Vec4();
      vector.xz = [4];
        expect(vector.x).toEqual(4);
        expect(vector.z).toEqual(4);

      vector = new Vec4();
      vector.xw = [4];
        expect(vector.x).toEqual(4);
        expect(vector.w).toEqual(4);
      
      vector = new Vec4();
      vector.yz = [4];
        expect(vector.y).toEqual(4);
        expect(vector.z).toEqual(4);
      
      vector = new Vec4();
      vector.yw = [4];
        expect(vector.y).toEqual(4);
        expect(vector.w).toEqual(4);
      
      vector = new Vec4();
      vector.zw = [4];
        expect(vector.z).toEqual(4);
        expect(vector.w).toEqual(4);
    });
  });

  describe("this.xyz, this.xyw, this.xzw, and this.yzw", () => {
    test("this.xyz = 'string', ...", () => {
      // throw an error
      let vector = new Vec4();
      let arrStr = "string";

      expect(() => vector.xyz  = arrStr).toThrowError(/Array/);
      expect(() => vector.xyw  = arrStr).toThrowError(/Array/);
      expect(() => vector.xzw  = arrStr).toThrowError(/Array/);
      expect(() => vector.yzw  = arrStr).toThrowError(/Array/);
    });

    test("this.xyz = [x, y, z, ...], ...", () => {
      // assign x, y, z, or w; ignore extra
        // => new this.xyz = [1, 2, 3]
      let vector = new Vec4();
      vector.xyz = [1, 2, 3, 4];
        expect(vector.x).toEqual(1);
        expect(vector.y).toEqual(2);
        expect(vector.z).toEqual(3);
      
      vector = new Vec4();
      vector.xyw = [1, 2, 3, 4];
        expect(vector.x).toEqual(1);
        expect(vector.y).toEqual(2);
        expect(vector.w).toEqual(3);
      
      vector = new Vec4();
      vector.xzw = [1, 2, 3, 4];
        expect(vector.x).toEqual(1);
        expect(vector.z).toEqual(2);
        expect(vector.w).toEqual(3);
      
      vector = new Vec4();
      vector.yzw = [1, 2, 3, 4];
        expect(vector.y).toEqual(1);
        expect(vector.z).toEqual(2);
        expect(vector.w).toEqual(3);
    });

    test("this.xyz = [x]", () => {
      // assign x, y, z, or w; pad input
        // => new this.xyz = [4, 4, 4]
      let vector = new Vec4();
      vector.xyz = [4];
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4);
        expect(vector.z).toEqual(4);
      
      vector = new Vec4();
      vector.xyw = [4];
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4);
        expect(vector.w).toEqual(4);
      
      vector = new Vec4();
      vector.xzw = [4];
        expect(vector.x).toEqual(4);
        expect(vector.z).toEqual(4);
        expect(vector.w).toEqual(4);
      
      vector = new Vec4();
      vector.yzw = [4];
        expect(vector.y).toEqual(4);
        expect(vector.z).toEqual(4);
        expect(vector.w).toEqual(4);
    });
  });

  describe("this.xyzw", () => {
    test("this.xyzw = 'string'", () => {
      // throw an error
      let vector = new Vec4();
      let arrStr = "string";

      expect(() => vector.xyzw  = arrStr).toThrowError(/Array/);
    });

    test("this.xyzw = [x, y, z, w, ...]", () => {
      // assign x, y, z, and w; ignore extra
        // => new this.xyzw = [1, 2, 3, 4]
      let vector = new Vec4();
      vector.xyzw = [1, 2, 3, 4, 5];
        expect(vector.x).toEqual(1);
        expect(vector.y).toEqual(2);
        expect(vector.z).toEqual(3);
        expect(vector.w).toEqual(4);
    });

    test("this.xyzw = [x]", () => {
      // assign x, y, z, and w; pad input
        // => new this.xyzw = [4, 4, 4, 4]
      let vector = new Vec4();
      vector.xyzw = [4];
        expect(vector.x).toEqual(4);
        expect(vector.y).toEqual(4);
        expect(vector.z).toEqual(4);
        expect(vector.w).toEqual(4);
    });
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
