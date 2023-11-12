import * as enums from '../exportenums.js';
import Event from '../event.js';

class OrientationEvent extends Event {
  constructor() {
    super();

    this.type = enums.event.orientation;
  }

  copy(other) {
    
  }

  getCopy() {
    let copy = new OrientationEvent(); copy.copy(this);
    return copy;
  }
}

export default OrientationEvent;
