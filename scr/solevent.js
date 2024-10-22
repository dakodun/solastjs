import * as enums from './exportenums.js';

class SolEvent {
  constructor() {
    this.type = enums.Event.DEFAULT;
  }

  copy(other) {
    if (!(other instanceof SolEvent)) {
      throw new TypeError("SolEvent (copy): other should be a SolEvent");
    }
  }

  getCopy() {
    let copy = new SolEvent();
    copy.copy(this);
    
    return copy;
  }
}

export default SolEvent;
