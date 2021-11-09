class Camera2D {
	constructor() {
    
	}

	copy(other) {
    
  }

  getCopy() {
    let copy = new Camera2D(); copy.copy(this);
    return copy;
  }
};

export default Camera2D;
