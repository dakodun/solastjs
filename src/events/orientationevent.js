import * as enums from '../exportenums.js';
import SolEvent from '../solevent.js';

class OrientationEvent extends SolEvent {
  static type = enums.Event.ORIENTATION;

  constructor() {
    super();
  }

  copy(other) {
    if (!(other instanceof OrientationEvent)) {
      throw new TypeError("OrientationEvent (copy): other should " +
        "be a OrientationEvent");
    }
  }

  getCopy() {
    let copy = new OrientationEvent();
    copy.copy(this);
    
    return copy;
  }

  getType() {
    return OrientationEvent.type;
  }
}

export default OrientationEvent;
