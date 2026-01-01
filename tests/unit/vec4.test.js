import { describe, test, expect } from 'vitest';

import Vec4 from '../../src/vec4.js';

import Vec2 from '../../src/vec2.js';
import Vec3 from '../../src/vec3.js';

//> Vec4 //
describe("Vec4", () => {
  //> constructor //
  describe("constructor", () => {
    test("defaults to 0 when no arguments passed", () => {
      let vec = new Vec4();

      let expected = { x: 0, y: 0, z: 0, w: 0 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
    });

    describe("pads the input with the last supplied argument", () => {
      test("(x)", () => {
        let vec = new Vec4(1);
        
        let expected = { x: 1, y: 1, z: 1, w: 1 }

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("(x, y)", () => {
        let vec = new Vec4(1, 2);
        
        let expected = { x: 1, y: 2, z: 2, w: 2 }

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("(x, y, z)", () => {
        let vec = new Vec4(1, 2, 3);
        
        let expected = { x: 1, y: 2, z: 3, w: 3 }

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });
    });

    test("assigns arguments in order", () => {
      let vec = new Vec4(1, 2, 3, 4);

      let expected = { x: 1, y: 2, z: 3, w: 4 }

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
    });

    test("throws an error on type mismatch", () => {
      expect(() => { let vec = new Vec4("str", 1, 1, 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec4(1, "str", 1, 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec4(1, 1, "str", 1); })
        .toThrowError(/Number/);
      expect(() => { let vec = new Vec4(1, 1, 1, "str"); })
        .toThrowError(/Number/);
    });
  });

  //> x //
  describe("x", () => {
    describe("get", () => {
      test("returns the value of x", () => {
        let vec = new Vec4();
          vec._x = 1;
        
        let x = vec.x;

        expect(x).toEqual(vec._x);
      });
    });

    describe("set", () => {
      test("sets the value of x and resets size/sizesq", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
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
        let vec = new Vec4();
        
        expect(() => { vec.x = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> y //
  describe("y", () => {
    describe("get", () => {
      test("returns the value of y", () => {
        let vec = new Vec4();
          vec._y = 2;
        
        let y = vec.y;

        expect(y).toEqual(vec._y);
      });
    });

    describe("set", () => {
      test("sets the value of y and resets size/sizesq", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
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
        let vec = new Vec4();
        
        expect(() => { vec.y = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> z //
  describe("z", () => {
    describe("get", () => {
      test("returns the value of z", () => {
        let vec = new Vec4();
          vec._z = 3;
        
        let z = vec.z;

        expect(z).toEqual(vec._z);
      });
    });

    describe("set", () => {
      test("sets the value of z and resets size/sizesq", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
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
        let vec = new Vec4();
        
        expect(() => { vec.z = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> w //
  describe("w", () => {
    describe("get", () => {
      test("returns the value of w", () => {
        let vec = new Vec4();
          vec._w = 4;
        
        let w = vec.w;

        expect(w).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of w and resets size/sizesq", () => {
        let vec = new Vec4();
          vec._w = 4;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          w: 1,
          size: null,
          sizeSq: null
        }

        vec.w = 1;

        expect(vec._w).toEqual(expected.w);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("does nothing if w is unchanged", () => {
        let vec = new Vec4();
          vec._w = 4;
          vec._size = 2;
          vec._sizeSq = 3;
        
        let expected = {
          w: 4,
          size: 2,
          sizeSq: 3
        }

        vec.w = 4;

        expect(vec._w).toEqual(expected.w);
        expect(vec._size).toEqual(expected.size);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.z = "string"; }).toThrowError(/Number/);
      });
    });
  });

  //> size //
  describe("size", () => {
    describe("get", () => {
      test("calculates and returns the value of size (also " +
      "calculates sizeSq)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: 5.477,
          sizeSq: 30
        }

        let size = vec.size;

        expect(size).toBeCloseTo(expected.size, 3);
        expect(vec._sizeSq).toEqual(expected.sizeSq);
      });

      test("returns size if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
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
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
          vec._size = null;
          vec._sizeSq = null;

        let expected = {
          size: null,
          sizeSq: 30
        }

        let sizeSq = vec.sizeSq;

        expect(vec._size).toEqual(expected.size);
        expect(sizeSq).toEqual(expected.sizeSq);
      });

      test("returns sizesq if it has already been stored (no " +
      "recalculation)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
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
        let vec = new Vec4();
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
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 5, y: 6 }

        vec.xy = [5, 6];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("sets the value of x and y if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
        
        let expected = { x: 5, y: 5 }

        vec.xy = [5];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xy = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xz //
  describe("xz", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (x, z)", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
          vec._x = 1;
          vec._z = 3;
        
        let expected = { x: 5, z: 6 }

        vec.xz = [5, 6];

        expect(vec._x).toEqual(expected.x);
        expect(vec._z).toEqual(expected.z);
      });

      test("sets the value of x and z if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._z = 3;
        
        let expected = { x: 5, z: 5 }

        vec.xz = [5];

        expect(vec._x).toEqual(expected.x);
        expect(vec._z).toEqual(expected.z);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xw //
  describe("xw", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (x, w)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._w = 4;
        
        let vec2 = vec.xw;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._x);
        expect(vec2._y).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of x and w", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._w = 4;
        
        let expected = { x: 5, w: 6 }

        vec.xw = [5, 6];

        expect(vec._x).toEqual(expected.x);
        expect(vec._w).toEqual(expected.w);
      });

      test("sets the value of x and w if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._w = 4;
        
        let expected = { x: 5, w: 5 }

        vec.xw = [5];

        expect(vec._x).toEqual(expected.x);
        expect(vec._w).toEqual(expected.w);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> yz //
  describe("yz", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (y, z)", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
          vec._y = 2;
          vec._z = 3;
        
        let expected = { y: 5, z: 6 }

        vec.yz = [5, 6];

        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("sets the value of y and z if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._z = 3;
        
        let expected = { y: 5, z: 5 }

        vec.yz = [5];

        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.yz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> yw //
  describe("yw", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (y, w)", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._w = 4;
        
        let vec2 = vec.yw;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._y);
        expect(vec2._y).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of y and w", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._w = 4;
        
        let expected = { y: 5, w: 6 }

        vec.yw = [5, 6];

        expect(vec._y).toEqual(expected.y);
        expect(vec._w).toEqual(expected.w);
      });

      test("sets the value of y and w if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._w = 4;
        
        let expected = { y: 5, w: 5 }

        vec.yw = [5];

        expect(vec._y).toEqual(expected.y);
        expect(vec._w).toEqual(expected.w);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.yw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> zw //
  describe("zw", () => {
    describe("get", () => {
      test("returns a Vec2 comprised of (z, w)", () => {
        let vec = new Vec4();
          vec._z = 3;
          vec._w = 4;
        
        let vec2 = vec.zw;
        
        expect(vec2 instanceof Vec2).toEqual(true);
        expect(vec2._x).toEqual(vec._z);
        expect(vec2._y).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of z and w", () => {
        let vec = new Vec4();
          vec._z = 3;
          vec._w = 4;
        
        let expected = { z: 5, w: 6 }

        vec.zw = [5, 6];

        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("sets the value of z and w if there is only one " +
      "value provided", () => {
        let vec = new Vec4();
          vec._z = 3;
          vec._w = 4;
        
        let expected = { z: 5, w: 5 }

        vec.zw = [5];

        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.zw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xyz //
  describe("xyz", () => {
    describe("get", () => {
      test("returns a Vec3 comprised of (x, y, z)", () => {
        let vec = new Vec4();
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
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
        
        let expected = { x: 5, y: 6, z: 7 }

        vec.xyz = [5, 6, 7];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
      });

      describe("sets the value of x, y and z if there are not " +
      "enough values provided", () => {
        test("[x]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
          
          let expected = { x: 5, y: 5, z: 5 }

          vec.xyz = [5];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
        });

        test("[x, y]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
          
          let expected = { x: 5, y: 6, z: 6 }

          vec.xyz = [5, 6];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xyz = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xyw //
  describe("xyw", () => {
    describe("get", () => {
      test("returns a Vec3 comprised of (x, y, w)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._w = 4;
        
        let vec3 = vec.xyw;
        
        expect(vec3 instanceof Vec3).toEqual(true);
        expect(vec3._x).toEqual(vec._x);
        expect(vec3._y).toEqual(vec._y);
        expect(vec3._z).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of x, y and w", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._w = 4;
        
        let expected = { x: 5, y: 6, w: 7 }

        vec.xyw = [5, 6, 7];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._w).toEqual(expected.w);
      });

      describe("sets the value of x, y and w if there are not " +
      "enough values provided", () => {
        test("[x]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._w = 4;
          
          let expected = { x: 5, y: 5, w: 5 }

          vec.xyw = [5];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._w).toEqual(expected.w);
        });

        test("[x, y]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._w = 4;
          
          let expected = { x: 5, y: 6, w: 6 }

          vec.xyw = [5, 6];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._w).toEqual(expected.w);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xyw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xzw //
  describe("xzw", () => {
    describe("get", () => {
      test("returns a Vec3 comprised of (x, z, w)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._z = 3;
          vec._w = 4;
        
        let vec3 = vec.xzw;
        
        expect(vec3 instanceof Vec3).toEqual(true);
        expect(vec3._x).toEqual(vec._x);
        expect(vec3._y).toEqual(vec._z);
        expect(vec3._z).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of x, z and w", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._z = 3;
          vec._w = 4;
        
        let expected = { x: 5, z: 6, w: 7 }

        vec.xzw = [5, 6, 7];

        expect(vec._x).toEqual(expected.x);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      describe("sets the value of x, z and w if there are not " +
      "enough values provided", () => {
        test("[x]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { x: 5, z: 5, w: 5 }

          vec.xzw = [5];

          expect(vec._x).toEqual(expected.x);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });

        test("[x, z]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { x: 5, z: 6, w: 6 }

          vec.xzw = [5, 6];

          expect(vec._x).toEqual(expected.x);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xzw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> yzw //
  describe("yzw", () => {
    describe("get", () => {
      test("returns a Vec3 comprised of (y, z, w)", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
        
        let vec3 = vec.yzw;
        
        expect(vec3 instanceof Vec3).toEqual(true);
        expect(vec3._x).toEqual(vec._y);
        expect(vec3._y).toEqual(vec._z);
        expect(vec3._z).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of y, z and w", () => {
        let vec = new Vec4();
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
        
        let expected = { y: 5, z: 6, w: 7 }

        vec.yzw = [5, 6, 7];

        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      describe("sets the value of y, z and w if there are not " +
      "enough values provided", () => {
        test("[y]", () => {
          let vec = new Vec4();
            vec._y = 2;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { y: 5, z: 5, w: 5 }

          vec.yzw = [5];

          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });

        test("[y, z]", () => {
          let vec = new Vec4();
            vec._y = 2;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { y: 5, z: 6, w: 6 }

          vec.yzw = [5, 6];

          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.yzw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> xyzw //
  describe("xyzw", () => {
    describe("get", () => {
      test("returns a Vec4 comprised of (x, y, z, w)", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
        
        let vec4 = vec.xyzw;
        
        expect(vec4 instanceof Vec4).toEqual(true);
        expect(vec4._x).toEqual(vec._x);
        expect(vec4._y).toEqual(vec._y);
        expect(vec4._z).toEqual(vec._z);
        expect(vec4._w).toEqual(vec._w);
      });
    });

    describe("set", () => {
      test("sets the value of x, y, z and w", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;
        
        let expected = { x: 5, y: 6, z: 7, w: 8 }

        vec.xyzw = [5, 6, 7, 8];

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      describe("sets the value of x, y, z and w if there are not " +
      "enough values provided", () => {
        test("[x]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { x: 5, y: 5, z: 5, w: 5 }

          vec.xyzw = [5];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });

        test("[x, y]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { x: 5, y: 6, z: 6, w: 6 }

          vec.xyzw = [5, 6];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });

        test("[x, y, z]", () => {
          let vec = new Vec4();
            vec._x = 1;
            vec._y = 2;
            vec._z = 3;
            vec._w = 4;
          
          let expected = { x: 5, y: 6, z: 7, w: 7 }

          vec.xyzw = [5, 6, 7];

          expect(vec._x).toEqual(expected.x);
          expect(vec._y).toEqual(expected.y);
          expect(vec._z).toEqual(expected.z);
          expect(vec._w).toEqual(expected.w);
        });
      });

      test("throws an error on a type mismatch", () => {
        let vec = new Vec4();
        
        expect(() => { vec.xyzw = "string"; }).toThrowError(/Array/);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("copies all properties from other to this", () => {
      let vec = new Vec4();
        vec._x = 0;
        vec._y = 0;
        vec._z = 0;
        vec._w = 0;
        vec._size = null;
        vec._sizeSq = null;

      let other = new Vec4();
        other._x = 1;
        other._y = 2;
        other._z = 3;
        other._z = 4;
        other._size = 5;
        other._sizeSq = 6;
      
      vec.copy(other);

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._z).toEqual(other._z);
      expect(vec._w).toEqual(other._w);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });

    test("throws an error if other is not a vec4", () => {
      let vec = new Vec4();

      expect(() => { vec.copy("string"); }).toThrowError(/Vec4/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new Vec4();
        other._x = 1;
        other._y = 2;
        other._z = 3;
        other._w = 4;
        other._size = 5;
        other._sizeSq = 6;
      
      let vec = other.getCopy();

      expect(vec._x).toEqual(other._x);
      expect(vec._y).toEqual(other._y);
      expect(vec._z).toEqual(other._z);
      expect(vec._w).toEqual(other._w);
      expect(vec._size).toEqual(other._size);
      expect(vec._sizeSq).toEqual(other._sizeSq);
    });
  });

  //> equals(other, tolerance) //
  describe("equals()", () => {
    let compare = (modFunc, expected, tolerance = 0) => {
      let vec = new Vec4();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._w = 4;
      let other = new Vec4();
        other._x = 1;
        other._y = 2;
        other._z = 3;
        other._w = 4;

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
      compare((other) => { other._w = 0; }, false);
    });

    test("returns true if within custom tolerance value", () => {
      compare((other) => { other._x = 0.95; }, true, 0.1);
    });

    test("throws an error if 'other' is not a Vec4", () => {
      let vec = new Vec4();

      expect(() => { vec.equals("str"); }).toThrowError(/Vec4/);
    });

    test("throws an error if 'tolerance' is not a Number", () => {
      let vec = new Vec4();

      expect(() => { vec.equals(new Vec4(), "str"); })
        .toThrowError(/Number/);
    });
  });

  //> negate() //
  describe("negate()", () => {
    test("negates vector", () => {
      let vec = new Vec4();
        vec._x = 2;
        vec._y = -3;
        vec._z = 4;
        vec._w = -5;

      let expected = { x: -2, y: 3, z: -4, w: 5  }

      vec.negate();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
    });
  });

  //> getNegated() //
  describe("getNegated()", () => {
    test("returns a negated vector", () => {
      let vec = new Vec4();
        vec._x = 2;
        vec._y = -3;
        vec._z = 4;
        vec._w = -5;

      let expected = { x: -2, y: 3, z: -4, w: 5 }

      let result = vec.getNegated();

      expect(result._x).toEqual(expected.x);
      expect(result._y).toEqual(expected.y);
      expect(result._z).toEqual(expected.z);
      expect(result._w).toEqual(expected.w);
    });
  });

  //> normalize() //
  describe("normalize()", () => {
    test("normalises vector (and sets size/sizesq)", () => {
      let vec = new Vec4();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
        vec._w = 5;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.272,
        y: 0.408,
        z: 0.544,
        w: 0.680,
        size: 1,
        sizeSq: 1
      }

      vec.normalize();

      expect(vec._x).toBeCloseTo(expected.x, 3);
      expect(vec._y).toBeCloseTo(expected.y, 3);
      expect(vec._z).toBeCloseTo(expected.z, 3);
      expect(vec._w).toBeCloseTo(expected.w, 3);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });

    test("does nothing if vec is a zero vector (but does store " +
    "size/sizesq)", () => {
      let vec = new Vec4();
        vec._x = 0;
        vec._y = 0;
        vec._z = 0;
        vec._w = 0;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0,
        y: 0,
        z: 0,
        w: 0,
        size: 0,
        sizeSq: 0
      }

      vec.normalize();

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getNormalized() //
  describe("getNormalized()", () => {
    test("returns a normalised vector (and sets size/sizesq)", () => {
      let vec = new Vec4();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
        vec._w = 5;
        vec._size = null;
        vec._sizeSq = null;

      let expected = {
        x: 0.272,
        y: 0.408,
        z: 0.544,
        w: 0.680,
        size: 1,
        sizeSq: 1
      }

      let result = vec.getNormalized();

      expect(result._x).toBeCloseTo(expected.x, 3);
      expect(result._y).toBeCloseTo(expected.y, 3);
      expect(result._z).toBeCloseTo(expected.z, 3);
      expect(result._w).toBeCloseTo(expected.w, 3);
      expect(result._size).toEqual(expected.size);
      expect(result._sizeSq).toEqual(expected.sizeSq);
    });
  });

  //> getDot(other) //
  describe("getDot()", () => {
    test("returns the dot product of both vectors", () => {
      let vec = new Vec4();
        vec._x = 2;
        vec._y = 3;
        vec._z = 4;
        vec._w = 5;
      let other = new Vec4();
        other._x = 4;
        other._y = 5;
        other._z = 6;
        other._z = 7;

      let result = vec.getDot(other);

      expect(result).toEqual(51);
    });

    test("throws an error if other is not a vec4", () => {
      let vec = new Vec4();

      expect(() => { vec.getDot("string"); })
        .toThrowError(/Vec4/);
    });
  });

  //> asArray() //
  describe("asArray()", () => {
    test("returns an array containing the components of the " +
    "vector", () => {
      let vec = new Vec4();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._w = 4;
      
      let expected = { arr: [1, 2, 3, 4] }
      
      let arr = vec.asArray();

      expect(arr[0]).toEqual(expected.arr[0]);
      expect(arr[1]).toEqual(expected.arr[1]);
      expect(arr[2]).toEqual(expected.arr[2]);
      expect(arr[3]).toEqual(expected.arr[3]);
    });
  });

  //> fromArray(arr) //
  describe("fromArray()", () => {
    test("assigns values to components in order", () => {
      let vec = new Vec4();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._w = 4;

      let expected = { x: 5, y: 6, z: 7, w: 8 }
      
      vec.fromArray([5, 6, 7, 8]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
    });

    describe("assigns the last value if arr does not contain enough " +
    "values", () => {
      test("[x]", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;

        let expected = { x: 5, y: 5, z: 5, w: 5 }
        
        vec.fromArray([5]);

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("[x, y]", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;

        let expected = { x: 5, y: 6, z: 6, w: 6 }
        
        vec.fromArray([5, 6]);

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });

      test("[x, y, z]", () => {
        let vec = new Vec4();
          vec._x = 1;
          vec._y = 2;
          vec._z = 3;
          vec._w = 4;

        let expected = { x: 5, y: 6, z: 7, w: 7 }
        
        vec.fromArray([5, 6, 7]);

        expect(vec._x).toEqual(expected.x);
        expect(vec._y).toEqual(expected.y);
        expect(vec._z).toEqual(expected.z);
        expect(vec._w).toEqual(expected.w);
      });
    });

    test("assigns a value of 0 if arr is empty", () => {
      let vec = new Vec4();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._w = 4;

      let expected = { x: 0, y: 0, z: 0, w: 0 }
      
      vec.fromArray([]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
    });

    test("throws an error if arr is not an array", () => {
      let vec = new Vec4();

      expect(() => { vec.fromArray("string"); }).toThrowError(/Array/);
    });

    test("throws an error if contents of arr are not numbers", () => {
      let vec = new Vec4();

      expect(() => { vec.fromArray(["string"]); }).toThrowError(/Number/);
    });

    test("does nothing if components are unchanged", () => {
      let vec = new Vec4();
        vec._x = 1;
        vec._y = 2;
        vec._z = 3;
        vec._w = 4;
        vec._size = 5;
        vec._sizeSq = 6;

      let expected = {
        x: 1,
        y: 2,
        z: 3,
        w: 4,
        size: 5,
        sizeSq: 6
      }
      
      vec.fromArray([1, 2, 3, 4]);

      expect(vec._x).toEqual(expected.x);
      expect(vec._y).toEqual(expected.y);
      expect(vec._z).toEqual(expected.z);
      expect(vec._w).toEqual(expected.w);
      expect(vec._size).toEqual(expected.size);
      expect(vec._sizeSq).toEqual(expected.sizeSq);
    });
  });
});
