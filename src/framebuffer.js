import GL from './gl.js'

class FrameBuffer {
	constructor() {
		this.frameBuffer = null;
	}

  init() {
    if (this.frameBuffer == null) {
      this.frameBuffer = GL.createFramebuffer();
    }
  }

  delete() {
    if (this.frameBuffer != null) {
      GL.deleteFramebuffer(this.frameBuffer);
      this.frameBuffer = null;
    }
  }

  attachTexture(texture, attachment) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, attachment, GL.TEXTURE_2D,
      texture.texture, 0);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  attachRenderBuffer(renderBuffer, attachment) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, attachment, GL.RENDERBUFFER,
        renderBuffer.renderBuffer);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }
};

export default FrameBuffer;
