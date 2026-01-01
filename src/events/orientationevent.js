import Sol from '../sol.js';

import SolEvent from '../solevent.js';

import * as enums from '../exportenums.js';

class OrientationEvent extends SolEvent {
  //> static properties //
  static type = enums.Event.ORIENTATION;

  //> constructor //
  constructor() {
    super();
  }

  //> getters //
  get type() { return OrientationEvent.type; };

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
        [{other}, [OrientationEvent]]);
  }

  getCopy() {
    let copy = new OrientationEvent();
    copy.copy(this);
    
    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
        [{other}, [OrientationEvent]]);
    
    return true;
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default OrientationEvent;
