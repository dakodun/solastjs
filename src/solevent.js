import * as enums from './exportenums.js';

class SolEvent {
  static type = enums.Event.DEFAULT;

  constructor() {
    
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

  getType() {
    return SolEvent.type;
  }
}

export default SolEvent;
