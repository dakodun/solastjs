import Sol from '../sol.js';

import SolEvent from '../solevent.js';

import * as enums from '../exportenums.js';

class FullscreenEvent extends SolEvent {
  //> static enums //
  static Status = {
    ENTER : 0,
    EXIT  : 1
  };

  //> static properties //
  static type = enums.Event.FULLSCREEN;

  //> public properties //
  success = false;

  //> internal properties //
  _status = 0;

  //> constructor //
  constructor(success = false, status = 0) {
    super();

    this.success = success;
    this.status = status;
  }

  //> getters/setters //
  get type() { return FullscreenEvent.type; };
  get status() { return this._status; }

  set status(status) {
    Sol.checkTypes(this, "set status",
        [{status}, [Number]]);

    this._status = status;
  }

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
        [{other}, [FullscreenEvent]]);

    this.success = other.success;
    this._status = other._status;
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
      this._status === other._status
    );
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default FullscreenEvent;
