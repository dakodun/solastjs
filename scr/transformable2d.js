import Mat3 from './mat3.js';
import Vec2 from './vec2.js';

const Transformable2D = (Transformable2D) => class extends Transformable2D {
  constructor() {
    super();

    this.position = new Vec2(0.0, 0.0);
		this.origin = new Vec2(0.0, 0.0);
		
		this.transMat = new Mat3();
		this.scale = new Vec2(1.0, 1.0);
		this.rotation = 0;
		
		this.localBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );

		this.globalBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );
		
	  this.localMask = new Array();
		this.globalMask = new Array();
  }

  copy(other) {
    this.position = other.position.getCopy();
		this.origin = other.origin.getCopy();
		
		this.transMat = other.transMat.getCopy();
		this.scale = other.scale.getCopy();
		this.rotation = other.rotation;
		
    this.localBox.splice(0, this.localBox.length);
    for (let i of other.localBox) {
      this.localBox.push(i);
    }

    this.globalBox.splice(0, this.globalBox.length);
    for (let i of other.globalBox) {
      this.globalBox.push(i);
    }

    this.localMask.splice(0, this.localMask.length);
    for (let i of other.localMask) {
      this.localMask.push(i);
    }

    this.globalMask.splice(0, this.globalMask.length);
    for (let i of other.globalMask) {
      this.globalMask.push(i);
    }
  }

  updateGlobalBox() {
    // should be defined in child class
  }

  updateGlobalMask() {
    // should be defined in child class
  }

  createLocalMask() {
    // should be defined in child class
  }

  setPosition(position) {
    this.position.copy(position);

    this.updateGlobalBox();
	  this.updateGlobalMask();
  }

  setOrigin(origin) {
    this.origin.copy(origin);

    this.updateGlobalBox();
	  this.updateGlobalMask();
  }

  setTransMat(transMat) {
    this.transMat.copy(transMat);

    this.updateGlobalBox();
	  this.updateGlobalMask();
  }

  setScale(scale) {
    this.scale.copy(scale);

    this.updateGlobalBox();
	  this.updateGlobalMask();
  }

  setRotation(rotation) {
    this.rotation = rotation;

    this.updateGlobalBox();
	  this.updateGlobalMask();
  }

  setLocalMask(mask) {
    if (newMask == undefined) {
      this.createLocalMask();
	    this.updateGlobalMask();
    }
    else {
      this.localMask.splice(0, this.localMask.length);
      for (let m of mask) {
        localMask.push(m.getCopy());
      }

      this.updateGlobalMask();
    }
  }
};

export default Transformable2D;
