import Sol from '../sol.js';

import SolEvent from '../solevent.js';
import Vec2 from '../vec2.js';

import * as enums from '../exportenums.js';

class SizeEvent extends SolEvent {
  //> static properties //
  static type = enums.Event.SIZE;

  //> internal properties //
  _prevDimensions = new Vec2(1);
  _newDimensions  = new Vec2(1);

  //> constructor //
  constructor(prevDimensions = new Vec2(1),
      newDimensions = new Vec2(1)) {

    super();

    this.prevDimensions = prevDimensions;
    this.newDimensions = newDimensions;
  }

  //> getters/setters //
  get type() { return SizeEvent.type; };
  get prevDimensions() { return this._prevDimensions; };
  get newDimensions()  { return this._newDimensions;  };

  set prevDimensions(prevDimensions) {
    Sol.checkTypes(this, "set prevDimensions",
        [{prevDimensions}, [Vec2]]);

    this._prevDimensions = prevDimensions;
  };

  set newDimensions(newDimensions) {
    Sol.checkTypes(this, "set newDimensions",
        [{newDimensions}, [Vec2]]);

    this._newDimensions = newDimensions;
  };

  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy",
        [{other}, [SizeEvent]]);

    this._prevDimensions.copy(other._prevDimensions);
    this._newDimensions.copy(other._newDimensions);
  }

  getCopy() {
    let copy = new SizeEvent();
    copy.copy(this);
    
    return copy;
  }

  equals(other) {
    Sol.checkTypes(this, "equals",
        [{other}, [SizeEvent]]);
    
    return (
      this._prevDimensions.equals(other._prevDimensions) &&
      this._newDimensions.equals(other._newDimensions)
    );
  }

  // [!] deprecated
  getType() {
    return this.type;
  }
}

export default SizeEvent;
