import Sol from '../sol.js';

import SolEvent from '../solevent.js';

import * as enums from '../exportenums.js';

class ExternalEvent extends SolEvent {
  //> static properties //
  static type = enums.Event.EXTERNAL;
  
  //> public properties //
  data = null;
  
  //> internal properties //
  _command = "";
  
  //> constructor //
  constructor(command = "", data = null) {
    super();
    
    this.command = command;
    this.data = data;
  }
  
  //> getters/setters //
  get type() { return ExternalEvent.type; };
  
  get command() { return this._command; }
  set command(command) {
    Sol.checkTypes(this, "set command", [{ command }, [String]]);
    
    this._command = command;
  }
  
  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy", [{ other }, [ExternalEvent]]);

    this._command = other._command;
    this.data = other.data;
  }

  getCopy() {
    let copy = new ExternalEvent();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals", [{other}, [ExternalEvent]]);
    
    return (
      this.data === other.data &&
      this._command === other._command
    );
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default ExternalEvent;
