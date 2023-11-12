import GL from './gl.js'

import LayoutDivision from './layoutdivision.js';
import LayoutParent from './layoutparent.js';
import Shape from './shape.js';
import Vec2 from './vec2.js';

class LayoutContainer {
	constructor(position, width, height, parent, cell) {
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

    this.parent = new LayoutParent(parent, cell);

    this.horizontalAlign = "left";
    this.verticalAlign = "bottom";

    this.containerHorizontalAlign = "left";
    this.containerVerticalAlign = "bottom";
  }

  getPosition(coordinateSpace) {
    let position = this.position.getCopy();

    if (coordinateSpace == "global" && this.parent.exists()) {
      let parentPosition = this.parent.getPosition(coordinateSpace);

      if (this.containerHorizontalAlign == "center") {
        position.x += (this.parent.getWidth() / 2) - (this.width / 2);
      }
      else if (this.containerHorizontalAlign == "right") {
        position.x += this.parent.getWidth() - this.width;
      }

      if (this.containerVerticalAlign == "middle") {
        position.y += (this.parent.getHeight() / 2) - (this.height / 2);
      }
      else if (this.containerVerticalAlign == "top") {
        position.y += this.parent.getHeight() - this.height;
      }

      position.x += parentPosition.x;
      position.y += parentPosition.y;
    }
    
    return position;
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;

    for (let division of this.divisions) {
      division.resizeCells();
    }
  }

  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;

    for (let division of this.divisions) {
      division.resizeCells();
    }
  }

  addContainer(container) {
    container.setParent(this);
    this.containers.push(container);
  }

  addDivision(division) {
    division.setParent(this);
    this.divisions.push(division);
  }

  setParent(parent, cell) {
    this.parent.setParent(parent, cell);
  }

  positionElements(elementList) {
    // position elements based on global container position
    let position = this.getPosition("global");

    // dimensions of entire block of elements being positioned
    let total = new Vec2(0, 0);

    // dimensions of current row of elements being positioned
    let line = new Vec2(0, 0);

    // a store of elements grouped by line
    let elementLines = new Array();
    elementLines.push([0, []]);

    // store container dimension values used for positioning
    let halfWidth = this.width / 2;
    let halfHeight = this.height / 2;

    for (let element of elementList) {
      if (element.float) {
        // a floating element doesn't account for any other elements
        // so position it based on alignment and container size

        element.position = position;

        if (this.horizontalAlign == "center") {
          element.position.x += halfWidth - (element.width / 2);
        }
        else if (this.horizontalAlign == "right") {
          element.position.x += this.width - element.width;
        }

        if (this.verticalAlign == "middle") {
          element.position.y += halfHeight - (element.height / 2);
        }
        else if (this.verticalAlign == "top") {
          element.position.y += this.height - element.height;
        }
      }
      else {
        if (line.x + element.width <= this.width &&
            total.y + element.height <= this.height) { // if the element
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
        else if (element.width <= this.width &&
            (line.y + total.y) + element.height <= this.height) {
          
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
    let widthGap = this.width - total.x;
    let heightGap = this.height - total.y;
    let halfWidthGap = widthGap / 2;
    let halfHeightGap = heightGap / 2;

    for (let elementLine of elementLines) { // for all element lines...
      let elements = elementLine[1];
      for (let element of elements) { // for all elements in
        // current line...
        
        if (this.horizontalAlign == "center") {
          element.position.x += halfWidthGap;
        }
        else if (this.horizontalAlign == "right") {
          element.position.x += widthGap;
        }

        if (this.verticalAlign == "middle") {
          element.position.y += halfHeightGap;
        }
        else if (this.verticalAlign == "top") {
          element.position.y += heightGap;
        }
      }
    }
  }

  getShapes() {
    let shapes = new Array();

    let shape = new Shape();
    shape.pushVert(new Vec2(       0.0,         0.0));
    shape.pushVert(new Vec2(this.width,         0.0));
    shape.pushVert(new Vec2(this.width, this.height));
    shape.pushVert(new Vec2(       0.0, this.height));

    shape.setRenderMode(GL.LINE_LOOP);

    shape.setPosition(this.getPosition("global"));
    shape.depth = -5;
    shapes.push(shape);

    for (let container of this.containers) {
      let childShapes = container.getShapes();
      shapes = shapes.concat(childShapes);
    }

    for (let division of this.divisions) {
      let childShapes = division.getShapes();
      shapes = shapes.concat(childShapes);
    }

    return shapes;
  }
};

export default LayoutContainer;
