import GL from './gl.js'

class RenderBuffer {
	constructor() {
		this.renderBuffer = null;

    this.width = 1;
    this.height = 1;
	}

  init() {
    if (this.renderBuffer == null) {
      this.renderBuffer = GL.createRenderbuffer();
    }
  }

  delete() {
    if (this.renderBuffer != null) {
      GL.deleteRenderbuffer(this.renderBuffer);
      this.renderBuffer = null;
    }
  }

  createBuffer(internalFormat, width, height) {
    this.init();

    this.width = width; this.height = height;

    GL.bindRenderbuffer(GL.RENDERBUFFER, this.renderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, internalFormat, width, height);
  }
};

export default RenderBuffer;
