import Sol from '../sol.js';

import SolEvent from '../solevent.js';

import * as enums from '../exportenums.js';

class DefaultEvent extends SolEvent {
  //> static properties //
  static type = enums.Event.DEFAULT;
  
  //> constructor //
  constructor() {
    super();
  }

  //> getters //
  get type() { return DefaultEvent.type; };

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
        [{other}, [DefaultEvent]]);
  }

  getCopy() {
    let copy = new DefaultEvent();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
        [{other}, [DefaultEvent]]);
    
    return true;
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default DefaultEvent;
