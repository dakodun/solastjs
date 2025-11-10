import Mat4 from './mat4.js';
import Shader from './shader.js';

class GLStates {
  static projectionMatrix = new Mat4();
  static viewMatrix = new Mat4();

  static defaultShader = new Shader();
};

export default GLStates;
