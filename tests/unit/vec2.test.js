import { describe, test, expect } from 'vitest';

import Vec2 from '../../src/vec2.js';

//> Vec2 //
describe("Vec2", () => {
  //> constructor //
  describe("constructor", () => {
    test("defaults to 0 when no arguments passed", () => {
      let vec = new Vec2();

      let expected = { x: 0, y: 0 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("pads the input with the last supplied argument", () => {
      let vec = new Vec2(1);

      let expected = { x: 1, y: 1 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("assigns arguments in order", () => {
      let vec = new Vec2(1, 2);

      let expected = { x: 1, y: 2 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("throws an error on type mismatch", () => {
      expect(() => { let vec = new Vec2("str", 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec2(1, "str"); })
        .toThrowError(/Number/);
    });
  });
  
  //> x //
  describe("x", () => {
    describe("get", () => {
      test("returns the value of x", () => {
        let vec = new Vec2();
          vec._x = 1;
        
        let x = vec.x;

        expect(x).toEqual(vec._x);
      });
    });

    describe("set", () => {
      test("sets the value of x and resets size/sizesq", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          x: 3,
          size: null,
          sizeSq: null
        }

        vec.x = 3;

        expect(vec._x).toEqual(expected.x);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("does nothing if x is unchanged", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          x: 1,
          size: 2,
          sizeSq: 3
        }

        vec.x = 1;

        expect(vec._x).toEqual(expected.x);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec2();
        
        expect(() => { vec.x = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> y //
  describe("y", () => {
    describe("get", () => {
      test("returns the value of y", () => {
        let vec = new Vec2();
          vec._y = 2;
        
        let y = vec.y;

        expect(y).toEqual(vec._y);
      });
    });

    describe("set", () => {
      test("sets the value of y and resets size/sizesq", () => {
        let vec = new Vec2();
          vec._y = 2;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          y: 4,
          size: null,
          sizeSq: null
        }

        vec.y = 4;

        expect(vec._y).toEqual(expected.y);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("does nothing if y is unchanged", () => {
        let vec = new Vec2();
          vec._y = 2;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          y: 2,
          size: 2,
          sizeSq: 3
        }

        vec.y = 2;

        expect(vec._y).toEqual(expected.y);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec2();
        
        expect(() => { vec.y = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> size //
  describe("size", () => {
    describe("get", () => {
      test("calculates and returns the value of size (also " +
      "calculates sizeSq)", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: 2.236,
          sizeSq: 5
        }

        let size = vec.size;

        expect(size).toBeCloseTo(expected.size, 3);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("returns size if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
          vec._size = 10;

        let size = vec.size;

        expect(size).toEqual(10);
      });
    });
  });

  //> sizeSq //
  describe("sizeSq", () => {
    describe("get", () => {
      test("calculates and returns the value of sizesq (only)", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: null,
          sizeSq: 5
        }

        let sizeSq = vec.sizeSq;

        expect(vec._size).toEqual(expected.size);
        expect(sizeSq).toEqual(expected.sizeSq);
      });

      test("returns sizesq if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
          vec._sizeSq = 10;

        let sizeSq = vec.sizeSq;

        expect(sizeSq).toEqual(10);
      });
    });
  });

  //> xy //
  describe("xy", () => {
    describe("set", () => {
      test("sets the value of x and y", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 3, y: 4 }

        vec.xy = [3, 4];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("sets the value of x and y if there is only one " +
      "value provided", () => {
        let vec = new Vec2();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 3, y: 3 }

        vec.xy = [3];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec2();
        
        expect(() => { vec.xy = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("copies all properties from other to this", () => {
      let vec = new Vec2();
        vec._x = 0;
        vec._y = 0;
        vec._size = null;
        vec._sizeSq = null;

      let other = new Vec2();
        other._x = 1;
        other._y = 2;
        other._size = 3;
        other._sizeSq = 4;
      
      vec.copy(other);

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });

    test("throws an error if other is not a Vec2", () => {
      let vec = new Vec2();

      expect(() => { vec.copy("string"); }).toThrowError(/Vec2/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new Vec2();
        other._x = 1;
        other._y = 2;
        other._size = 3;
        other._sizeSq = 4;
      
      let vec = other.getCopy();

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });
  });

  //> equals(other, tolerance) //
  describe("equals()", () => {
    let compare = (modFunc, expected, tolerance = 0) => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;
      let other = new Vec2();
        other._x = 1;
        other._y = 2;

      expect(vec.equals(other)).toEqual(true);
      modFunc(other);
      expect(vec.equals(other, tolerance)).toEqual(expected);
    }

    test("returns true if all components match", () => {
      compare(() => { }, true);
    });

    test("returns true even if size/sizeSq don't match", () => {
      compare((other) => {
        other._size = 1;
        other._sizeSq = 2;
      }, true);
    });

    test("returns false on a mismatch", () => {
      compare((other) => { other._x = 0; }, false);
      compare((other) => { other._y = 0; }, false);
    });

    test("returns true if within custom tolerance value", () => {
      compare((other) => { other._x = 0.95; }, true, 0.1);
    });
  });

  //> negate() //
  describe("negate()", () => {
    test("negates vector", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = -3;

      let expected = { x: -2, y: 3 }

      vec.negate();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });
  });

  //> getNegated() //
  describe("getNegated()", () => {
    test("returns a negated vector", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = -3;

      let expected = { x: -2, y: 3 }

      let result = vec.getNegated();

      expect(result._x).toEqual(expected.x);
      expect(result._y).toEqual(expected.y);
    });
  });

  //> normalize() //
  describe("normalize()", () => {
    test("normalises vector (and sets size/sizesq)", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = 3;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.555,
        y: 0.832,
        size: 1,
        sizeSq: 1
      }

      vec.normalize();

      expect(vec._x).toBeCloseTo(expected.x, 3);
      expect(vec._y).toBeCloseTo(expected.y, 3);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });

    test("does nothing if vec is a zero vector (but does store " +
    "size/sizesq)", () => {
      let vec = new Vec2();
        vec._x = 0;
        vec._y = 0;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0,
        y: 0,
        size: 0,
        sizeSq: 0
      }

      vec.normalize();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getNormalized() //
  describe("getNormalized()", () => {
    test("returns a normalised vector (and sets size/sizesq)", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = 3;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.555,
        y: 0.832,
        size: 1,
        sizeSq: 1
      }

      let result = vec.getNormalized();

      expect(result._x).toBeCloseTo(expected.x, 3);
      expect(result._y).toBeCloseTo(expected.y, 3);
      expect(result._size).toEqual(expected.size);
      expect(result._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getDot(other) //
  describe("getDot()", () => {
    test("returns the dot product of both vectors", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = 3;
      let other = new Vec2();
        other._x = 4;
        other._y = 5;

      let result = vec.getDot(other);

      expect(result).toEqual(23);
    });

    test("throws an error if other is not a vec2", () => {
      let vec = new Vec2();

      expect(() => { vec.getDot("string"); })
        .toThrowError(/Vec2/);
    });
  });

  //> getDeterminant(other) //
  describe("getDeterminant()", () => {
    test("returns the determinant of both vectors", () => {
      let vec = new Vec2();
        vec._x = 2;
        vec._y = 3;
      let other = new Vec2();
        other._x = 4;
        other._y = 5;

      let result = vec.getDeterminant(other);

      expect(result).toEqual(-2);
    });

    test("throws an error if other is not a vec2", () => {
      let vec = new Vec2();

      expect(() => { vec.getDeterminant("string"); })
        .toThrowError(/Vec2/);
    });
  });

  //> asArray() //
  describe("asArray()", () => {
    test("returns an array containing the components of the " +
    "vector", () => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;
      
      let expected = { arr: [1, 2] }
      
      let arr = vec.asArray();

      expect(arr[0]).toEqual(expected.arr[0]);
      expect(arr[1]).toEqual(expected.arr[1]);
    });
  });

  //> fromArray(arr) //
  describe("fromArray()", () => {
    test("assigns values to components in order", () => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;

      let expected = { x: 3, y: 4 }
      
      vec.fromArray([3, 4]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("assigns the last value if arr does not contain enough " +
    "values", () => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;

      let expected = { x: 3, y: 3 }
      
      vec.fromArray([3]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("assigns a value of 0 if arr is empty", () => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;

      let expected = { x: 0, y: 0 }
      
      vec.fromArray([]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
    });

    test("throws an error if arr is not an array", () => {
      let vec = new Vec2();

      expect(() => { vec.fromArray("string"); }).toThrowError(/Array/);
    });

    test("throws an error if contents of arr are not numbers", () => {
      let vec = new Vec2();

      expect(() => { vec.fromArray(["string"]); }).toThrowError(/Number/);
    });

    test("does nothing if components are unchanged", () => {
      let vec = new Vec2();
        vec._x = 1;
        vec._y = 2;
        vec._size = 3;
        vec._sizeSq = 4;

      let expected = {
        x: 1,
        y: 2,
        size: 3,
        sizeSq: 4
      }
      
      vec.fromArray([1, 2]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });
});
