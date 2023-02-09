import GL from './gl.js'

class FrameBuffer {
  constructor() {
    this.frameBufferID = null;
  }

  init() {
    if (this.frameBufferID == null) {
      this.frameBufferID = GL.createFramebuffer();
    }
  }

  delete() {
    if (this.frameBufferID != null) {
      GL.deleteFramebuffer(this.frameBufferID);
      this.frameBufferID = null;
    }
  }

  attachTexture(texture, attachment) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBufferID);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, attachment, GL.TEXTURE_2D,
      texture.textureID, 0);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  attachRenderBuffer(renderBuffer, attachment) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBufferID);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, attachment, GL.RENDERBUFFER,
        renderBuffer.renderBufferID);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }
};

export default FrameBuffer;
