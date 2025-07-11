import * as enums from '../exportenums.js';
import SolEvent from '../solevent.js';
import Vec2 from '../vec2.js';

class SizeEvent extends SolEvent {
  static type = enums.Event.SIZE;

  constructor(prevDimensions, newDimensions) {
    super();

    this.prevDimensions = new Vec2(1);
    if (prevDimensions !== undefined) {
      if (!(prevDimensions instanceof Vec2)) {
        throw new TypeError("Vec2 (constructor): prevDimensions " +
          "should be a Vec2");
      }

      this.prevDimensions.copy(prevDimensions);
    }
    
    this.newDimensions = new Vec2(1);
    if (newDimensions !== undefined) {
      if (!(newDimensions instanceof Vec2)) {
        throw new TypeError("Vec2 (constructor): newDimensions " +
          "should be a Vec2");
      }

      this.newDimensions.copy(newDimensions);
    }
  }

  copy(other) {
    if (!(other instanceof SizeEvent)) {
      throw new TypeError("SizeEvent (copy): other should " +
        "be a SizeEvent");
    }

    this.prevDimensions = other.prevDimensions.getCopy();
    this.newDimensions  =  other.newDimensions.getCopy();
  }

  getCopy() {
    let copy = new SizeEvent();
    copy.copy(this);
    
    return copy;
  }

  getType() {
    return SizeEvent.type;
  }
}

export default SizeEvent;
