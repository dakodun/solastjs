import Mat4 from './mat4.js';
import Shader from './shader.js';

class GLStates_ {
  constructor() {
    this.projectionMatrix = new Mat4();
    this.viewMatrix = new Mat4();
    this.modelMatrix = new Mat4();

    this.defaultShader = new Shader();
  }
};

var GLStates = new GLStates_();

export default GLStates;
