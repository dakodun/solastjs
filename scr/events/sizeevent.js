import * as enums from '../exportenums.js';
import Event from '../event.js';

class SizeEvent extends Event {
  constructor() {
    super();

    this.type = enums.event.size;
  }

  copy(other) {
    
  }

  getCopy() {
    let copy = new SizeEvent(); copy.copy(this);
    return copy;
  }
}

export default SizeEvent;
