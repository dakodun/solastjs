import * as enums from '../exportenums.js';
import Event from '../event.js';

class SizeEvent extends Event {
  constructor() {
    super();

    this.type = enums.event.size;
    
    this.width = 0;
    this.height = 0;

    this.oldWidth = 0;
    this.oldHeight = 0;
  }

  copy(other) {
    
  }

  getCopy() {
    let copy = new SizeEvent(); copy.copy(this);
    return copy;
  }
}

export default SizeEvent;
