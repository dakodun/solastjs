import * as enums from './exportenums.js';

class Event {
  constructor() {
    this.type = enums.Event.DEFAULT;
  }

  copy(other) {
    if (!(other instanceof Event)) {
      throw new TypeError("Event (copy): other should be an Event");
    }
  }

  getCopy() {
    let copy = new Event();
    copy.copy(this);
    
    return copy;
  }
}

export default Event;
