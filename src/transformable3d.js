import Mat4 from './mat4.js';
import Vec3 from './vec3.js';

class Transformable3D {
  /*
    serves  as an  interface  (via  composition)  to allow a
    class to be transformed via  3D matrix transformations -
    an implementating class should contain a 'transformable'
    field (exposed via a getter if private)
  */

  // private fields
    #position = new Vec3(0.0, 0.0, 0.0);
    #origin   = new Vec3(0.0, 0.0, 0.0);
    
    #transMat = new Mat4();
    #scale    = new Vec3(1.0, 1.0, 1.0);
    #rotation = new Vec3(0.0, 0.0, 0.0);

    #boundingBox = {
      lower: new Vec3(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      upper: new Vec3(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    };
  // ...

  constructor() {

  }

  // getters/setters
  get position() { return this.#position; }
  get origin()   { return this.#origin;   }
  get transMat() { return this.#transMat; }
  get scale()    { return this.#scale;    }
  get rotation() { return this.#rotation; }
  get boundingBox() { return this.#boundingBox; }

  set position(position) {
    if (!(position instanceof Vec3)) {
      throw new TypeError("Transformable3D (position): should " +
        "be a Vec3");
    }

    this.#position = position;
  }

  set origin(origin) {
    if (!(origin instanceof Vec3)) {
      throw new TypeError("Transformable3D (origin): should " +
        "be a Vec3");
    }

    this.#origin = origin;
  }

  set transMat(transMat) {
    if (!(transMat instanceof Mat4)) {
      throw new TypeError("Transformable3D (transMat): should " +
        "be a Mat4");
    }

    this.#transMat = transMat;
  }
  
  set scale(scale) {
    if (!(scale instanceof Vec3)) {
      throw new TypeError("Transformable3D (scale): should " +
        "be a Vec3");
    }

    this.#scale = scale;
  }

  set rotation(rotation) {
    if (!(rotation instanceof Vec3)) {
      throw new TypeError("Transformable3D (rotation): should " +
        "be a Vec3");
    }

    this.#rotation = rotation;
  }

  set boundingBox(boundingBox) {
    if (typeof boundingBox !== 'object' ||
      boundingBox.lower === undefined ||
      boundingBox.upper === undefined ||
      !(boundingBox.lower instanceof Vec3) ||
      !(boundingBox.upper instanceof Vec3)) {
      
      throw new TypeError("Transformable3D (boundingBox): should " +
        "be an Object with a Vec3 field 'lower', and a Vec3 field " +
        "'upper'");
    }

    this.#boundingBox = boundingBox;
  }
  // ...

  copy(other) {
    if (!(other instanceof Transformable3D)) {
      throw new TypeError("Transformable3D (copy): other should be " +
        "a Transformable3D");
    }

    this.position = other.position.getCopy();
		this.origin   =   other.origin.getCopy();
		
		this.transMat = other.transMat.getCopy();
		this.scale    =    other.scale.getCopy();
		this.rotation = other.rotation.getCopy();
		
    this.#boundingBox = {
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
    if (!(other instanceof Transformable3D)) {
      throw new TypeError("Transformable3D (equals): other should be " +
        "a Transformable3D");
    }
    
    return (
      this.#position.equals(other.#position) &&
      this.#origin.equals(other.#origin)     &&
      this.#transMat.equals(other.#transMat) &&
      this.#scale.equals(other.#scale)       &&
      this.#rotation.equals(other.#rotation)
    );
  }

  // return this transformable as a matrix - that is, a
  // matrix which has all transformations applied
  asMat4() {
    let transMat = this.#transMat.getCopy();

    let offsetPos = new Vec3(this.position.x - this.origin.x,
      this.position.y - this.origin.y, this.position.z - this.origin.z);
    transMat.translate(offsetPos);
    
    transMat.translate(this.#origin);
    transMat.rotateEuler(this.#rotation);
    transMat.scale(this.#scale);
    transMat.translate(this.#origin.getNegated());

    return transMat;
  }
};

export default Transformable3D;
