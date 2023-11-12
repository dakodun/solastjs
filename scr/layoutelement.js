import Vec2 from './vec2.js'

class LayoutElement {
	constructor() {
    this.float = false;

    this.position = new Vec2(0.0, 0.0);
    this.width = 0;
    this.height = 0;
  }
};

export default LayoutElement;
