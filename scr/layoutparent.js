import Vec2 from './vec2.js'

class LayoutParent {
	constructor(parent, cell) {
    this.parent = null;
    this.cell = null;

    this.setParent(parent, cell);
  }

  setParent(parent, cell) {
    if (parent == null) {
      this.parent = null;
      this.cell = null;
    }
    else if (parent != undefined) {
      this.parent = parent;

      if (cell != undefined) {
        this.cell = cell.getCopy();
      }
    }
  }

  getPosition(coordinateSpace) {
    if (this.parent != null) {
      if (this.cell != null) {
        return this.parent.getCellPosition(this.cell, coordinateSpace);
      }

      return this.parent.getPosition(coordinateSpace);
    }

    return 1;
  }

  getWidth() {
    if (this.parent != null) {
      if (this.cell != null) {
        return this.parent.getCellWidth(this.cell);
      }

      return this.parent.getWidth();
    }

    return 1;
  }

  getHeight() {
    if (this.parent != null) {
      if (this.cell != null) {
        return this.parent.getCellHeight(this.cell);
      }

      return this.parent.getHeight();
    }

    return 1;
  }

  exists() {
    if (this.parent != null) {
      return true;
    }

    return false;
  }
};

export default LayoutParent;
