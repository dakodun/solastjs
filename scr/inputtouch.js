import Vec2 from './vec2.js';

class InputTouch {
	constructor() {
    this.id = -1;

    this.state = 0;

    this.local = new Vec2(0.0, 0.0);
    this.global = new Vec2(0.0, 0.0);

    this.localPrev = null;
    this.globalPrev = null;
	}
};

export default InputTouch;
