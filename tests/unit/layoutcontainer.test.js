import { describe, test, expect } from 'vitest';

import LayoutContainer from '../../scr/layoutcontainer.js';

import LayoutDivision from '../../scr/layoutdivision.js';
import Vec2 from '../../scr/vec2.js';

import * as enums from "../../scr/exportenums.js";

describe("construction", () => {
  test("new LayoutContainer(position, width, height, ...)", () => {
    // assign position, width and height; ignore extra
      // => new LayoutContainer(new Vec2(10, 20), 100, 200)
    let con =
      new LayoutContainer(new Vec2(10, 20), 100, 200, 300);

    expect(con.position.x).toEqual(10);
    expect(con.position.y).toEqual(20);
    expect( con.width).toEqual(100);
    expect(con.height).toEqual(200);
  });

  test("new LayoutContainer(position, width)", () => {
    // assign position and width; pad input
      // => new LayoutContainer(new Vec2(10, 20), 100, 100)
    let con =
      new LayoutContainer(new Vec2(10, 20), 100);

    expect(con.position.x).toEqual(10);
    expect(con.position.y).toEqual(20);
    expect( con.width).toEqual(100);
    expect(con.height).toEqual(100);
  });

  test("new LayoutContainer(position)", () => {
    // assign position; set width and height default value
      // => new LayoutContainer(new Vec2(10, 20), 0, 0)
    let con = new LayoutContainer(new Vec2(10, 20));

    expect(con.position.x).toEqual(10);
    expect(con.position.y).toEqual(20);
    expect( con.width).toEqual(0);
    expect(con.height).toEqual(0);
  });

  test("new LayoutContainer()", () => {
    // assign position, width and height; default value
      // => new LayoutContainer(new Vec2(0, 0), 0, 0)
    let con = new LayoutContainer();

    expect(con.position.x).toEqual(0);
    expect(con.position.y).toEqual(0);
    expect( con.width).toEqual(0);
    expect(con.height).toEqual(0);
  });
});


describe("getters/setters", () => {
  describe("this.parent", () => {
    test("parent = this.parent", () => {
      // return parent
      let con = new LayoutContainer();
      let par = new LayoutContainer();
      con._setParent(par);

      let conpar = con.parent;
        expect(conpar).toEqual(par);
    });
  });


  describe("_setParent(parent)", () => {
    test("_setParent('string')", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con._setParent("parent")).toThrowError(/LayoutContainer/);
    });

    test("_setParent(new LayoutContainer()), ...", () => {
      // assign parent
      let con = new LayoutContainer();

      let par = new LayoutDivision.Cell();
      con._setParent(par);
        expect(con.parent).toEqual(par);

      con._setParent(null);
        expect(con.parent).toEqual(null);
    });
  });


  describe("this.position", () => {
    test("position = this.position", () => {
      // return position
      let con = new LayoutContainer();
      con.position = new Vec2(10, 20);

      let pos = con.position;
        expect(pos.x).toEqual(10);
        expect(pos.y).toEqual(20);
    });

    test("this.position = 'string'", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.position = "vector").toThrowError(/Vec2/);
    });

    test("this.position = new Vec2(x, y)", () => {
      // assign position
      let con = new LayoutContainer();

      con.position = new Vec2(10, 20);
        expect(con.position.x).toEqual(10);
        expect(con.position.y).toEqual(20);
    });
  });


  describe("this.width and this.height", () => {
    test("width = this.width, ...", () => {
      // return width or height
      let con = new LayoutContainer();
      con.width  = 10;
      con.height = 20;

      let w = con.width;
        expect(w).toEqual(10);
      let h = con.height;
        expect(h).toEqual(20);
    });

    test("this.width = 'string', ...", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() =>  con.width = "10").toThrowError(/Number/);
      expect(() => con.height = "20").toThrowError(/Number/);
    });

    test("this.width = 10, ...", () => {
      // assign width or height
      let con = new LayoutContainer();

      con.width = 10;
        expect(con.width).toEqual(10);
      con.height = 20;
        expect(con.height).toEqual(20);
    });
  });
  

  describe("this.halign and this.valign", () => {
    test("halign = this.halign, ...", () => {
      // return halign or valign
      let con = new LayoutContainer();
      con.halign = enums.Align.CENTER;
      con.valign = enums.Align.MIDDLE;

      let halign = con.halign;
        expect(halign).toEqual(enums.Align.CENTER);

      let valign = con.valign;
        expect(valign).toEqual(enums.Align.MIDDLE);
    });

    test("this.halign = 0, ...", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.halign = 0).toThrowError(/String/);
      expect(() => con.valign = 0).toThrowError(/String/);
    });

    test("this.halign = 'center', ...", () => {
      let con = new LayoutContainer();
      
      // assign halign or valign
      con.halign = enums.Align.CENTER;
        expect(con.halign).toEqual(enums.Align.CENTER);
      con.halign = enums.Align.RIGHT;
        expect(con.halign).toEqual(enums.Align.RIGHT);

      con.valign = enums.Align.MIDDLE;
        expect(con.valign).toEqual(enums.Align.MIDDLE);
      con.valign = enums.Align.TOP;
        expect(con.valign).toEqual(enums.Align.TOP);
      
      // set to default if input is invalid string
      con.halign = "east";
        expect(con.halign).toEqual(enums.Align.LEFT);
      
      con.valign = "north";
        expect(con.valign).toEqual(enums.Align.BOTTOM);
    });
  });


  describe("this.hsizing and this.vsizing", () => {
    test("hsizing = this.hsizing, ...", () => {
      // return hsizing or vsizing
      let con = new LayoutContainer();
      con.hsizing = enums.Sizing.RELATIVE;
      con.vsizing = enums.Sizing.RELATIVE;

      let hsizing = con.hsizing;
        expect(hsizing).toEqual(enums.Sizing.RELATIVE);

      let vsizing = con.vsizing;
        expect(vsizing).toEqual(enums.Sizing.RELATIVE);
    });

    test("this.hsizing = 0, ...", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.hsizing = 0).toThrowError(/String/);
      expect(() => con.vsizing = 0).toThrowError(/String/);
    });

    test("this.hsizing = 'relative', ...", () => {
      let con = new LayoutContainer();

      // assign hsizing or vsizing
      con.hsizing = enums.Sizing.RELATIVE;
        expect(con.hsizing).toEqual(enums.Sizing.RELATIVE);
      
      con.vsizing = enums.Sizing.RELATIVE;
        expect(con.vsizing).toEqual(enums.Sizing.RELATIVE);

      // set to default if input is invalid string
      con.hsizing = "varied";
        expect(con.hsizing).toEqual(enums.Sizing.ABSOLUTE);
      
      con.vsizing = "varied";
        expect(con.vsizing).toEqual(enums.Sizing.ABSOLUTE);
    });
  });


  describe("this.halignElems and this.valignElems", () => {
    test("halignElems = this.halignElems, ...", () => {
      // return halignElems or valignElems
      let con = new LayoutContainer();
      con.halignElems = enums.Align.CENTER;
      con.valignElems = enums.Align.MIDDLE;

      let halignElems = con.halignElems;
        expect(halignElems).toEqual(enums.Align.CENTER);

      let valignElems = con.valignElems;
        expect(valignElems).toEqual(enums.Align.MIDDLE);
    });

    test("this.halignElems = 0, ...", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.halignElems = 0).toThrowError(/String/);
      expect(() => con.valignElems = 0).toThrowError(/String/);
    });

    test("this.halignElems = 'center', ...", () => {
      let con = new LayoutContainer();

      // assign halignElems or valignElems
      con.halignElems = enums.Align.CENTER;
        expect(con.halignElems).toEqual(enums.Align.CENTER);
      con.halignElems = enums.Align.RIGHT;
        expect(con.halignElems).toEqual(enums.Align.RIGHT);
      
      con.valignElems = enums.Align.MIDDLE;
        expect(con.valignElems).toEqual(enums.Align.MIDDLE);
      con.valignElems = enums.Align.TOP;
        expect(con.valignElems).toEqual(enums.Align.TOP);
      
      // set to default if input is invalid string
      con.halignElems = "east";
        expect(con.halignElems).toEqual(enums.Align.LEFT);
      
      con.valignElems = "north";
        expect(con.valignElems).toEqual(enums.Align.BOTTOM);
    });
  });
});


describe("resizing", () => {
  test.todo("resize()", () => { });
});


describe("adding/removing children", () => {
  describe("containers", () => {
    test("addContainer('string')", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.addContainer("container")).
        toThrowError(/LayoutContainer/);
    });

    test("addContainer(new LayoutContainer())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);

      // return container that was added
      let child = con.addContainer(new LayoutContainer());
        expect(child.parent).toBe(con);

      // return the exisiting container
      let exisiting = con.addContainer(child);
        expect(exisiting).toBe(child);
    });


    test("removeContainer('string')", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.removeContainer("container")).
        toThrowError(/LayoutContainer/);
    });

    test("removeContainer(new LayoutContainer())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);
      let child = con.addContainer(new LayoutContainer());
      
      // if container doesnt exist, do nothing
      let independent = new LayoutContainer();
      con.removeContainer(independent);
        expect(con.childContainers.size).toEqual(1);

      // remove container
        expect(child.parent).toBe(con);

      con.removeContainer(child);
        expect(child.parent).toBe(null);
        expect(con.childContainers.size).toEqual(0);
    });

    test("removeContainer()", () => {
      let con = new LayoutContainer();
      con.addContainer(new LayoutContainer());
      con.addContainer(new LayoutContainer());
      con.addContainer(new LayoutContainer());
        expect(con.childContainers.size).toEqual(3);
        
      con.removeContainer();
        expect(con.childContainers.size).toEqual(0);
    });
  });


  describe("divisions", () => {
    test("addDivision('string')", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.addDivision("division")).
        toThrowError(/LayoutDivision/);
    });

    test("addDivision(new LayoutDivision())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);

      // return division that was added
      let child = con.addDivision(new LayoutDivision(new Vec2(2, 2)));
        expect(child.parent).toBe(con);

      // return the exisiting division
      let exisiting = con.addDivision(child);
        expect(exisiting).toBe(child);
    });


    test("removeDivision('string')", () => {
      // throw an error
      let con = new LayoutContainer();

      expect(() => con.removeDivision("division")).
        toThrowError(/LayoutDivision/);
    });

    test("removeDivision(new LayoutDivision())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);
      let child = con.addDivision(new LayoutDivision());
      
      // if division doesnt exist, do nothing
      let independent = new LayoutDivision();
      con.removeDivision(independent);
        expect(con.childDivisions.size).toEqual(1);

      // remove division
        expect(child.parent).toBe(con);

      con.removeDivision(child);
        expect(child.parent).toBe(null);
        expect(con.childDivisions.size).toEqual(0);
    });

    test("removeDivision()", () => {
      let con = new LayoutContainer();
      con.addDivision(new LayoutDivision());
      con.addDivision(new LayoutDivision());
      con.addDivision(new LayoutDivision());
        expect(con.childDivisions.size).toEqual(3);
        
      con.removeDivision();
        expect(con.childDivisions.size).toEqual(0);
    });
  });
});


describe("elements", () => {
  test.todo("positionElements(elements)", () => { });
  test.todo("#adjustElem(elem, width, height) - indirect", () => { });
});


describe("rendering", () => {
  test.todo("getVertices()", () => { });
});
