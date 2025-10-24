import { describe, test, expect } from 'vitest';

import LayoutElement from '../../src/layoutelement.js';

import Vec2 from '../../src/vec2.js';

describe("construction", () => {
  test("new LayoutElement(width, height, ...)", () => {
    // assign width and height; ignore extra
      // => new LayoutElement(100, 200)
    let elem = new LayoutElement(100, 200, 300);

    expect(elem.width).toEqual(100);
    expect(elem.height).toEqual(200);
  });

  test("new LayoutElement(width)", () => {
    // assign width and height; pad input
      // => new LayoutElement(100, 100)
    let elem = new LayoutElement(100);

    expect(elem.width).toEqual(100);
    expect(elem.height).toEqual(100);
  });

  test("new LayoutElement()", () => {
    // assign width and height; default value
      // => new LayoutElement(0, 0)
    let elem = new LayoutElement();

    expect(elem.width).toEqual(0);
    expect(elem.height).toEqual(0);
  });
});


describe("getters/setters", () => {
  describe("this.position and this.offset", () => {
    test("position = this.position, ...", () => {
      // return position or offset
      let elem = new LayoutElement();
      elem.position = new Vec2(10, 20);
      elem.offset   = new Vec2(30, 40);

      let pos = elem.position;
        expect(pos.x).toEqual(10);
        expect(pos.y).toEqual(20);

      let off = elem.offset;
        expect(off.x).toEqual(30);
        expect(off.y).toEqual(40);
    });

    test("this.position = 'string', ...", () => {
      // throw an error
      let elem = new LayoutElement();

      expect(() => elem.position = "vector").toThrowError(/Vec2/);
      expect(() =>   elem.offset = "vector").toThrowError(/Vec2/);
    });

    test("this.position = new Vec2(10, 20), ...", () => {
      // assign position or offset
      let elem = new LayoutElement();

      elem.position = new Vec2(10, 20);
        expect(elem.position.x).toEqual(10);
        expect(elem.position.y).toEqual(20);

      elem.offset = new Vec2(30, 40);
        expect(elem.offset.x).toEqual(30);
        expect(elem.offset.y).toEqual(40);

      // if this.float is true then apply offset
      // when assigning position
      elem.float = true;
      elem.offset = new Vec2(30, 40);
      elem.position = new Vec2(10, 20);
        expect(elem.position.x).toEqual(40);
        expect(elem.position.y).toEqual(60);
    });
  });


  describe("this.width and this.height", () => {
    test("width = this.width, ...", () => {
      // return width or height
      let elem = new LayoutElement();
      elem.width  = 10;
      elem.height = 20;

      let w = elem.width;
        expect(w).toEqual(10);
      let h = elem.height;
        expect(h).toEqual(20);
    });

    test("this.width = 'string', ...", () => {
      // throw an error
      let elem = new LayoutElement();

      expect(() =>  elem.width = "10").toThrowError(/Number/);
      expect(() => elem.height = "20").toThrowError(/Number/);
    });

    test("this.width = 10, ...", () => {
      // assign width or height
      let elem = new LayoutElement();

      elem.width = 10;
        expect(elem.width).toEqual(10);
      elem.height = 20;
        expect(elem.height).toEqual(20);
    });
  });


  describe("this.posCallback", () => {
    test("this.posCallback()", () => {
      // default posCallback is an empty function
      let elem = new LayoutElement();
      elem.posCallback();
    });

    test("posCallback = this.posCallback, ...", () => {
      // return posCallback
      let elem = new LayoutElement();
      elem.posCallback = () => { return "success"; };

      let func = elem.posCallback;
        expect(func()).toEqual("success");
    });

    test("this.posCallback = 'string', ...", () => {
      // throw an error
      let elem = new LayoutElement();

      expect(() => elem.posCallback = "func").toThrowError(/Function/);
    });

    test("this.posCallback = () => { })", () => {
      // assign posCallback
      let elem = new LayoutElement();

      elem.posCallback = () => { return "success"; };
        expect(elem.posCallback()).toEqual("success");
    });
  });
});
