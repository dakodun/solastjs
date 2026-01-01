import { describe, test, expect } from 'vitest';

import Vec3 from '../../src/vec3.js';

import Vec2 from '../../src/vec2.js';

//> Vec3 //
describe("Vec3", () => {
  //> constructor //
  describe("constructor", () => {
    test("defaults to 0 when no arguments passed", () => {
      let vec = new Vec3();

      let expected = { x: 0, y: 0, z: 0 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
    });

    describe("pads the input with the last supplied argument", () => {
      test("(x)", () => {
        let vec = new Vec3(1);
        
        let expected = { x: 1, y: 1, z: 1 }

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("(x, y)", () => {
        let vec = new Vec3(1, 2);
        
        let expected = { x: 1, y: 2, z: 2 }

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });
    });

    test("assigns arguments in order", () => {
      let vec = new Vec3(1, 2, 3);

      let expected = { x: 1, y: 2, z: 3 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
    });

    test("throws an error on type mismatch", () => {
      expect(() => { let vec = new Vec3("str", 1, 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec3(1, "str", 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec3(1, 1, "str"); })
        .toThrowError(/Number/);
    });
  });

  //> x //
  describe("x", () => {
    describe("get", () => {
      test("returns the value of x", () => {
        let vec = new Vec3();
          vec._x = 1;
        
        let x = vec.x;

        expect(x).toEqual(vec._x);
      });
    });

    describe("set", () => {
      test("sets the value of x and resets size/sizesq", () => {
        let vec = new Vec3();
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
        let vec = new Vec3();
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
        let vec = new Vec3();
        
        expect(() => { vec.x = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> y //
  describe("y", () => {
    describe("get", () => {
      test("returns the value of y", () => {
        let vec = new Vec3();
          vec._y = 2;
        
        let y = vec.y;

        expect(y).toEqual(vec._y);
      });
    });

    describe("set", () => {
      test("sets the value of y and resets size/sizesq", () => {
        let vec = new Vec3();
          vec._y = 2;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          y: 3,
          size: null,
          sizeSq: null
        }

        vec.y = 3;

        expect(vec._y).toEqual(expected.y);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("does nothing if y is unchanged", () => {
        let vec = new Vec3();
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
        let vec = new Vec3();
        
        expect(() => { vec.y = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> z //
  describe("z", () => {
    describe("get", () => {
      test("returns the value of z", () => {
        let vec = new Vec3();
          vec._z = 3;
        
        let z = vec.z;

        expect(z).toEqual(vec._z);
      });
    });

    describe("set", () => {
      test("sets the value of z and resets size/sizesq", () => {
        let vec = new Vec3();
          vec._z = 3;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          z: 1,
          size: null,
          sizeSq: null
        }

        vec.z = 1;

        expect(vec._z).toEqual(expected.z);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("does nothing if z is unchanged", () => {
        let vec = new Vec3();
          vec._z = 3;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          z: 3,
          size: 2,
          sizeSq: 3
        }

        vec.z = 3;

        expect(vec._z).toEqual(expected.z);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec3();
        
        expect(() => { vec.z = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> size //
  describe("size", () => {
    describe("get", () => {
      test("calculates and returns the value of size (also " +
      "calculates sizeSq)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: 3.742,
          sizeSq: 14
        }

        let size = vec.size;

        expect(size).toBeCloseTo(expected.size, 3);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("returns size if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
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
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: null,
          sizeSq: 14
        }

        let sizeSq = vec.sizeSq;

        expect(vec._size).toEqual(expected.size);
        expect(sizeSq).toEqual(expected.sizeSq);
      });

      test("returns sizesq if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._sizeSq = 10;

        let sizeSq = vec.sizeSq;

        expect(sizeSq).toEqual(10);
      });
    });
  });

  //> xy //
  describe("xy", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (x, y)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
        
        let vec2 = vec.xy;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._x);
        expect(vec2._y).toEqual(vec._y);
      });
    });

    describe("set", () => {
      test("sets the value of x and y", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 4, y: 5 }

        vec.xy = [4, 5];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("sets the value of x and y if there is only one " +
      "value provided", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 4, y: 4 }

        vec.xy = [4];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec3();
        
        expect(() => { vec.xy = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xz //
  describe("xz", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (x, z)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._z = 3;
        
        let vec2 = vec.xz;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._x);
        expect(vec2._y).toEqual(vec._z);
      });
    });

    describe("set", () => {
      test("sets the value of x and z", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._z = 3;
        
        let expected = { x: 4, z: 5 }

        vec.xz = [4, 5];

        expect(vec._x).toEqual(expected.x);
        expect(vec._z).toEqual(expected.z);
      });

      test("sets the value of x and z if there is only one " +
      "value provided", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._z = 3;
        
        let expected = { x: 4, z: 4 }

        vec.xz = [4];

        expect(vec._x).toEqual(expected.x);
        expect(vec._z).toEqual(expected.z);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec3();
        
        expect(() => { vec.xz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> yz //
  describe("yz", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (y, z)", () => {
        let vec = new Vec3();
          vec._y = 2;
          vec._z = 3;
        
        let vec2 = vec.yz;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._y);
        expect(vec2._y).toEqual(vec._z);
      });
    });

    describe("set", () => {
      test("sets the value of y and z", () => {
        let vec = new Vec3();
          vec._y = 2;
          vec._z = 3;
        
        let expected = { y: 4, z: 5 }

        vec.yz = [4, 5];

        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("sets the value of y and z if there is only one " +
      "value provided", () => {
        let vec = new Vec3();
          vec._y = 2;
          vec._z = 3;
        
        let expected = { y: 4, z: 4 }

        vec.yz = [4];

        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec3();
        
        expect(() => { vec.yz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xyz //
  describe("xyz", () => {
    describe("get", () => {
      test("returns a Vec3 comprised of (x, y, z)", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
        
        let vec3 = vec.xyz;
        
        expect(vec3 instanceof Vec3).toEqual(true);
        expect(vec3._x).toEqual(vec._x);
        expect(vec3._y).toEqual(vec._y);
        expect(vec3._z).toEqual(vec._z);
      });
    });

    describe("set", () => {
      test("sets the value of x, y and z", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
        
        let expected = { x: 4, y: 5, z: 6 }

        vec.xyz = [4, 5, 6];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      describe("sets the value of x, y and z if there are not " +
      "enough values provided", () => {
        test("[x]", () => {
          let vec = new Vec3();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
          
          let expected = { x: 4, y: 4, z: 4 }

          vec.xyz = [4];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
        });

        test("[x, y]", () => {
          let vec = new Vec3();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
          
          let expected = { x: 4, y: 5, z: 5 }

          vec.xyz = [4, 5];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec3();
        
        expect(() => { vec.xyz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("copies all properties from other to this", () => {
      let vec = new Vec3();
        vec._x = 0;
        vec._y = 0;
        vec._z = 0;
        vec._size = null;
        vec._sizeSq = null;

      let other = new Vec3();
        other._x = 1;
        other._y = 2;
        other._z = 3;
        other._size = 4;
        other._sizeSq = 5;
      
      vec.copy(other);

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._z).toEqual(other._z);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });

    test("throws an error if other is not a vec3", () => {
      let vec = new Vec3();

      expect(() => { vec.copy("string"); }).toThrowError(/Vec3/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new Vec3();
        other._x = 1;
        other._y = 2;
        other._z = 3;
        other._size = 4;
        other._sizeSq = 5;
      
      let vec = other.getCopy();

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._z).toEqual(other._z);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });
  });

  //> equals(other, tolerance) //
  describe("equals()", () => {
    let compare = (modFunc, expected, tolerance = 0) => {
      let vec = new Vec3();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
      let other = new Vec3();
        other._x = 1;
        other._y = 2;
        other._z = 3;

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
      compare((other) => { other._z = 0; }, false);
    });

    test("returns true if within custom tolerance value", () => {
      compare((other) => { other._x = 0.95; }, true, 0.1);
    });
  });

  //> negate() //
  describe("negate()", () => {
    test("negates vector", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = -3;
        vec._z = 4;

      let expected = { x: -2, y: 3, z: -4 }

      vec.negate();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
    });
  });

  //> getNegated() //
  describe("getNegated()", () => {
    test("returns a negated vector", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = -3;
        vec._z = 4;

      let expected = { x: -2, y: 3, z: -4 }

      let result = vec.getNegated();

      expect(result._x).toEqual(expected.x);
      expect(result._y).toEqual(expected.y);
      expect(result._z).toEqual(expected.z);
    });
  });

  //> normalize() //
  describe("normalize()", () => {
    test("normalises vector (and sets size/sizesq)", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.371,
        y: 0.557,
        z: 0.743,
        size: 1,
        sizeSq: 1
      }

      vec.normalize();

      expect(vec._x).toBeCloseTo(expected.x, 3);
      expect(vec._y).toBeCloseTo(expected.y, 3);
      expect(vec._z).toBeCloseTo(expected.z, 3);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });

    test("does nothing if vec is a zero vector (but does store " +
    "size/sizesq)", () => {
      let vec = new Vec3();
        vec._x = 0;
        vec._y = 0;
        vec._z = 0;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0,
        y: 0,
        z: 0,
        size: 0,
        sizeSq: 0
      }

      vec.normalize();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getNormalized() //
  describe("getNormalized()", () => {
    test("returns a normalised vector (and sets size/sizesq)", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.371,
        y: 0.557,
        z: 0.743,
        size: 1,
        sizeSq: 1
      }

      let result = vec.getNormalized();

      expect(result._x).toBeCloseTo(expected.x, 3);
      expect(result._y).toBeCloseTo(expected.y, 3);
      expect(result._z).toBeCloseTo(expected.z, 3);
      expect(result._size).toEqual(expected.size);
      expect(result._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getDot(other) //
  describe("getDot()", () => {
    test("returns the dot product of both vectors", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
      let other = new Vec3();
        other._x = 4;
        other._y = 5;
        other._z = 6;

      let result = vec.getDot(other);

      expect(result).toEqual(47);
    });

    test("throws an error if other is not a vec3", () => {
      let vec = new Vec3();

      expect(() => { vec.getDot("string"); })
        .toThrowError(/Vec3/);
    });
  });

  //> getCross(other) //
  describe("getCross()", () => {
    test("returns the cross product of both vectors", () => {
      let vec = new Vec3();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
      let other = new Vec3();
        other._x = 5;
        other._y = 6;
        other._z = 1;
      
      let expected = { x: -21, y: 18, z: -3 }

      let result = vec.getCross(other);

      expect(result._x).toEqual(expected.x);
      expect(result._y).toEqual(expected.y);
      expect(result._z).toEqual(expected.z);
    });

    test("throws an error if other is not a vec3", () => {
      let vec = new Vec3();

      expect(() => { vec.getCross("string"); })
        .toThrowError(/Vec3/);
    });
  });

  //> asArray() //
  describe("asArray()", () => {
    test("returns an array containing the components of the " +
    "vector", () => {
      let vec = new Vec3();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
      
      let expected = { arr: [1, 2, 3] }
      
      let arr = vec.asArray();

      expect(arr[0]).toEqual(expected.arr[0]);
      expect(arr[1]).toEqual(expected.arr[1]);
      expect(arr[2]).toEqual(expected.arr[2]);
    });
  });

  //> fromArray(arr) //
  describe("fromArray()", () => {
    test("assigns values to components in order", () => {
      let vec = new Vec3();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;

      let expected = { x: 4, y: 5, z: 6 }
      
      vec.fromArray([4, 5, 6]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
    });

    describe("assigns the last value if arr does not contain enough " +
    "values", () => {
      test("[x]", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;

        let expected = { x: 4, y: 4, z: 4 }
        
        vec.fromArray([4]);

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("[x, y]", () => {
        let vec = new Vec3();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;

        let expected = { x: 4, y: 5, z: 5 }
        
        vec.fromArray([4, 5]);

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });
    });

    test("assigns a value of 0 if arr is empty", () => {
      let vec = new Vec3();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;

      let expected = { x: 0, y: 0, z: 0 }
      
      vec.fromArray([]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
    });

    test("throws an error if arr is not an array", () => {
      let vec = new Vec3();

      expect(() => { vec.fromArray("string"); }).toThrowError(/Array/);
    });

    test("throws an error if contents of arr are not numbers", () => {
      let vec = new Vec3();

      expect(() => { vec.fromArray(["string"]); }).toThrowError(/Number/);
    });

    test("does nothing if components are unchanged", () => {
      let vec = new Vec3();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._size = 3;
        vec._sizeSq = 4;

      let expected = {
        x: 1,
        y: 2,
        z: 3,
        size: 3,
        sizeSq: 4
      }
      
      vec.fromArray([1, 2, 3]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });
});
