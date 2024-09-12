import Mat4 from './mat4.js';
import Vec3 from './vec3.js';

const Transformable3D = (Transformable3D) => class extends Transformable3D {
  constructor() {
    super();

    this.position = new Vec3(0.0, 0.0, 0.0);
		this.origin = new Vec3(0.0, 0.0, 0.0);
		
		this.transMat = new Mat4();
		this.scale = new Vec3(1.0, 1.0, 1.0);
		this.rotation = new Vec3(0, 0, 0);
		
		this.localBox = new Array(
        new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY),
        new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY)
    );

		this.globalBox = new Array(
        new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY),
        new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY)
    );
  }

  copy(other) {
    this.position = other.position.getCopy();
		this.origin = other.origin.getCopy();
		
		this.transMat = other.transMat.getCopy();
		this.scale = other.scale.getCopy();
		this.rotation = other.rotation.getCopy();
		
    this.localBox.splice(0, this.localBox.length);
    for (let i of other.localBox) {
      this.localBox.push(i);
    }

    this.globalBox.splice(0, this.globalBox.length);
    for (let i of other.globalBox) {
      this.globalBox.push(i);
    }
  }

  updateGlobalBox() {
    // should be defined in child class
  }

  setPosition(position) {
    this.position.copy(position);

    this.updateGlobalBox();
  }

  setOrigin(origin) {
    this.origin.copy(origin);

    this.updateGlobalBox();
  }

  setTransMat(transMat) {
    this.transMat.copy(transMat);

    this.updateGlobalBox();
  }

  setScale(scale) {
    this.scale.copy(scale);

    this.updateGlobalBox();
  }

  setRotation(rotation) {
    this.rotation.copy(rotation);

    this.updateGlobalBox();
  }
};

export default Transformable3D;
