import Mat3 from './mat3.js';
import Vec2 from './vec2.js';

class Transformable2D {
  /*
    serves  as an  interface  (via  composition)  to allow a
    class to be transformed via  2D matrix transformations -
    an implementating class should contain a 'transformable'
    field (exposed via a getter if private)
  */

  // private fields
    #position = new Vec2(0.0, 0.0);
    #origin   = new Vec2(0.0, 0.0);
    
    #transMat = new Mat3();
    #scale = new Vec2(1.0, 1.0);
    #rotation = 0;

    #boundingBox = {
      lower: new Vec2(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY),
      upper: new Vec2(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY)
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
    if (!(position instanceof Vec2)) {
      throw new TypeError("Transformable2D (position): should " +
        "be a Vec2");
    }

    this.#position = position;
  }

  set origin(origin) {
    if (!(origin instanceof Vec2)) {
      throw new TypeError("Transformable2D (origin): should " +
        "be a Vec2");
    }

    this.#origin = origin;
  }

  set transMat(transMat) {
    if (!(transMat instanceof Mat3)) {
      throw new TypeError("Transformable2D (transMat): should " +
        "be a Mat3");
    }

    this.#transMat = transMat;
  }
  
  set scale(scale) {
    if (!(scale instanceof Vec2)) {
      throw new TypeError("Transformable2D (scale): should " +
        "be a Vec2");
    }

    this.#scale = scale;
  }

  set rotation(rotation) {
    if (typeof rotation !== 'number') {
      throw new TypeError("Transformable2D (rotation): should " +
        "be a Number");
    }

    this.#rotation = rotation;
  }

  set boundingBox(boundingBox) {
    if (typeof boundingBox !== 'object' ||
      boundingBox.lower === undefined ||
      boundingBox.upper === undefined ||
      !(boundingBox.lower instanceof Vec2) ||
      !(boundingBox.upper instanceof Vec2)) {
      
      throw new TypeError("Transformable2D (boundingBox): should " +
        "be an Object with a Vec2 field 'lower', and a Vec2 field " +
        "'upper'");
    }

    this.#boundingBox = boundingBox;
  }
  // ...

  copy(other) {
    if (!(other instanceof Transformable2D)) {
      throw new TypeError("Transformable2D (copy): other should be " +
        "a Transformable2D");
    }

    this.#position = other.#position.getCopy();
		this.#origin   =   other.#origin.getCopy();
		
		this.#transMat = other.#transMat.getCopy();
		this.#scale = other.#scale.getCopy();
		this.#rotation = other.#rotation;
		
    this.#boundingBox = {
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
    if (!(other instanceof Transformable2D)) {
      throw new TypeError("Transformable2D (equals): other should be " +
        "a Transformable2D");
    }
    
    return (
      this.#position.equals(other.#position) &&
      this.#origin.equals(other.#origin)     &&
      this.#transMat.equals(other.#transMat) &&
      this.#scale.equals(other.#scale)       &&
      this.#rotation === other.#rotation
    );
  }
};

export default Transformable2D;
