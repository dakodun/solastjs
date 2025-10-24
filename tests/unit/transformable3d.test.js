import { describe, test, expect } from 'vitest';

import Transformable3D from '../../src/transformable3d.js';

import Mat4 from '../../src/mat4.js';
import Vec3 from '../../src/vec3.js';

describe("getters/setters", () => {
  describe("this.position, this.origin, this.scale, " +
    "and this.rotation", () => {

    test("position = this.position, ...", () => {
      // return position, origin, scale, or rotation
      let trans = new Transformable3D();
        trans.position = new Vec3(10, 20, 50);
        trans.origin   = new Vec3(30, 40, 60);
        trans.scale    = new Vec3( 5,  6,  7);
        trans.rotation = new Vec3( 1,  2,  3);

      let pos = trans.position;
        expect(pos.x).toStrictEqual(10);
        expect(pos.y).toStrictEqual(20);
        expect(pos.z).toStrictEqual(50);

      let ori = trans.origin;
        expect(ori.x).toStrictEqual(30);
        expect(ori.y).toStrictEqual(40);
        expect(ori.z).toStrictEqual(60);

      let sca = trans.scale;
        expect(sca.x).toStrictEqual(5);
        expect(sca.y).toStrictEqual(6);
        expect(sca.z).toStrictEqual(7);
      
      let rot = trans.rotation;
        expect(rot.x).toStrictEqual(1);
        expect(rot.y).toStrictEqual(2);
        expect(rot.z).toStrictEqual(3);
    });

    test("this.position = 'string', ...", () => {
      // throw an error
      let trans = new Transformable3D();

        expect(() => { trans.position = "vector"; }).
          toThrowError(/Vec3/);
        expect(() => { trans.origin = "vector"; }).
          toThrowError(/Vec3/);
        expect(() => { trans.scale = "vector"; }).
          toThrowError(/Vec3/);
        expect(() => { trans.rotation = "vector"; }).
          toThrowError(/Vec3/);
    });

    test("this.position = new Vec3(x, y, z), ...", () => {
      // assign position, origin, scale, or rotation
      let trans = new Transformable3D();

      trans.position = new Vec3(10, 20, 50);
        expect(trans.position.x).toStrictEqual(10);
        expect(trans.position.y).toStrictEqual(20);
        expect(trans.position.z).toStrictEqual(50);
      
      trans.origin = new Vec3(30, 40, 60);
        expect(trans.origin.x).toStrictEqual(30);
        expect(trans.origin.y).toStrictEqual(40);
        expect(trans.origin.z).toStrictEqual(60);
      
      trans.scale = new Vec3(5, 6, 7);
        expect(trans.scale.x).toStrictEqual(5);
        expect(trans.scale.y).toStrictEqual(6);
        expect(trans.scale.z).toStrictEqual(7);
      
      trans.rotation = new Vec3(1, 2, 3);
        expect(trans.rotation.x).toStrictEqual(1);
        expect(trans.rotation.y).toStrictEqual(2);
        expect(trans.rotation.z).toStrictEqual(3);
    });
  });


  describe("this.transMat", () => {
    test("transMat = this.transMat", () => {
      // return transMat
      let trans = new Transformable3D();
      let mat = new Mat4(
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]
      );

      trans.transMat = mat;

      let tmat = trans.transMat;
      let arr = [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4];
        expect(tmat.arr).toStrictEqual(arr);
    });

    test("this.transMat = 'string'", () => {
      // throw an error
      let trans = new Transformable3D();

        expect(() => { trans.transMat = "matrix"; }).
          toThrowError(/Mat4/);
    });

    test("this.transMat = new Mat3(arr)", () => {
      // assign transMat
      let trans = new Transformable3D();

      trans.transMat = new Mat4(
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]
      );

      let arr = [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4];
        expect(trans.transMat.arr).toStrictEqual(arr);
    });
  });


  describe("this.boundingBox", () => {
    test("boundingBox = this.boundingBox", () => {
      // return boundingBox
      let trans = new Transformable3D();
        trans.boundingBox = {
          lower: new Vec3(1, 2, 5),
          upper: new Vec3(3, 4, 6)
        };

      let bbox = trans.boundingBox;
        expect(bbox.lower.x).toStrictEqual(1);
        expect(bbox.lower.y).toStrictEqual(2);
        expect(bbox.lower.z).toStrictEqual(5);
        expect(bbox.upper.x).toStrictEqual(3);
        expect(bbox.upper.y).toStrictEqual(4);
        expect(bbox.upper.z).toStrictEqual(6);
    });

    test("this.boundingBox = 'string', ...", () => {
      // throw an error
      let trans = new Transformable3D();

        expect(() => { trans.boundingBox = "object"; }).
          toThrowError(/Object/);

      // wrong prototype
      let empty = {                       };
      let lower = { lower: new Vec3(1, 2, 3) };
      let upper = { upper: new Vec3(1, 2, 3) };

        expect(() => { trans.boundingBox = empty; }).
          toThrowError(/lower/);
        expect(() => { trans.boundingBox = lower; }).
          toThrowError(/upper/);
        expect(() => { trans.boundingBox = upper; }).
          toThrowError(/lower/);
      
      // wrong types
      let lstr = { lower: "vector",
        upper: new Vec3(1, 2, 3) };
      let ustr = { lower: new Vec3(1, 2, 3),
        upper: "vector" };

        expect(() => { trans.boundingBox = lstr; }).
          toThrowError(/Vec3/);
        expect(() => { trans.boundingBox = ustr; }).
          toThrowError(/Vec3/);
    });

    test("this.boundingBox = 3", () => {
      // assign boundingBox
      let trans = new Transformable3D();

      trans.boundingBox = {
        lower: new Vec3(1, 2, 5),
        upper: new Vec3(3, 4, 6)
      };

        expect(trans.boundingBox.lower.x).toStrictEqual(1);
        expect(trans.boundingBox.lower.y).toStrictEqual(2);
        expect(trans.boundingBox.lower.z).toStrictEqual(5);
        expect(trans.boundingBox.upper.x).toStrictEqual(3);
        expect(trans.boundingBox.upper.y).toStrictEqual(4);
        expect(trans.boundingBox.upper.z).toStrictEqual(6);
    });
  });
});


describe("copying", () => {
  describe("this.copy()", () => {
    test("this.copy(other)", () => {
      // make a deep copy of other
      let trans = new Transformable3D();
      let other = new Transformable3D();
        other.position = new Vec3(10, 20, 50);
        other.origin   = new Vec3(30, 40, 60);
        
        other.transMat = new Mat4(
          [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]
        );

        other.scale    = new Vec3(5, 6, 7);
        other.rotation = new Vec3(1, 2, 3);

        other.boundingBox = {
          lower: new Vec3(1, 2, 5),
          upper: new Vec3(3, 4, 6)
        };
        
        expect(trans.equals(other)).toStrictEqual(false);

      trans.copy(other);
        expect(trans.equals(other)).toStrictEqual(true);
        expect(trans).not.toBe(other);
      
      // should not modify other
        expect(other.position.x).toStrictEqual(10);
        expect(other.position.y).toStrictEqual(20);
        expect(other.position.z).toStrictEqual(50);
        expect(other.origin.x).toStrictEqual(30);
        expect(other.origin.y).toStrictEqual(40);
        expect(other.origin.z).toStrictEqual(60);

        expect(other.transMat.arr).toStrictEqual(
          [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]
        );

        expect(other.scale.x).toStrictEqual(5);
        expect(other.scale.y).toStrictEqual(6);
        expect(other.scale.z).toStrictEqual(7);
        expect(other.rotation.x).toStrictEqual(1);
        expect(other.rotation.y).toStrictEqual(2);
        expect(other.rotation.z).toStrictEqual(3);

        expect(other.boundingBox.lower.x).toStrictEqual(1);
        expect(other.boundingBox.lower.y).toStrictEqual(2);
        expect(other.boundingBox.lower.z).toStrictEqual(5);
        expect(other.boundingBox.upper.x).toStrictEqual(3);
        expect(other.boundingBox.upper.y).toStrictEqual(4);
        expect(other.boundingBox.upper.z).toStrictEqual(6);
    });

    test("this.copy('string')", () => {
      // throw an error
      let trans = new Transformable3D();

      expect(() => trans.copy("transformable3D")).
        toThrowError(/Transformable3D/);
    });
  });


  describe("this.getCopy()", () => {
    test("this.getCopy()", () => {
      // return a Transformable3D
      let trans = new Transformable3D();
        trans.position = new Vec3(10, 20, 50);
        trans.origin   = new Vec3(30, 40, 60);
        
        trans.transMat = new Mat4(
          [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]
        );

        trans.scale    = new Vec3(5, 6, 7);
        trans.rotation = new Vec3(1, 2, 3);

        trans.boundingBox = {
          lower: new Vec3(1, 2, 5),
          upper: new Vec3(3, 4, 6)
        };

      let other = trans.getCopy();
        expect(other).toBeInstanceOf(Transformable3D);

      // should be a deep copy of this
        expect(other.equals(trans)).toStrictEqual(true);
        expect(other).not.toBe(trans);
    });
  });
});


describe("comparison", () => {
  describe("this.equals()", () => {
    test("this.equals(other)", () => {
      // initally should equal each other
      let trans = new Transformable3D();
      let other = new Transformable3D();

        expect(other.equals(trans)).toStrictEqual(true);
        expect(other).not.toBe(trans);

      // when trans is changed then should no longer equal
      trans.position = new Vec3(1.0, 2.0, 7.0);
      trans.origin = new Vec3(3.0, 4.0, 8.0);
      trans.transMat = new Mat4([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ]);

      trans.scale = new Vec3(5.0, 6.0, 9.0);
      trans.rotation = new Vec3(3.0, 4.0, 5.0);

        expect(other.equals(trans)).toStrictEqual(false);
        expect(other).not.toBe(trans);

      // when other is set to same as trans, should be equal
      other.position = new Vec3(1.0, 2.0, 7.0);
      other.origin = new Vec3(3.0, 4.0, 8.0);
      other.transMat = new Mat4([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ]);

      other.scale = new Vec3(5.0, 6.0, 9.0);
      other.rotation = new Vec3(3.0, 4.0, 5.0);

        expect(other.equals(trans)).toStrictEqual(true);
        expect(other).not.toBe(trans);
    });

    test("this.equals('string')", () => {
      // throw an error
      let trans = new Transformable3D();

      expect(() => trans.equals("transformable3D")).
        toThrowError(/Transformable3D/);
    });
  });
});
