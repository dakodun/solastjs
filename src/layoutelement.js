import Vec2 from './vec2.js'

class LayoutElement {
  /*
    elements are positioned within a parent container or division
    cell  depending  on  properties  of both  it and  the  parent
  */

  // private fields
    #position = new Vec2(0, 0);
    #offset   = new Vec2(0, 0);

    #width  = 0;
    #height = 0;

    #posCallback = () => { };
  // ...
  
	constructor(width = 0, height = width) {
    // a floating element isn't affected by and doesn't affect
    // other elements in the same container or cell
    this.float = false;

    this.width  =  width;
    this.height = height;
  }

  // getters/setters
  get position() { return this.#position; }
  get offset()   { return this.#offset;   }
  get width()  { return this.#width;  }
  get height() { return this.#height; }
  get posCallback() { return this.#posCallback; }

  set position(position) {
    if (!(position instanceof Vec2)) {
      throw new TypeError("LayoutElement (position): should be " +
        "a Vec2");
    }

    this.#position = position;

    if (this.float) {
      this.#position.x += this.offset.x;
      this.#position.y += this.offset.y;
    }
  }

  set offset(offset) {
    if (!(offset instanceof Vec2)) {
      throw new TypeError("LayoutElement (offset): should be " +
        "a Vec2");
    }

    this.#offset = offset;
  }

  set width(width) {
    if (typeof width !== 'number') {
      throw new TypeError("LayoutElement (width): should be " +
        "a Number");
    }

    this.#width = width;
  }

  set height(height) {
    if (typeof height !== 'number') {
      throw new TypeError("LayoutElement (height): should be " +
        "a Number");
    }

    this.#height = height;
  }

  set posCallback(posCallback) {
    if (typeof posCallback !== 'function') {
      throw new TypeError("LayoutElement (posCallback): should be " +
        "a Function");
    }

    this.#posCallback = posCallback;
  }
  // ...
};

export default LayoutElement;
