import GL from './gl.js'

import Vec3 from './vec3.js';

const Renderable = (Renderable) => class extends Renderable {
  constructor() {
    super();

    this.color = new Vec3(255, 255, 255);
    this.alpha = 255;
    this.depth = -1.0;

    this.renderMode = GL.TRIANGLES;
 }

 copy(other) {
    this.color = other.color.getCopy();
		this.alpha = other.alpha;
    this.depth = other.depth;

    this.renderMode = other.renderMode;
  }

  getRenderBatchData() {
    // should be defined in child class
  }
};

export default Renderable;
