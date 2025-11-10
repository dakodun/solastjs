import GL from './gl.js'

class FrameBuffer {
  static _idCount = BigInt(1);
    
  _frameBuffer = null;

  _id = BigInt(0);
  
	constructor() {
		
	}

  get frameBuffer() { return this._frameBuffer; }
  get id() { return this._id; }

  init() {
    if (this._frameBuffer === null) {
      this._frameBuffer = GL.createFramebuffer();
      this._id = FrameBuffer._idCount++;
    }
  }

  delete() {
    if (this._frameBuffer !== null) {
      GL.deleteFramebuffer(this._frameBuffer);
      this._frameBuffer = null;
      this._id = BigInt(0);
    }
  }

  attachTexture(texture, attachment, layerIn) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this._frameBuffer);
    GL.framebufferTextureLayer(GL.FRAMEBUFFER, attachment,
      texture.texture, 0, layerIn);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }

  attachRenderBuffer(renderBuffer, attachment) {
    this.init();

    GL.bindFramebuffer(GL.FRAMEBUFFER, this._frameBuffer);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, attachment, GL.RENDERBUFFER,
        renderBuffer.renderBuffer);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
  }
};

export default FrameBuffer;
