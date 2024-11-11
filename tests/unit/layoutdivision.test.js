import { describe, test, expect } from 'vitest';

import LayoutDivision from '../../scr/layoutdivision.js';

import LayoutContainer from '../../scr/layoutcontainer.js';
import Vec2 from '../../scr/vec2.js';

import * as enums from "../../scr/exportenums.js";

// LayoutDivision.Cell
describe("construction", () => {
  test("new LayoutDivision.Cell(position, width, height, ...)", () => {
    // assign position, width and height; ignore extra
      // => new LayoutDivision.Cell(new Vec2(10, 20), 100, 200)
    let cell =
      new LayoutDivision.Cell(new Vec2(10, 20), 100, 200, 300);

    expect(cell.position.x).toEqual(10);
    expect(cell.position.y).toEqual(20);
    expect( cell.width).toEqual(100);
    expect(cell.height).toEqual(200);
  });

  test("new LayoutDivision.Cell(position, width)", () => {
    // assign position and width; pad input
      // => new LayoutDivision.Cell(new Vec2(10, 20), 100, 100)
    let cell = new LayoutDivision.Cell(new Vec2(10, 20), 100);

    expect(cell.position.x).toEqual(10);
    expect(cell.position.y).toEqual(20);
    expect( cell.width).toEqual(100);
    expect(cell.height).toEqual(100);
  });

  test("new LayoutDivision.Cell(position)", () => {
    // assign position; set width and height default value
      // => new LayoutDivision.Cell(new Vec2(10, 20), 0, 0)
    let cell = new LayoutDivision.Cell(new Vec2(10, 20));

    expect(cell.position.x).toEqual(10);
    expect(cell.position.y).toEqual(20);
    expect( cell.width).toEqual(0);
    expect(cell.height).toEqual(0);
  });

  test("new LayoutDivision.Cell()", () => {
    // assign position, width and height; default value
      // => new LayoutDivision.Cell(new Vec2(0, 0), 0, 0)
    let cell = new LayoutDivision.Cell();

    expect(cell.position.x).toEqual(0);
    expect(cell.position.y).toEqual(0);
    expect( cell.width).toEqual(0);
    expect(cell.height).toEqual(0);
  });
});


describe("getters/setters", () => {
  describe("this.position", () => {
    test("position = this.position", () => {
      // return position
      let cell = new LayoutDivision.Cell(new Vec2(10, 20));

      let pos = cell.position;
        expect(pos.x).toEqual(10);
        expect(pos.y).toEqual(20);
    });
  });


  describe("this.width and this.height", () => {
    test("width = this.width, ...", () => {
      // return width or height
      let cell = new LayoutDivision.Cell(new Vec2(), 10, 20);

      let w = cell.width;
        expect(w).toEqual(10);
      let h = cell.height;
        expect(h).toEqual(20);
    });
  });


  describe("this.halignElems and this.valignElems", () => {
    test("halignElems = this.halignElems, ...", () => {
      // return halignElems or valignElems
      let cell = new LayoutDivision.Cell();
      cell.halignElems = enums.Align.CENTER;
      cell.valignElems = enums.Align.MIDDLE;

      let halignElems = cell.halignElems;
        expect(halignElems).toEqual(enums.Align.CENTER);

      let valignElems = cell.valignElems;
        expect(valignElems).toEqual(enums.Align.MIDDLE);
    });

    test("this.halignElems = 0, ...", () => {
      // throw an error
      let cell = new LayoutDivision.Cell();

      expect(() => cell.halignElems = 0).toThrowError(/String/);
      expect(() => cell.valignElems = 0).toThrowError(/String/);
    });

    test("this.halignElems = 'center', ...", () => {
      let cell = new LayoutDivision.Cell();

      // assign hsizing or vsizing
      cell.halignElems = enums.Align.CENTER;
        expect(cell.halignElems).toEqual(enums.Align.CENTER);
      
      cell.valignElems = enums.Align.MIDDLE;
        expect(cell.valignElems).toEqual(enums.Align.MIDDLE);
      
      // set to default if input is invalid string
      cell.halignElems = "east";
        expect(cell.halignElems).toEqual(enums.Align.LEFT);
      
      cell.valignElems = "north";
        expect(cell.valignElems).toEqual(enums.Align.BOTTOM);
    });
  });
});


describe("adding/removing children", () => {
  describe("containers", () => {
    test("addContainer('string')", () => {
      // throw an error
      let div = new LayoutDivision();
      let cell = div.getCell(new Vec2(0, 0));

      expect(() => cell.addContainer("division")).
        toThrowError(/LayoutContainer/);
    });

    test("addContainer(new LayoutContainer())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));
      con.addDivision(div);

      // return container that was added
      let child = cell.addContainer(new LayoutContainer());
        expect(child.parent).toBe(cell);

      // return the exisiting container
      let exisiting = cell.addContainer(child);
        expect(exisiting).toBe(child);
    });


    test("removeContainer('string')", () => {
      // throw an error
      let div = new LayoutDivision();
      let cell = div.getCell(new Vec2(0, 0));

      expect(() => cell.removeContainer("container")).
        toThrowError(/LayoutContainer/);
    });

    test("removeContainer(new LayoutContainer())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 50, 50);
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));
      con.addDivision(div);
      let child = cell.addContainer(new LayoutContainer());
      
      // if container doesnt exist, do nothing
      let independent = new LayoutContainer();
      cell.removeContainer(independent);
        expect(cell.childContainers.size).toEqual(1);

      // remove container
        expect(child.parent).toBe(cell);

      cell.removeContainer(child);
        expect(child.parent).toBe(null);
        expect(cell.childContainers.size).toEqual(0);
    });

    test("removeContainer()", () => {
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));

      cell.addContainer(new LayoutContainer());
      cell.addContainer(new LayoutContainer());
      cell.addContainer(new LayoutContainer());
        expect(cell.childContainers.size).toEqual(3);
        
      cell.removeContainer();
        expect(cell.childContainers.size).toEqual(0);
    });
  });


  describe("divisions", () => {
    test("addDivision('string')", () => {
      // throw an error
      let div = new LayoutDivision();
      let cell = div.getCell(new Vec2(0, 0));

      expect(() => cell.addDivision("division")).
        toThrowError(/LayoutDivision/);
    });

    test("addDivision(new LayoutDivision())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 100, 100);
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));
      con.addDivision(div);

      // return division that was added
      let child = cell.addDivision(new LayoutDivision(new Vec2(2, 2)));
        expect(child.parent).toBe(cell);

      // return the exisiting division
      let exisiting = cell.addDivision(child);
        expect(exisiting).toBe(child);
    });


    test("removeDivision('string')", () => {
      // throw an error
      let div = new LayoutDivision();
      let cell = div.getCell(new Vec2(0, 0));

      expect(() => cell.removeDivision("division")).
        toThrowError(/LayoutDivision/);
    });

    test("removeDivision(new LayoutDivision())", () => {
      let con = new LayoutContainer(new Vec2(10, 10), 100, 100);
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));
      con.addDivision(div);
      let child = cell.addDivision(new LayoutDivision());
      
      // if division doesnt exist, do nothing
      let independent = new LayoutDivision();
      cell.removeDivision(independent);
        expect(cell.childDivisions.size).toEqual(1);

      // remove division
        expect(child.parent).toBe(cell);

      cell.removeDivision(child);
        expect(child.parent).toBe(null);
        expect(cell.childDivisions.size).toEqual(0);
    });

    test("removeDivision()", () => {
      let div = new LayoutDivision(new Vec2(2, 2));
      let cell = div.getCell(new Vec2(0, 0));

      cell.addDivision(new LayoutDivision());
      cell.addDivision(new LayoutDivision());
      cell.addDivision(new LayoutDivision());
        expect(cell.childDivisions.size).toEqual(3);
        
      cell.removeDivision();
        expect(cell.childDivisions.size).toEqual(0);
    });
  });
});


describe("elements", () => {
  test.todo("positionElements(elements)", () => { });
  test.todo("#adjustElem(elem, width, height) - indirect", () => { });
});


describe("resizing", () => {
  test.todo("_resize(position, width, height)", () => { });
});
// ...


// LayoutDivision
describe("construction", () => {
  test.todo("LayoutDivision()", () => { });
});


describe("getters/setters", () => {
describe("this.parent", () => {
    test("parent = this.parent", () => {
      // return parent
      let div = new LayoutDivision();
      let con = new LayoutContainer();
      con.addDivision(div);

      let conpar = div.parent;
        expect(conpar).toEqual(con);
    });
  });


  describe("_setParent(parent)", () => {
    test("_setParent('string')", () => {
      // throw an error
      let div = new LayoutDivision();

      expect(() => div._setParent("parent")).
        toThrowError(/LayoutContainer/);
    });

    test("_setParent(new LayoutContainer()), ...", () => {
      // assign parent
      let div = new LayoutDivision();

      let cell = new LayoutDivision.Cell();
      div._setParent(cell);
        expect(div.parent).toEqual(cell);

      div._setParent(null);
        expect(div.parent).toEqual(null);
    });
  });


  describe("this.cellCount", () => {
    test("cellCount = this.cellCount", () => {
      // return cellCount
      let div = new LayoutDivision(new Vec2(2, 2));

      let ccount = div.cellCount;
        expect(ccount.x).toEqual(2);
        expect(ccount.y).toEqual(2);
    });

    test("cellCount = 'string'", () => {
      // throw an error
      let div = new LayoutDivision();

      expect(() => div.cellCount = "vector").
        toThrowError(/Vec2/);
      
      expect(() => div.cellCount = new Vec2(0, 1)).
        toThrowError(/cellCount.x/);
      expect(() => div.cellCount = new Vec2(1, 0)).
        toThrowError(/cellCount.y/);
    });

    test("cellCount = new Vec2()", () => {
      let div = new LayoutDivision(new Vec2(2, 2));
      let con00 = div.getCell(new Vec2(0, 0)).
        addContainer(new LayoutContainer(new Vec2(), 10, 10));
      let con11 = div.getCell(new Vec2(1, 1)).
        addContainer(new LayoutContainer(new Vec2(), 20, 20));

      // grow the division by adding more cells
        div.cellCount = new Vec2(3, 3);
        
        // ensure current cells remain unchanged
        expect(con00.parent).toEqual(div.getCell(new Vec2(0, 0)));
        expect(con11.parent).toEqual(div.getCell(new Vec2(1, 1)));
        
        // ensure new added (in row and column)
        expect(div.cells.length).toEqual(9);
      // ...
      
      // shrink the division by removing cells
        div.cellCount = new Vec2(1, 1);

        // ensure current maintained where possible
        expect(con00.parent).toEqual(div.getCell(new Vec2(0, 0)));

        // ensure exisiting are reset
        expect(con11.parent).toEqual(null);
      // ...
    });
  });


  describe("this.position", () => {
    test("position = this.position", () => {
      // return position
      let div = new LayoutDivision(new Vec2(2, 2));

      let pos = div.position;
        expect(pos.x).toEqual(0);
        expect(pos.y).toEqual(0);
      
      // return parent's position
      let con = new LayoutContainer(new Vec2(10, 20));
      con.addDivision(div);

      pos = div.position;
        expect(pos.x).toEqual(10);
        expect(pos.y).toEqual(20);
    });
  });


  describe("this.width and this.height", () => {
    test("width = this.width, ...", () => {
      // return width or height
      let div = new LayoutDivision(new Vec2(2, 2));

      let w = div.width;
        expect(w).toEqual(0);
      let h = div.height;
        expect(h).toEqual(0);
      
      // return parent's width or height
      let con = new LayoutContainer(new Vec2(), 10, 20);
      con.addDivision(div);

      w = div.width;
        expect(w).toEqual(10);
      h = div.height;
        expect(h).toEqual(20);
    });
  });
});


describe("cell retrieval", () => {
  test.todo("getCell(cell)", () => { });
});


describe("resizing", () => {
  test.todo("resize()", () => { });
});


describe("rendering", () => {
  test.todo("getVertices()", () => { });
});
// ...
