import Sol from './sol.js';

import Mat4 from './mat4.js';
import Vec3 from './vec3.js';

class Transformable3D {
  // serves  as an  interface  (via  composition)  to allow a
  // class to be transformed via  3D matrix transformations -
  // an implementating class should contain a 'transformable'
  // field (exposed via a getter if private)

  //> internal properties //
  _position = new Vec3(0.0, 0.0, 0.0);
  _origin   = new Vec3(0.0, 0.0, 0.0);
  
  _transMat = new Mat4();
  _scale    = new Vec3(1.0, 1.0, 1.0);
  _rotation = new Vec3(0.0, 0.0, 0.0);

  _boundingBox = {
    lower: new Vec3(Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    upper: new Vec3(Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
  };

  //> constructor //
  constructor() {

  }

  //> getters //
  get position() { return this._position; }
  get origin()   { return this._origin;   }
  get transMat() { return this._transMat; }
  get scale()    { return this._scale;    }
  get rotation() { return this._rotation; }
  get boundingBox() { return this._boundingBox; }

  get width() {
    return this._boundingBox.upper.x - this._boundingBox.lower.x;
  }

  get height() {
    return this._boundingBox.upper.y - this._boundingBox.lower.y;
  }

  get depth() {
    return this._boundingBox.upper.z - this._boundingBox.lower.z;
  }

  //> setters //
  set position(position) {
    Sol.CheckTypes(this, "set position",
    [{position}, [Vec3]]);

    this._position = position;
  }

  set origin(origin) {
    Sol.CheckTypes(this, "set origin",
    [{origin}, [Vec3]]);

    this._origin = origin;
  }

  set transMat(transMat) {
    Sol.CheckTypes(this, "set transMat",
    [{transMat}, [Mat4]]);

    this._transMat = transMat;
  }
  
  set scale(scale) {
    Sol.CheckTypes(this, "set scale",
    [{scale}, [Vec3]]);

    this._scale = scale;
  }

  set rotation(rotation) {
    Sol.CheckTypes(this, "set rotation",
    [{rotation}, [Vec3]]);

    this._rotation = rotation;
  }

  set boundingBox(boundingBox) {
    if (typeof boundingBox !== 'object' ||
      boundingBox.lower === undefined ||
      boundingBox.upper === undefined ||
      !(boundingBox.lower instanceof Vec3) ||
      !(boundingBox.upper instanceof Vec3)) {
      
      throw new TypeError("Transformable3D (set boundingBox): should " +
        "be an Object with a Vec3 field 'lower', and a Vec3 field " +
        "'upper'");
    }

    this._boundingBox = boundingBox;
  }

  //> public methods //
  copy(other) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Transformable3D]]);

    this.position = other.position.getCopy();
		this.origin   =   other.origin.getCopy();
		
		this.transMat = other.transMat.getCopy();
		this.scale    =    other.scale.getCopy();
		this.rotation = other.rotation.getCopy();
		
    this._boundingBox = {
      lower: other.boundingBox.lower.getCopy(),
      upper: other.boundingBox.upper.getCopy()
    };
  }

  getCopy() {
    let copy = new Transformable3D();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.CheckTypes(this, "equals",
    [{other}, [Transformable3D]]);
    
    return (
      this._position.equals(other._position) &&
      this._origin.equals(other._origin)     &&
      this._transMat.equals(other._transMat) &&
      this._scale.equals(other._scale)       &&
      this._rotation.equals(other._rotation)
    );
  }

  
  asMat4() {
    // return this transformable as a matrix - that is, a
    // matrix which has all transformations applied

    let transMat = this._transMat.getCopy();

    let offsetPos = new Vec3(this.position.x - this.origin.x,
      this.position.y - this.origin.y, this.position.z - this.origin.z);
    transMat.translate(offsetPos);
    
    transMat.translate(this._origin);
    transMat.rotateEuler(this._rotation);
    transMat.scale(this._scale);
    transMat.translate(this._origin.getNegated());

    return transMat;
  }
};

export default Transformable3D;
