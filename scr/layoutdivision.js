import GL from './gl.js'

import LayoutContainer from './layoutcontainer.js';
import LayoutParent from './layoutparent.js';
import Shape from './shape.js';
import Vec2 from './vec2.js';

class LayoutDivision {
  static Cell = class {
    constructor(position, width, height) {
      this.position = new Vec2(0.0, 0.0);
      if (position != undefined) {
        this.position.copy(position);
      }

      this.width = 1;
      if (width != undefined) {
        this.width = width;
      }

      this.height = 1;
      if (height != undefined) {
        this.height = height;
      }

      this.containers = new Array();
      this.divisions = new Array();

      this.horizontalAlign = "left";
      this.verticalAlign = "bottom";
    }
  };

	constructor(cellCount, parent, cell) {
    this.cellCount = new Vec2(1, 1);
    if (cellCount != undefined) {
      this.cellCount.copy(cellCount);
    }

    this.parent = new LayoutParent(parent, cell);

    this.createCells();
  }

  getPosition(coordinateSpace) {
    return this.parent.getPosition(coordinateSpace);
  }

  getWidth() {
    return this.parent.getWidth();
  }

  getHeight() {
    return this.parent.getHeight();
  }

  getCellPosition(cell, coordinateSpace) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      let position = this.cells[cellIndex].position.getCopy();
      
      if (coordinateSpace == "global" && this.parent.exists()) {
        let parentPosition = this.parent.getPosition(coordinateSpace);

        position.x += parentPosition.x;
        position.y += parentPosition.y;
      }

      return position;
    }
  }

  getCellWidth(cell) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      return this.cells[cellIndex].width;
    }
  }

  getCellHeight(cell) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      return this.cells[cellIndex].height;
    }
  }

  getCellHorizontalAlign(cell) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      return this.cells[cellIndex].horizontalAlign;
    }
  }

  setCellHorizontalAlign(cell, align) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      this.cells[cellIndex].horizontalAlign = align;
    }
  }

  getCellVerticalAlign(cell) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      return this.cells[cellIndex].verticalAlign;
    }
  }

  setCellVerticalAlign(cell, align) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);
      this.cells[cellIndex].verticalAlign = align;
    }
  }

  addContainer(cell, container) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);

      container.setParent(this, cell);
      this.cells[cellIndex].containers.push(container);
    }
  }

  addDivision(cell, division) {
    if (cell.x < this.cellCount.x || cell.y < this.cellCount.y) {
      let cellIndex = cell.x + (cell.y * this.cellCount.x);

      division.setParent(this, cell);
      this.cells[cellIndex].divisions.push(division);
    }
  }

  setParent(parent) {
    this.parent.setParent(parent);
    this.resizeCells();
  }

  positionElements(cell, elementList) {
    // position elements based on global container position
    let position = this.getCellPosition(cell, "global");

    // dimensions of entire block of elements being positioned
    let total = new Vec2(0, 0);

    // dimensions of current row of elements being positioned
    let line = new Vec2(0, 0);

    // a store of elements grouped by line
    let elementLines = new Array();
    elementLines.push([0, []]);

    // store container dimension values used for positioning
    let width = this.getCellWidth(cell);
    let height = this.getCellHeight(cell);
    let halfWidth = width / 2;
    let halfHeight = height / 2;

    let halign = this.getCellHorizontalAlign(cell);
    let valign = this.getCellVerticalAlign(cell);

    for (let element of elementList) {
      if (element.float) {
        // a floating element doesn't account for any other elements
        // so position it based on alignment and container size

        element.position = position;

        if (halign == "center") {
          element.position.x += halfWidth - (element.width / 2);
        }
        else if (halign == "right") {
          element.position.x += width - element.width;
        }

        if (valign == "middle") {
          element.position.y += halfHeight - (element.height / 2);
        }
        else if (valign == "top") {
          element.position.y += height - element.height;
        }
      }
      else {
        if (line.x + element.width <= width &&
            total.y + element.height <= height) { // if the element
          // fits into the current line...
          
          // position the element based on the current line offset and add
          // it to the current row
          element.position = new Vec2(position.x + line.x,
            position.y + total.y);
          elementLines[elementLines.length - 1][1].push(element);

          // update the current line dimensions
          line.x += element.width;
          line.y = Math.max(element.height, line.y);
        }
        else if (element.width <= width &&
            (line.y + total.y) + element.height <= height) {
          
          // update current line max height and then add a new row
          elementLines[elementLines.length - 1][0] = line.y;
          elementLines.push([0, []]);

          // update the block size and reset the current line dimensions
          total.x = Math.max(line.x, total.x);
          total.y += line.y;
          line.x = 0;
          line.y = 0

          element.position = new Vec2(position.x + line.x,
            position.y + total.y);
          elementLines[elementLines.length - 1][1].push(element);

          line.x += element.width;
          line.y = Math.max(element.height, line.y);
        }
      }
    }

    // update the last line dimensions and total block size
    elementLines[elementLines.length - 1][0] = line.y;
    total.x = Math.max(line.x, total.x);
    total.y += line.y;

    // store values for remaining space used for alignment positioning
    let widthGap = width - total.x;
    let heightGap = height - total.y;
    let halfWidthGap = widthGap / 2;
    let halfHeightGap = heightGap / 2;

    for (let elementLine of elementLines) { // for all element lines...
      let elements = elementLine[1];
      for (let element of elements) { // for all elements in
        // current line...

        if (halign == "center") {
          element.position.x += halfWidthGap;
        }
        else if (halign == "right") {
          element.position.x += widthGap;
        }

        if (valign == "middle") {
          element.position.y += halfHeightGap;
        }
        else if (valign == "top") {
          element.position.y += heightGap;
        }
      }
    }
  }

  resizeCells() {
    if (this.cellCount.x != 0 && this.cellCount.y != 0) {
      let widthInc = this.getWidth() / this.cellCount.x;
      let heightInc = this.getHeight() / this.cellCount.y;

      for (let y = 0; y < this.cellCount.y; ++y) {
        for (let x = 0; x < this.cellCount.x; ++x) {
          let cellIndex = x + (y * this.cellCount.x);

          this.cells[cellIndex].position = new Vec2(widthInc * x,
            heightInc * y);
          this.cells[cellIndex].width = widthInc;
          this.cells[cellIndex].height = heightInc;
        }
      }

      for (let cell of this.cells) {
        for (let division of cell.divisions) {
          division.resizeCells();
        }
      }
    }
  }

  createCells() {
    if (this.cellCount.x != 0 && this.cellCount.y != 0) {
      let cells = new Array();

      let widthInc = this.getWidth() / this.cellCount.x;
      let heightInc = this.getHeight() / this.cellCount.y;

      for (let y = 0; y < this.cellCount.y; ++y) {
        for (let x = 0; x < this.cellCount.x; ++x) {
          let cell = new LayoutDivision.Cell(
            new Vec2(widthInc * x, heightInc * y), widthInc, heightInc
          );

          cells.push(cell);
        }
      }

      this.cells = cells.slice();
    }
  }

  getShapes() {
    let shapes = new Array();

    let width = this.getWidth();
    let height = this.getHeight();

    let widthInc = width / this.cellCount.x;
    let heightInc = height / this.cellCount.y;

    let shape = new Shape();

    for (let x = 1; x < this.cellCount.x; ++x) {
      shape.pushVert(new Vec2(widthInc * x,    0.0));
      shape.pushVert(new Vec2(widthInc * x, height));
    }

    for (let y = 1; y < this.cellCount.y; ++y) {
      shape.pushVert(new Vec2(  0.0, heightInc * y));
      shape.pushVert(new Vec2(width, heightInc * y));
    }

    shape.setRenderMode(GL.LINES);

    shape.setPosition(this.getPosition("global"));
    shape.depth = -5;
    shapes.push(shape);

    for (let cell of this.cells) {
      for (let container of cell.containers) {
        let childShapes = container.getShapes();
        shapes = shapes.concat(childShapes);
      }

      for (let division of cell.divisions) {
        let childShapes = division.getShapes();
        shapes = shapes.concat(childShapes);
      }
    }

    return shapes;
  }
};

export default LayoutDivision;
