import GL from './gl.js'

class RenderBuffer {
  constructor() {
    this.renderBufferID = null;

    this.width = 1;
    this.height = 1;
  }

  init() {
    if (this.renderBufferID == null) {
      this.renderBufferID = GL.createRenderbuffer();
    }
  }

  delete() {
    if (this.renderBufferID != null) {
      GL.deleteRenderbuffer(this.renderBufferID);
      this.renderBufferID = null;
    }
  }

  createBuffer(internalFormat, width, height) {
    this.init();

    this.width = width; this.height = height;

    GL.bindRenderbuffer(GL.RENDERBUFFER, this.renderBufferID);
    GL.renderbufferStorage(GL.RENDERBUFFER, internalFormat, width, height);
  }
};

export default RenderBuffer;
