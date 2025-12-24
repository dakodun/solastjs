import Sol from '../sol.js'

import SolEvent from '../solevent.js';

import * as enums from '../exportenums.js';

class FullscreenEvent extends SolEvent {
  //> static properties //
  static type = enums.Event.FULLSCREEN;

  //> public properties //
  success = false;
  status = 0;

  //> constructor //
  constructor(success, status) {
    super();

    this.success = success;
    this.status = status;
  }

  //> getters //
  get type() { return FullscreenEvent.type; };

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
    [{other}, [FullscreenEvent]]);

    this.success = other.success;
    this.status = other.status;
  }

  getCopy() {
    let copy = new FullscreenEvent();
    copy.copy(this);
    
    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
    [{other}, [FullscreenEvent]]);
    
    return (
      this.success === other.success &&
      this.status === other.status
    );
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default FullscreenEvent;
