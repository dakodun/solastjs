import { describe, test, expect } from 'vitest';

import Transformable2D from '../../src/transformable2d.js';

import Mat3 from '../../src/mat3.js';
import Vec2 from '../../src/vec2.js';

describe("getters/setters", () => {
  describe("this.position, this.origin, and this.scale", () => {
    test("position = this.position, ...", () => {
      // return position, origin or scale
      let trans = new Transformable2D();
        trans.position = new Vec2(10, 20);
        trans.origin   = new Vec2(30, 40);
        trans.scale    = new Vec2( 5,  6);

      let pos = trans.position;
        expect(pos.x).toStrictEqual(10);
        expect(pos.y).toStrictEqual(20);

      let ori = trans.origin;
        expect(ori.x).toStrictEqual(30);
        expect(ori.y).toStrictEqual(40);

      let sca = trans.scale;
        expect(sca.x).toStrictEqual(5);
        expect(sca.y).toStrictEqual(6);
    });

    test("this.position = 'string', ...", () => {
      // throw an error
      let trans = new Transformable2D();

        expect(() => { trans.position = "vector"; }).
          toThrowError(/Vec2/);
        expect(() => { trans.origin   = "vector"; }).
          toThrowError(/Vec2/);
        expect(() => { trans.scale    = "vector"; }).
          toThrowError(/Vec2/);
    });

    test("this.position = new Vec2(x, y), ...", () => {
      // assign position, origin or scale
      let trans = new Transformable2D();

      trans.position = new Vec2(10, 20);
        expect(trans.position.x).toStrictEqual(10);
        expect(trans.position.y).toStrictEqual(20);
      
      trans.origin = new Vec2(30, 40);
        expect(trans.origin.x).toStrictEqual(30);
        expect(trans.origin.y).toStrictEqual(40);
      
      trans.scale = new Vec2(5, 6);
        expect(trans.scale.x).toStrictEqual(5);
        expect(trans.scale.y).toStrictEqual(6);
    });
  });


  describe("this.transMat", () => {
    test("transMat = this.transMat", () => {
      // return transMat
      let trans = new Transformable2D();
      let mat = new Mat3([1, 0, 0, 2, 0, 0, 3, 0, 0]);
      trans.transMat = mat;

      let tmat = trans.transMat;
      let arr = [1, 0, 0, 2, 0, 0, 3, 0, 0];
        expect(tmat.arr).toStrictEqual(arr);
    });

    test("this.transMat = 'string'", () => {
      // throw an error
      let trans = new Transformable2D();

        expect(() => { trans.transMat = "matrix"; }).
          toThrowError(/Mat3/);
    });

    test("this.transMat = new Mat3(arr)", () => {
      // assign transMat
      let trans = new Transformable2D();

      trans.transMat = new Mat3([1, 0, 0, 2, 0, 0, 3, 0, 0]);
      let arr = [1, 0, 0, 2, 0, 0, 3, 0, 0];
        expect(trans.transMat.arr).toStrictEqual(arr);
    });
  });


  describe("this.rotation", () => {
    test("rotation = this.rotation", () => {
      // return rotation
      let trans = new Transformable2D();
        trans.rotation = 3;

      let rot = trans.rotation;
        expect(rot).toStrictEqual(3);
    });

    test("this.rotation = 'string'", () => {
      // throw an error
      let trans = new Transformable2D();

        expect(() => { trans.rotation = "number"; }).
          toThrowError(/Number/);
    });

    test("this.rotation = 3", () => {
      // assign rotation
      let trans = new Transformable2D();

      trans.rotation = 3;
        expect(trans.rotation).toStrictEqual(3);
    });
  });


  describe("this.boundingBox", () => {
    test("boundingBox = this.boundingBox", () => {
      // return boundingBox
      let trans = new Transformable2D();
        trans.boundingBox = {
          lower: new Vec2(1, 2),
          upper: new Vec2(3, 4)
        };

      let bbox = trans.boundingBox;
        expect(bbox.lower.x).toStrictEqual(1);
        expect(bbox.lower.y).toStrictEqual(2);
        expect(bbox.upper.x).toStrictEqual(3);
        expect(bbox.upper.y).toStrictEqual(4);
    });

    test("this.boundingBox = 'string', ...", () => {
      // throw an error
      let trans = new Transformable2D();

        expect(() => { trans.boundingBox = "object"; }).
          toThrowError(/Object/);

      // wrong prototype
      let empty = {                       };
      let lower = { lower: new Vec2(1, 2) };
      let upper = { upper: new Vec2(1, 2) };

        expect(() => { trans.boundingBox = empty; }).
          toThrowError(/lower/);
        expect(() => { trans.boundingBox = lower; }).
          toThrowError(/upper/);
        expect(() => { trans.boundingBox = upper; }).
          toThrowError(/lower/);
      
      // wrong types
      let lstr = { lower: "vector",
        upper: new Vec2(1, 2) };
      let ustr = { lower: new Vec2(1, 2),
        upper: "vector" };

        expect(() => { trans.boundingBox = lstr; }).
          toThrowError(/Vec2/);
        expect(() => { trans.boundingBox = ustr; }).
          toThrowError(/Vec2/);
    });

    test("this.boundingBox = 3", () => {
      // assign boundingBox
      let trans = new Transformable2D();

      trans.boundingBox = {
        lower: new Vec2(1, 2),
        upper: new Vec2(3, 4)
      };

        expect(trans.boundingBox.lower.x).toStrictEqual(1);
        expect(trans.boundingBox.lower.y).toStrictEqual(2);
        expect(trans.boundingBox.upper.x).toStrictEqual(3);
        expect(trans.boundingBox.upper.y).toStrictEqual(4);
    });
  });
});


describe("copying", () => {
  describe("this.copy()", () => {
    test("this.copy(other)", () => {
      // make a deep copy of other
      let trans = new Transformable2D();
      let other = new Transformable2D();
        other.position = new Vec2(10, 20);
        other.origin   = new Vec2(30, 40);
        
        other.transMat = new Mat3([1, 0, 0, 2, 0, 0, 3, 0, 0]);
        other.scale = new Vec2(5, 6);
        other.rotation = 3;

        other.boundingBox = {
          lower: new Vec2(1, 2),
          upper: new Vec2(3, 4)
        };
        
        expect(trans.equals(other)).toStrictEqual(false);

      trans.copy(other);
        expect(trans.equals(other)).toStrictEqual(true);
        expect(trans).not.toBe(other);
      
      // should not modify other
        expect(other.position.x).toStrictEqual(10);
        expect(other.position.y).toStrictEqual(20);
        expect(other.origin.x).toStrictEqual(30);
        expect(other.origin.y).toStrictEqual(40);

        expect(other.transMat.arr).
          toStrictEqual([1, 0, 0, 2, 0, 0, 3, 0, 0]);
        expect(other.scale.x).toStrictEqual(5);
        expect(other.scale.y).toStrictEqual(6);
        expect(other.rotation).toStrictEqual(3);

        expect(other.boundingBox.lower.x).toStrictEqual(1);
        expect(other.boundingBox.lower.y).toStrictEqual(2);
        expect(other.boundingBox.upper.x).toStrictEqual(3);
        expect(other.boundingBox.upper.y).toStrictEqual(4);
    });

    test("this.copy('string')", () => {
      // throw an error
      let trans = new Transformable2D();

      expect(() => trans.copy("transformable2D")).
        toThrowError(/Transformable2D/);
    });
  });


  describe("this.getCopy()", () => {
    test("this.getCopy()", () => {
      // return a Transformable2D
      let trans = new Transformable2D();
        trans.position = new Vec2(10, 20);
        trans.origin   = new Vec2(30, 40);
        
        trans.transMat = new Mat3([1, 0, 0, 2, 0, 0, 3, 0, 0]);
        trans.scale = new Vec2(5, 6);
        trans.rotation = 3;

        trans.boundingBox = {
          lower: new Vec2(1, 2),
          upper: new Vec2(3, 4)
        };

      let other = trans.getCopy();
        expect(other).toBeInstanceOf(Transformable2D);

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
      let trans = new Transformable2D();
      let other = new Transformable2D();

        expect(other.equals(trans)).toStrictEqual(true);
        expect(other).not.toBe(trans);

      // when trans is changed then should no longer equal
      trans.position = new Vec2(1.0, 2.0);
      trans.origin = new Vec2(3.0, 4.0);
      trans.transMat = new Mat3([
        1, 2, 3, 4, 5, 6, 7, 8, 9
      ]);

      trans.scale = new Vec2(5.0, 6.0);
      trans.rotation = 3;

        expect(other.equals(trans)).toStrictEqual(false);
        expect(other).not.toBe(trans);

      // when other is set to same as trans, should be equal
      other.position = new Vec2(1.0, 2.0);
      other.origin = new Vec2(3.0, 4.0);
      other.transMat = new Mat3([
        1, 2, 3, 4, 5, 6, 7, 8, 9
      ]);

      other.scale = new Vec2(5.0, 6.0);
      other.rotation = 3;

        expect(other.equals(trans)).toStrictEqual(true);
        expect(other).not.toBe(trans);
    });

    test("this.equals('string')", () => {
      // throw an error
      let trans = new Transformable2D();

      expect(() => trans.equals("transformable2D")).
        toThrowError(/Transformable2D/);
    });
  });
});
