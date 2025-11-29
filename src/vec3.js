import Sol from './sol.js';

class Vec3 {
  // a 3-dimensional vector (x, y and z) with methods
  // for convenience as well as to perform common
  // mathematical operations

  //> internal properties //
  _x = 0;
  _y = 0;
  _z = 0;

  //> constructor //
	constructor(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
	}

  //> getters/setters //
  get x() { return this._x; }
  get y() { return this._y; }
  get z() { return this._z; }
  
  set x(x) {
    Sol.CheckTypes(this, "set x",
    [{x}, [Number]]);

    this._x = x;
  }

  set y(y) {
    Sol.CheckTypes(this, "set y",
    [{y}, [Number]]);

    this._y = y;
  }

  set z(z) {
    Sol.CheckTypes(this, "set z",
    [{z}, [Number]]);

    this._z = z;
  }

  set xy(xy) {
    Sol.CheckTypes(this, "set xy",
    [{xy}, [Array]]);

    this.x = xy[0];
    this.y = (xy[1] !== undefined) ? xy[1] : this._x;
  }

  set xz(xz) {
    Sol.CheckTypes(this, "set xz",
    [{xz}, [Array]]);

    this.x = xz[0];
    this.z = (xz[1] !== undefined) ? xz[1] : this._x;
  }

  set yz(yz) {
    Sol.CheckTypes(this, "set yz",
    [{yz}, [Array]]);

    this.y = yz[0];
    this.z = (yz[1] !== undefined) ? yz[1] : this._y;
  }

  set xyz(xyz) {
    Sol.CheckTypes(this, "set xyz",
    [{xyz}, [Array]]);

    this.x = xyz[0];
    this.y = (xyz[1] !== undefined) ? xyz[1] : this._x;
    this.z = (xyz[2] !== undefined) ? xyz[2] : this._y;
  }

  //> public methods //
	copy(other) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Vec3]]);

    this._x = other._x;
		this._y = other._y;
    this._z = other._z;
  }

  getCopy() {
    let copy = new Vec3();
    copy.copy(this);

    return copy;
  }

  equals(other, tolerance = 0) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Vec3]], [{tolerance}, [Number]]);

    return (Math.abs(this._x - other._x) <= tolerance &&
      Math.abs(this._y - other._y) <= tolerance &&
      Math.abs(this._z - other._z) <= tolerance) ? true : false;
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
  }

  getNegated() {
    let negated = this.getCopy();
    negated.negate();

    return negated;
  }

  normalize() {
    let len = Math.sqrt((this._x * this._x) + (this._y * this._y) +
        (this._z * this._z));

    if (len !== 0) {
      let invLen = 1 / len;

      this._x *= invLen;
      this._y *= invLen;
      this._z *= invLen;
    }
  }

  getNormalized() {
    let normalized = this.getCopy();
    normalized.normalize();

    return normalized;
  }

  getDot(other) {
    Sol.CheckTypes(this, "getDot",
    [{other}, [Vec3]]);

    let result = ((this._x * other._x) + (this._y * other._y) +
        (this._z * other._z));

    return result;
  }

  getCross(other) {
    Sol.CheckTypes(this, "getCross",
    [{other}, [Vec3]]);

    let result = new Vec3(
      ((this._y * other._z) - (this._z * other._y)),
      ((this._z * other._x) - (this._x * other._z)),
      ((this._x * other._y) - (this._y * other._x))
    );

    return result;
  }

  asArray() {
    return [this._x, this._y, this._z];
  }

  fromArray(arr) {
    Sol.CheckTypes(this, "fromArray",
    [{arr}, [Array]]);

    // pad the input if necessary, using default value of 0
    // or the last value supplied and then assign each to
    // the corresponding property

    let result = new Array(3);
    let padValue = 0;

    for (let i = 0; i < result.length; ++i) {
      result[i] = padValue;

      if (arr[i] !== undefined) {
        if (typeof arr[i] !== 'number') {
          throw new TypeError(`Vec3 (fromArray): arr[${i}] should ` +
          `be a Number`);
        }

        result[i] = arr[i];
        padValue = arr[i];
      }
    }

    this._x = result[0];
    this._y = result[1];
    this._z = result[2];
  }
};

export default Vec3;
