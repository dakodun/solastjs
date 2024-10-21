import * as enums from '../exportenums.js';
import Event from '../event.js';

class OrientationEvent extends Event {
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
}

export default OrientationEvent;
