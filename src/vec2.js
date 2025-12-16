import Sol from './sol.js';

class Vec2 {
  // a 2-dimensional vector (x and y) with methods
  // for convenience as well as to perform common
  // mathematical operations

  //> internal properties //
  _x = 0;
  _y = 0;

  _size   = null;
  _sizeSq = null;

  //> constructor //
	constructor(x = 0, y = x) {
    this.x = x;
    this.y = y;
	}

  //> getters/setters //
  get x() { return this._x; }
  get y() { return this._y; }

  get size() {
    if (this._size === null) {
      let sizeSq = this.sizeSq;
      this._size = Math.sqrt(sizeSq);
    }

    return this._size;
  }

  get sizeSq() {
    if (this._sizeSq === null) {
      this._sizeSq = (this._x * this._x) + 
        (this._y * this._y);
    }

    return this._sizeSq;
  }
  
  set x(x) {
    Sol.CheckTypes(this, "set x",
    [{x}, [Number]]);

    if (this._x !== x) {
      this._size   = null;
      this._sizeSq = null;
      this._x = x;
    }
  }

  set y(y) {
    Sol.CheckTypes(this, "set y",
    [{y}, [Number]]);

    if (this._y !== y) {
      this._size   = null;
      this._sizeSq = null;
      this._y = y;
    }
  }

  set xy(xy) {
    Sol.CheckTypes(this, "set xy",
    [{xy}, [Array]]);

    this.x = xy[0];
    this.y = (xy[1] !== undefined) ? xy[1] : this._x;
  }

  //> public methods //
	copy(other) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Vec2]]);

    this._x = other._x;
		this._y = other._y;

    this._size = other._size;
		this._sizeSq = other._sizeSq;
  }

  getCopy() {
    let copy = new Vec2();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    Sol.CheckTypes(this, "equals",
    [{other}, [Vec2]], [{tolerance}, [Number]]);

    // don't need to compare size (squared) as its fully
    // dependent on individual components

    return (Math.abs(this._x - other._x) <= tolerance &&
      Math.abs(this._y - other._y) <= tolerance) ? true : false;
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    if (this.size !== 0) {
      let invLen = 1 / this.size;

      this._x *= invLen;
      this._y *= invLen;

      this._size   = 1;
      this._sizeSq = 1;
    }
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    Sol.CheckTypes(this, "getDot",
    [{other}, [Vec2]]);

    let result = ((this._x * other._x) + (this._y * other._y));

    return result;
  }

  getDeterminant(other) {
    Sol.CheckTypes(this, "getDeterminant",
    [{other}, [Vec2]]);

    let result = (this._x * other._y) - (other._x * this._y);

    return result;
  }

  asArray() {
    return [this._x, this._y];
  }

  fromArray(arr) {
    Sol.CheckTypes(this, "fromArray",
    [{arr}, [Array]]);

    // pad the input if necessary, using default value of 0
    // or the last value supplied and then assign each to
    // the corresponding property

    let result = new Array(2);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec2 (fromArray): arr[${i}] should ` +
            `be a Number`);
        }

        result[i] = arr[i];
        padValue = arr[i];
      }
    }

    // don't unset size/sizeSq if nothing has changed to
    // avoid it having to be unnecessarily recalculated

    if (this._x !== result[0] || this._y !== result[1]) {
      this._x = result[0];
      this._y = result[1];

      this._size   = null;
      this._sizeSq = null;
    }
  }
};

export default Vec2;
