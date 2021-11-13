import * as enums from './exportenums.js';

class Event {
  constructor() {
    this.type = enums.event.default;
  }

  copy(other) {
    
  }

  getCopy() {
    let copy = new Event(); copy.copy(this);
    return copy;
  }
}

export default Event;
