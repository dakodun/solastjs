import LayoutContainer from './layoutcontainer.js';
import List from './list.js';
import Vec2 from './vec2.js';

import * as enums from "./exportenums.js";

class LayoutDivision {
  static Cell = class {
    /* 
      a cell is part of a division and can be thought of as a much
      simpler  container,  with  its  positioning  and  dimensions
      controlled  entirely  by the  division  which it  belongs to

      .--CELL---.
      |         |
      '---------'
    */

    // private fields
      #position = new Vec2();
      #width  = 0;
      #height = 0;

      // elements alignment
      #halignElems =   enums.Align.LEFT;
      #valignElems = enums.Align.BOTTOM;
    // ...

    constructor(position = new Vec2(0, 0), width = 0, height = width) {
      this.childContainers = new Set();
      this.childDivisions  = new Set();

      // elements alignment
      this.halignElems =   enums.Align.LEFT;
      this.valignElems = enums.Align.BOTTOM;
      this.overflow = false;

      this.#position = position;
      this.#width  =  width;
      this.#height = height;
    }

    // getters/setters
    get position() { return this.#position; }
    get width()    { return this.#width;    }
    get height()   { return this.#height;   }
    get halignElems() { return this.#halignElems; }
    get valignElems() { return this.#valignElems; }

    set halignElems(halignElems)  {
      if (typeof halignElems !== 'string') {
        throw new TypeError("LayoutContainer (halignElems): should be " +
          "a String");
      }

      this.#halignElems = (
        halignElems === enums.Align.CENTER ||
        halignElems === enums.Align.RIGHT
        ) ? halignElems : enums.Align.LEFT;
    }

    set valignElems(valignElems)  {
      if (typeof valignElems !== 'string') {
        throw new TypeError("LayoutContainer (valignElems): should be " +
          "a String");
      }

      this.#valignElems = (
        valignElems === enums.Align.MIDDLE ||
        valignElems === enums.Align.TOP
        ) ? valignElems : enums.Align.BOTTOM;
    }
    // ...

    addContainer(container) {
      if (!(container instanceof LayoutContainer)) {
        throw new TypeError("LayoutDivision (addContainer): " +
          "container should be a LayoutContainer");
      }
      
      if (!(this.childContainers.has(container))) {
        container._setParent(this);

        this.childContainers.add(container);
      }

      return container;
    }

    removeContainer(container = null) {
      if (!(container instanceof LayoutContainer) && container !== null) {
        throw new TypeError("LayoutDivision (removeContainer): " +
          "container should be a LayoutContainer, or null");
      }

      if (container === null) {
        for (let con of this.childContainers) {
          con._setParent(null);

          this.childContainers.delete(con);
        }
      } else if (this.childContainers.has(container)) {
        container._setParent(null);

        this.childContainers.delete(container);
      }
    }

    addDivision(division) {
      if (!(division instanceof LayoutDivision)) {
        throw new TypeError("LayoutDivision (addDivision): division " +
          "should be a LayoutDivision");
      }

      if (!(this.childDivisions.has(division))) {
        division._setParent(this);

        this.childDivisions.add(division);
      }

      return division;
    }

    removeDivision(division = null) {
      if (!(division instanceof LayoutDivision) && division !== null) {
        throw new TypeError("LayoutDivision (removeDivision): division " +
          "should be a LayoutDivision, or null");
      }

      if (division === null) {
        for (let div of this.childDivisions) {
          div._setParent(null);

          this.childDivisions.delete(div);
        }
      } else if (this.childDivisions.has(division)) {
        division._setParent(null);

        this.childDivisions.delete(division);
      }
    }

    positionElements(elements) {
      let elemLines = [{width: 0, elems: new List()}];

      let blockHeight = 0;
      let lineSize = new Vec2(0, 0);

      for (let node of elements) {
        let elem = node.data;

        if (elem.float) {
          // the element is floating and doesn't need to
          // account for other elements in the cell

          elem.position = this.position.getCopy();
          this.#adjustElem(elem, elem.width, elem.height);
        } else {
          let overlap = ((lineSize.x + elem.width) - this.width);
          let limit = 0;

          if (this.overflow) {
            // if overflow is enabled, the overlap and limit
            // need to be adjusted depending on horizontal
            // alignment

            limit = elem.width;

            let front = elemLines.at(-1).elems.front;
            let left = (front !== null) ? front.data : elem;

            if (this.halignElems === enums.Align.CENTER) {
              overlap *= 0.5;
              limit = Math.min(left.width, elem.width);
            } else if (this.halignElems === enums.Align.RIGHT) {
              limit = left.width;
            }
          }

          if (overlap > limit) {
            // element doesn't fit on this line so update current
            // line width and block height and add a new line

            elemLines[elemLines.length - 1].width  = lineSize.x;
            elemLines.push({height: 0, elems: new List()});

            blockHeight += lineSize.y;
            lineSize.xy = [0, 0];
          }

          // position the element, add it to the current line
          // and update the current lines dimensions
          elem.position.xy = [
            this.position.x + lineSize.x,
            this.position.y + blockHeight
          ];

          elemLines[elemLines.length - 1].elems.push(elem);
          lineSize.x += elem.width;
          lineSize.y = Math.max(elem.height, lineSize.y);
        }
      }

      // update the last line width and final block height
      elemLines[elemLines.length - 1].width = lineSize.x;
      blockHeight += lineSize.y;

      // adjust all non-floating elements to account for alignment
      for (let line of elemLines) {
        for (let node of line.elems) {
          this.#adjustElem(node.data, line.width, blockHeight);
        }
      }
    }

    // internal use only - friend of LayoutDivision class
    _resize(position = new Vec2(0, 0), width = 0, height = width) {
      this.#position = position;
      this.#width  =  width;
      this.#height = height;

      for (let container of this.childContainers) {
        container.resize();
      }

      for (let division of this.childDivisions) {
        division.resize();
      }
    }

    // adjust an element's position based on cell's
    // element alignment properties
    #adjustElem(elem, width, height) {
      let pos = elem.position.getCopy();

      if (this.halignElems === enums.Align.CENTER) {
        pos.x += (this.width - width) / 2;
      } else if (this.halignElems === enums.Align.RIGHT) {
        pos.x += this.width - width;
      }

      if (this.valignElems === enums.Align.MIDDLE) {
        pos.y += (this.height - height) / 2;
      } else if (this.valignElems === enums.Align.TOP) {
        pos.y += this.height - height;
      }

      elem.position = pos;
      elem.posCallback();
    }
  };

  /* 
    a division divides a container or cell into cells (smaller
    sub-rectangles)  which act as smaller,  simpler containers

    .--DIVISION----------.
    |      |      |      |
    |------|------|------|
    |      |      | CELL |
    '--------------------'
  */

  // private fields
    // a container or cell (of a division)
    #parent = null;

    // the layout of the division (rows, columns)
    #cellCount = new Vec2();
  // ...

	constructor(cellCount = new Vec2(1, 1)) {
    this.cells = new Array();
    this.cellCount = cellCount;
  }

  // getters/setters
  get parent()    { return this.#parent;    }
  get cellCount() { return this.#cellCount; }

  get position()  {
    return (this.parent !== null) ? this.parent.position : new Vec2();
  }

  get width()  {
    return (this.parent !== null) ? this.parent.width : 0;
  }

  get height()  {
    return (this.parent !== null) ? this.parent.height : 0;
  }

  set cellCount(cellCount) {
    if (!(cellCount instanceof Vec2)) {
      throw new TypeError("LayoutDivision (cellCount): should be " +
        "a Vec2");
    } else if (cellCount.x <= 0 || cellCount.y <= 0) {
      throw new RangeError("LayoutDivision (getCell): cellCount.x " +
      "and cellCount.y should both be greater than 0");
    }

    let cells = new Array();
    
    let i = 0;
    let x = 0;
    let y = 0;

    for (y = 0 ; y < this.#cellCount.y; ++y) {
      if (y < cellCount.y) {
        // copy any exisiting cells over to new array or
        // unset them if they no longer fit
        for (x = 0; x < this.#cellCount.x; ++x, ++i) {
          if (x < cellCount.x) {
            cells.push(this.cells[i]);
          } else {
            this.cells[i].removeContainer();
            this.cells[i].removeDivision();
          }
        }

        // pad any remaining spaces with a new cell
        for (; x < cellCount.x; ++x) {
          cells.push(new LayoutDivision.Cell());
        }
      } else {
        for (x = 0; x < this.#cellCount.x; ++x, ++i) {
          this.cells[i].removeContainer();
          this.cells[i].removeDivision();
        }
      }
    }

    for (; y < cellCount.y; ++y) {
      for (x = 0; x < cellCount.x; ++x) {
        cells.push(new LayoutDivision.Cell());
      }
    }

    this.cells = cells;
    this.#cellCount = cellCount;
  }
  // ...

  getCell(cell) {
    if (!(cell instanceof Vec2)) {
      throw new TypeError("LayoutDivision (getCell): cell should be " +
        "a Vec2");
    } else if (cell.x < 0 || cell.x >= this.cellCount.x) {
      throw new RangeError("LayoutDivision (getCell): cell.x should " +
        "be between 0 and cellCount.x - 1 (0 < cell.x < cellCount.x)");
    } else if (cell.y < 0 || cell.y >= this.cellCount.y) {
      throw new RangeError("LayoutDivision (getCell): cell.y should " +
        "be between 0 and cellCount.y - 1 (0 < cell.y < cellCount.y)");
    }
    
    return this.cells[cell.x + (cell.y * this.cellCount.x)];
  }

  resize() {
    const ccount = new Vec2(
      Math.max(1, this.cellCount.x),
      Math.max(1, this.cellCount.y)
    );
    
    const pos = (this.parent !== null) ?
      this.parent.position : new Vec2(0, 0);
    const winc = (this.parent !== null) ?
      this.parent.width  / Math.max(1, ccount.x) : 0;
    const hinc = (this.parent !== null) ?
      this.parent.height / Math.max(1, ccount.y) : 0;

    for (let y = 0; y < ccount.y; ++y) {
      for (let x = 0; x < ccount.x; ++x) {
        let cell = this.cells[x + (y * ccount.x)];
        cell._resize(
          new Vec2(pos.x + (winc * x), pos.y + (hinc * y)),
          winc, hinc
        );
      }
    }
  }

  // return the vertices that form the division (as line pairs) and
  // any child container/division (useful for visualising layout)
  getVertices() {
    let verts = new Array();

    if (this.parent !== null) {
      const ccount = new Vec2(
        Math.max(1, this.cellCount.x),
        Math.max(1, this.cellCount.y)
      );

      const pos = this.parent.position;
      const w =  this.parent.width;
      const h = this.parent.height;

      const winc = w / ccount.x;
      const hinc = h / ccount.y;

      verts.push(new Array());

      for (let x = 1; x < ccount.x; ++x) {
        verts.at(-1).push(new Vec2(pos.x + (winc * x),     pos.y));
        verts.at(-1).push(new Vec2(pos.x + (winc * x), pos.y + h));
      }

      for (let y = 1; y < ccount.y; ++y) {
        verts.at(-1).push(new Vec2(    pos.x, pos.y + (hinc * y)));
        verts.at(-1).push(new Vec2(pos.x + w, pos.y + (hinc * y)));
      }

      for (let cell of this.cells) {
        for (let container of cell.childContainers) {
          let childVerts = container.getVertices();
          childVerts.forEach((e) => { verts.push(e); });
        }

        for (let division of cell.childDivisions) {
          let childVerts = division.getVertices();
          childVerts.forEach((e) => { verts.push(e); });
        }
      }
    }

    return verts;
  }

  // internal use only - friend of LayoutContainer class
  _setParent(parent) {
    if (!(parent instanceof LayoutContainer) &&
      !(parent instanceof LayoutDivision.Cell) && parent !== null) {

      throw new TypeError("LayoutContainer (parent): should be a " +
        "LayoutContainer, LayoutDivision.Cell or null");
    }

    this.#parent = parent;
  }
};

export default LayoutDivision;
