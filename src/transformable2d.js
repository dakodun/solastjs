import Sol from './sol.js';

import Mat3 from './mat3.js';
import Vec2 from './vec2.js';

class Transformable2D {
  /*
    serves  as an  interface  (via  composition)  to allow a
    class to be transformed via  2D matrix transformations -
    an implementating class should contain a 'transformable'
    field (exposed via a getter if private)
  */

  //> internal properties //
  _position = new Vec2(0.0, 0.0);
  _origin   = new Vec2(0.0, 0.0);
  
  _transMat = new Mat3();
  _scale = new Vec2(1.0, 1.0);
  _rotation = 0;

  _boundingBox = {
    lower: new Vec2(Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY),
    upper: new Vec2(Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY)
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

  //> setters //
  set position(position) {
    Sol.CheckTypes(this, "set position",
    [{position}, [Vec2]]);

    this._position = position;
  }

  set origin(origin) {
    Sol.CheckTypes(this, "set origin",
    [{origin}, [Vec2]]);

    this._origin = origin;
  }

  set transMat(transMat) {
    Sol.CheckTypes(this, "set transMat",
    [{transMat}, [Mat3]]);

    this._transMat = transMat;
  }
  
  set scale(scale) {
    Sol.CheckTypes(this, "set scale",
    [{scale}, [Vec2]]);

    this._scale = scale;
  }

  set rotation(rotation) {
    Sol.CheckTypes(this, "set rotation",
    [{rotation}, [Number]]);

    this._rotation = rotation;
  }

  set boundingBox(boundingBox) {
    if (typeof boundingBox !== 'object' ||
      boundingBox.lower === undefined ||
      boundingBox.upper === undefined ||
      !(boundingBox.lower instanceof Vec2) ||
      !(boundingBox.upper instanceof Vec2)) {
      
      throw new TypeError("Transformable2D (set boundingBox): should " +
        "be an Object with a Vec2 field 'lower', and a Vec2 field " +
        "'upper'");
    }

    this._boundingBox = boundingBox;
  }

  //> public methods //
  copy(other) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Transformable2D]]);

    this._position = other._position.getCopy();
		this._origin   =   other._origin.getCopy();
		
		this._transMat = other._transMat.getCopy();
		this._scale = other._scale.getCopy();
		this._rotation = other._rotation;
		
    this._boundingBox = {
      lower: other.boundingBox.lower.getCopy(),
      upper: other.boundingBox.upper.getCopy()
    };
  }

  getCopy() {
    let copy = new Transformable2D();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.CheckTypes(this, "equals",
    [{other}, [Transformable2D]]);
    
    return (
      this._position.equals(other._position) &&
      this._origin.equals(other._origin)     &&
      this._transMat.equals(other._transMat) &&
      this._scale.equals(other._scale)       &&
      this._rotation === other._rotation
    );
  }

  asMat3() {
    // return this transformable as a matrix - that is, a
    // matrix which has all transformations applied

    let transMat = this._transMat.getCopy();

    let offsetPos = new Vec2(this._position.x - this._origin.x,
      this._position.y - this._origin.y);
    transMat.translate(offsetPos);
    
    transMat.translate(this._origin);
    transMat.rotate(this._rotation);
    transMat.scale(this._scale);
    transMat.translate(this._origin.getNegated());

    return transMat;
  }
};

export default Transformable2D;
