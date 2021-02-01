import Mat4 from './mat4.js';

class GLStates_ {
	constructor() {
    this.projectionMatrix = new Mat4();
		this.viewMatrix = new Mat4();
		this.modelMatrix = new Mat4();
	}
};

var GLStates = new GLStates_();

export default GLStates;
