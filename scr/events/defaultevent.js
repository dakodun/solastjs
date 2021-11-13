import * as enums from '../exportenums.js';
import Event from '../event.js';

class DefaultEvent extends Event {
  constructor() {
    super();

    this.type = enums.event.default;
  }

  copy(other) {
    
  }

  getCopy() {
    let copy = new DefaultEvent(); copy.copy(this);
    return copy;
  }
}

export default DefaultEvent;
