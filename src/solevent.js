import Sol from './sol.js';

import * as enums from './exportenums.js';

class SolEvent {
  //> static properties //
  static type = enums.Event.DEFAULT;

  //> constructor //
  constructor() {
    
  }

  //> getters //
  get type() { return SolEvent.type; };

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
        [{other}, [SolEvent]]);
  }

  getCopy() {
    let copy = new SolEvent();
    copy.copy(this);
    
    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
        [{other}, [SolEvent]]);
    
    return true;
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default SolEvent;
