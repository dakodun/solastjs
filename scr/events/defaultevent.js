import * as enums from "../exportenums.js";
import Event from "../event.js";

class DefaultEvent extends Event {
  static type = enums.Event.DEFAULT;
  
  constructor() {
    super();
  }

  copy(other) {
    if (!(other instanceof DefaultEvent)) {
      throw new TypeError("DefaultEvent (copy): other should " +
        "be a DefaultEvent");
    }
  }

  getCopy() {
    let copy = new DefaultEvent();
    copy.copy(this);

    return copy;
  }
}

export default DefaultEvent;
