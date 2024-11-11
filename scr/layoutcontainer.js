import LayoutDivision from './layoutdivision.js';
import List from './list.js';
import Vec2 from './vec2.js';

import * as enums from "./exportenums.js";

class LayoutContainer {
  /* 
    a 2d rectangular area on the screen that contains elements and
    other containers, and can be divided into cells via a division

    .--CONTAINER---------.
    |                    |
    |                    |
    |                    |
    '--------------------'
  */

  // private fields
    // a container or cell (of a division)
    #parent = null;

    // the supplied dimensions of the container before any modifications
    #inPosition = new Vec2();
    #inWidth  = 0;
    #inHeight = 0;

    // the dimensions of the container accounting for relative sizing and
    // optional clipping to parent dimensions
    #outPosition = new Vec2();
    #outWidth  = 0;
    #outHeight = 0;

    // container alignment
    #halign  =      enums.Align.LEFT;
    #hsizing = enums.Sizing.ABSOLUTE;
    #valign  =    enums.Align.BOTTOM;
    #vsizing = enums.Sizing.ABSOLUTE;

    // elements alignment
    #halignElems =   enums.Align.LEFT;
    #valignElems = enums.Align.BOTTOM;
  // ...
  
  constructor(position = new Vec2(0, 0), width = 0, height = width) {
    this.childContainers = new Set();
    this.childDivisions  = new Set();

    this.clipped  = false;
    this.overflow = false;
    
    this.position = position;
    this.width  =  width;
    this.height = height;
  }

  // getters/setters
  get parent()   { return this.#parent;      }
  get position() { return this.#outPosition; }
  get width()    { return this.#outWidth;    }
  get height()   { return this.#outHeight;   }
  get halign()  { return this.#halign;  }
  get hsizing() { return this.#hsizing; }
  get valign()  { return this.#valign;  }
  get vsizing() { return this.#vsizing; }
  get halignElems() { return this.#halignElems; }
  get valignElems() { return this.#valignElems; }

  set position(position) {
    if (!(position instanceof Vec2)) {
      throw new TypeError("LayoutContainer (position): should be " +
        "a Vec2");
    }
    
    this.#inPosition = position;
    this.#outPosition.copy(position);
  }

  set width(width) {
    if (typeof width !== 'number') {
      throw new TypeError("LayoutContainer (width): should be " +
        "a Number");
    }

    this.#inWidth  = width;
    this.#outWidth = width;
  }

  set height(height) {
    if (typeof height !== 'number') {
      throw new TypeError("LayoutContainer (height): should be " +
        "a Number");
    }

    this.#inHeight  = height;
    this.#outHeight = height;
  }

  set halign(halign)  {
    if (typeof halign !== 'string') {
      throw new TypeError("LayoutContainer (halign): should be " +
        "a String");
    }

    this.#halign = (
      halign === enums.Align.CENTER ||
      halign === enums.Align.RIGHT
      ) ? halign : enums.Align.LEFT;
  }

  set hsizing(hsizing)  {
    if (typeof hsizing !== 'string') {
      throw new TypeError("LayoutContainer (hsizing): should be " +
        "a String");
    }

    this.#hsizing = (
      hsizing === enums.Sizing.RELATIVE
      ) ? hsizing : enums.Sizing.ABSOLUTE;
  }

  set valign(valign)  {
    if (typeof valign !== 'string') {
      throw new TypeError("LayoutContainer (valign): should be " +
        "a String");
    }

    this.#valign = (
      valign === enums.Align.MIDDLE ||
      valign === enums.Align.TOP
      ) ? valign : enums.Align.BOTTOM;
  }

  set vsizing(vsizing)  {
    if (typeof vsizing !== 'string') {
      throw new TypeError("LayoutContainer (vsizing): should be " +
        "a String");
    }

    this.#vsizing = (
      vsizing === enums.Sizing.RELATIVE
      ) ? vsizing : enums.Sizing.ABSOLUTE;
  }

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

  resize() {
    this.#outPosition.copy(this.#inPosition);
    this.#outWidth  =  this.#inWidth;
    this.#outHeight = this.#inHeight;

    if (this.parent !== null) {
      // calculate dimensions of container based on sizing property
      if (this.hsizing === enums.Sizing.RELATIVE) {
        let ratio = Math.min(100, Math.max(0,  this.#inWidth)) / 100;
        this.#outWidth = this.parent.width * ratio;
      }

      if (this.vsizing === enums.Sizing.RELATIVE) {
        let ratio = Math.min(100, Math.max(0,  this.#inHeight)) / 100;
        this.#outHeight = this.parent.height * ratio;
      }
      // ...

      // adjust position of container based on alignment property
      this.#outPosition.x += this.parent.position.x;
      if (this.halign === enums.Align.CENTER) {
        this.position.x += (this.parent.width / 2) -
          (this.#outWidth / 2);
      } else if (this.halign === enums.Align.RIGHT) {
        this.position.x += this.parent.width - this.#outWidth;
      }

      this.#outPosition.y += this.parent.position.y;
      if (this.valign === enums.Align.MIDDLE) {
        this.position.y += (this.parent.height / 2) -
          (this.#outHeight / 2);
      } else if (this.valign === enums.Align.TOP) {
        this.position.y += this.parent.height - this.#outHeight;
      }
      // ...

      if (this.clipped) {
        // clip the upper left side by removing any offset that
        // crosses the upper left bounds of the parent
        this.#outPosition.xy = [
          Math.min(Math.max(this.position.x, this.parent.position.x),
            this.parent.position.x + this.parent.width),
          Math.min(Math.max(this.position.y, this.parent.position.y),
            this.parent.position.y + this.parent.height)
        ];

        // clip the lower right side by reducing the width and
        // height, accounting for any offset from parent and a
        // negative width or height
        let posDiff = new Vec2(
          this.position.x - this.parent.position.x,
          this.position.y - this.parent.position.y
        );

        this.#outWidth = Math.max(
          Math.min(this.#outWidth, this.parent.width - (posDiff.x)), 0
        );

        this.#outHeight = Math.max(
          Math.min(this.#outHeight, this.parent.height - posDiff.y), 0
        );
        // ...
      }
    }

    for (let container of this.childContainers) {
      container.resize();
    }

    for (let division of this.childDivisions) {
      division.resize();
    }
  }

  addContainer(container) {
    if (!(container instanceof LayoutContainer)) {
      throw new TypeError("LayoutContainer (addContainer): " +
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
      throw new TypeError("LayoutContainer (removeContainer): " +
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
      throw new TypeError("LayoutContainer (addDivision): division " +
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
      throw new TypeError("LayoutContainer (removeDivision): division " +
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
        // the element is floating and doesn't need to account
        // for other elements in the container

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
          // element doesn't fit on this line so update current line
          // width and block height and add a new line

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

  // return the vertices that form the container (as line pairs) and
  // any child container/division (useful for visualising layout)
  getVertices() {
    let verts = new Array();

    const pos = this.position;
    const w =  this.width;
    const h = this.height;

    verts.push(new Array());
    verts.at(-1).push(new Vec2(    pos.x,     pos.y));
    verts.at(-1).push(new Vec2(pos.x + w,     pos.y));

    verts.at(-1).push(new Vec2(pos.x + w,     pos.y));
    verts.at(-1).push(new Vec2(pos.x + w, pos.y + h));

    verts.at(-1).push(new Vec2(pos.x + w, pos.y + h));
    verts.at(-1).push(new Vec2(    pos.x, pos.y + h));
  
    verts.at(-1).push(new Vec2(    pos.x, pos.y + h));
    verts.at(-1).push(new Vec2(    pos.x,     pos.y));

    for (let container of this.childContainers) {
      let childVerts = container.getVertices();
      childVerts.forEach((e) => { verts.push(e); });
    }

    for (let division of this.childDivisions) {
      let childVerts = division.getVertices();
      childVerts.forEach((e) => { verts.push(e); });
    }

    return verts;
  }

  // internal use only - friend of LayoutDivision class
  _setParent(parent) {
    if (!(parent instanceof LayoutContainer) &&
      !(parent instanceof LayoutDivision.Cell) && parent !== null) {

      throw new TypeError("LayoutContainer (parent): should be a " +
        "LayoutContainer, LayoutDivision.Cell or null");
    }

    this.#parent = parent;
  }

  // adjust an element's position based on container's
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

export default LayoutContainer;
