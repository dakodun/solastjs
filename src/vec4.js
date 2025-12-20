import Sol from './sol.js';

class Vec4 {
 // a 4-dimensional vector (x, y, z and w) with methods
  // for convenience as well as to perform common
  // mathematical operations

  //> internal properties //
  _x = 0;
  _y = 0;
  _z = 0;
  _w = 0;

  _size   = null;
  _sizeSq = null;

  //> constructor //
	constructor(x = 0, y = x, z = y, w = z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
	}

  //> getters/setters //
  get x() { return this._x; }
  get y() { return this._y; }
  get z() { return this._z; }
  get w() { return this._w; }

  get size() {
    if (this._size === null) {
      let sizeSq = this.sizeSq;
      this._size = Math.sqrt(sizeSq);
    }

    return this._size;
  }

  get sizeSq() {
    if (this._sizeSq === null) {
      this._sizeSq = (this._x * this._x) + (this._y * this._y) +
        (this._z * this._z) + (this._w * this._w);
    }

    return this._sizeSq;
  }
  
  set x(x) {
    Sol.checkTypes(this, "set x",
    [{x}, [Number]]);

    if (this._x !== x) {
      this._size   = null;
      this._sizeSq = null;
      this._x = x;
    }
  }

  set y(y) {
    Sol.checkTypes(this, "set y",
    [{y}, [Number]]);

    if (this._y !== y) {
      this._size   = null;
      this._sizeSq = null;
      this._y = y;
    }
  }

  set z(z) {
    Sol.checkTypes(this, "set z",
    [{z}, [Number]]);
    
    if (this._z !== z) {
      this._size   = null;
      this._sizeSq = null;
      this._z = z;
    }
  }

  set w(w) {
    Sol.checkTypes(this, "set w",
    [{w}, [Number]]);

    if (this._w !== w) {
      this._size   = null;
      this._sizeSq = null;
      this._w = w;
    }
  }

  set xy(xy) {
    Sol.checkTypes(this, "set xy",
    [{xy}, [Array]]);

    this.x = xy[0];
    this.y = (xy[1] !== undefined) ? xy[1] : this._x;
  }

  set xz(xz) {
    Sol.checkTypes(this, "set xz",
    [{xz}, [Array]]);

    this.x = xz[0];
    this.z = (xz[1] !== undefined) ? xz[1] : this._x;
  }

  set xw(xw) {
    Sol.checkTypes(this, "set xw",
    [{xw}, [Array]]);

    this.x = xw[0];
    this.w = (xw[1] !== undefined) ? xw[1] : this._x;
  }

  set yz(yz) {
    Sol.checkTypes(this, "set yz",
    [{yz}, [Array]]);

    this.y = yz[0];
    this.z = (yz[1] !== undefined) ? yz[1] : this._y;
  }

  set yw(yw) {
    Sol.checkTypes(this, "set yw",
    [{yw}, [Array]]);

    this.y = yw[0];
    this.w = (yw[1] !== undefined) ? yw[1] : this._y;
  }

  set zw(zw) {
    Sol.checkTypes(this, "set zw",
    [{zw}, [Array]]);

    this.z = zw[0];
    this.w = (zw[1] !== undefined) ? zw[1] : this._z;
  }

  set xyz(xyz) {
    Sol.checkTypes(this, "set xyz",
    [{xyz}, [Array]]);

    this.x = xyz[0];
    this.y = (xyz[1] !== undefined) ? xyz[1] : this._x;
    this.z = (xyz[2] !== undefined) ? xyz[2] : this._y;
  }

  set xyw(xyw) {
    Sol.checkTypes(this, "set xyw",
    [{xyw}, [Array]]);

    this.x = xyw[0];
    this.y = (xyw[1] !== undefined) ? xyw[1] : this._x;
    this.w = (xyw[2] !== undefined) ? xyw[2] : this._y;
  }

  set xzw(xzw) {
    Sol.checkTypes(this, "set xzw",
    [{xzw}, [Array]]);

    this.x = xzw[0];
    this.z = (xzw[1] !== undefined) ? xzw[1] : this._x;
    this.w = (xzw[2] !== undefined) ? xzw[2] : this._z;
  }

  set yzw(yzw) {
    Sol.checkTypes(this, "set yzw",
    [{yzw}, [Array]]);

    this.y = yzw[0];
    this.z = (yzw[1] !== undefined) ? yzw[1] : this._y;
    this.w = (yzw[2] !== undefined) ? yzw[2] : this._z;
  }

  set xyzw(xyzw) {
    Sol.checkTypes(this, "set xyzw",
    [{xyzw}, [Array]]);

    this.x = xyzw[0];
    this.y = (xyzw[1] !== undefined) ? xyzw[1] : this._x;
    this.z = (xyzw[2] !== undefined) ? xyzw[2] : this._y;
    this.w = (xyzw[3] !== undefined) ? xyzw[3] : this._z;
  }

  //> public methods //
	copy(other) {
    Sol.checkTypes(this, "copy",
    [{other}, [Vec4]]);

    this.x = other.x;
		this.y = other.y;
    this.z = other.z;
    this.w = other.w;

    this._size = other._size;
		this._sizeSq = other._sizeSq;
  }

  getCopy() {
    let copy = new Vec4();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    Sol.checkTypes(this, "equals",
    [{other}, [Vec4]], [{tolerance}, [Number]]);
    
    // don't need to compare size (squared) as its fully
    // dependent on individual components

    return (Math.abs(this._x - other._x) <= tolerance &&
      Math.abs(this._y - other._y) <= tolerance &&
      Math.abs(this._z - other._z) <= tolerance &&
      Math.abs(this._w - other._w) <= tolerance) ? true : false;
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    this._w = -this._w;
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
      this._z *= invLen;
      this._w *= invLen;

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
    Sol.checkTypes(this, "getDot",
    [{other}, [Vec4]]);

    let result = ((this._x * other._x) + (this._y * other._y) +
        (this._z * other._z) + (this._w * other._w));

    return result;
  }

  asArray() {
    return [this._x, this._y, this._z, this._w];
  }

  fromArray(arr) {
    Sol.checkTypes(this, "fromArray",
    [{arr}, [Array]]);

    // pad the input if necessary, using default value of 0
    // or the last value supplied and then assign each to
    // the corresponding property

    let result = new Array(4);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec4 (fromArray): arr[${i}] should ` +
            `be a Number`);
        }

        result[i] = arr[i];
        padValue = arr[i];
      }
    }

    if (this._x !== result[0] || this._y !== result[1]
    || this._z !== result[2] || this._w !== result[3]) {
      this._x = result[0];
      this._y = result[1];
      this._z = result[2];
      this._w = result[3];

      this._size   = null;
      this._sizeSq = null;
    }
  }
};

export default Vec4;
