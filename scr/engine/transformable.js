import Mat4 from './mat4.js';
import Vec2 from './vec2.js';

class Transformable {
  constructor() {
    this.position = new Vec2(0.0, 0.0);
		this.origin = new Vec2(0.0, 0.0);
		
		this.transMat = new Mat4();
		this.scale = new Vec2(1.0, 1.0);
		this.rotation = 0;
		this.skew = new Vec2(0.0, 0.0);
		
		this.localBox = new Array();
		this.globalBox = new Array();
		
	  this.localMask = new Array();
		this.globalMask = new Array();
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

    updateGlobalBox();
	  updateGlobalMask();
  }

  setOrigin(origin) {
    this.origin.copy(origin);

    updateGlobalBox();
	  updateGlobalMask();
  }

  setTransMat(transMat) {
    this.transMat.copy(transMat);

    updateGlobalBox();
	  updateGlobalMask();
  }

  setScale(scale) {
    this.scale.copy(scale);

    updateGlobalBox();
	  updateGlobalMask();
  }

  setRotation(rotation) {
    this.rotation = rotation;

    updateGlobalBox();
	  updateGlobalMask();
  }

  setSkew(skew) {
    this.skew.copy(skew);

    updateGlobalBox();
	  updateGlobalMask();
  }

  setLocalMask(mask) {
    if (newMask == undefined) {
      createLocalMask();
	    updateGlobalMask();
    }
    else {
      this.localMask.splice(0, this.localMask.length);
      for (let m of mask) {
        localMask.push(m.getCopy());
      }

      updateGlobalMask();
    }
  }
};

export default Transformable;
