import GL from './gl.js'
import Sol from './sol.js'

import Texture from './texture.js';

class FrameBuffer {
  // creates and manages a webgl framebuffer ensuring
  // it is properly initialised before use (and
  // assigning it a unique id)

  //> static properties //
  static _idCount = BigInt(1);
  
  //> internal properties //
  _frameBuffer = null;
  _id = BigInt(0);
  
  //> constructor //
	constructor() {
		
	}

  //> getters //
  get frameBuffer() { return this._frameBuffer; }
  get id() { return this._id; }

  //> public methods //
  copy(other) {
    throw new Error("FrameBuffer (copy): can't perform a deep " +
    "copy of a FrameBuffer (you can but it requires extra work)");
  }

  getCopy() {
    throw new Error("FrameBuffer (getCopy): can't perform a deep " +
    "copy of a FrameBuffer (you can but it requires extra work)");
  }

  equals(other) {
    throw new Error("FrameBuffer (equals): can't compare " +
    "FrameBuffer objects (you can but it requires extra work)");
  }

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

    Sol.checkTypes(this, "attachTexture",
    [{texture}, [Texture]], [{layerIn}, [Number]]);

    if (typeof attachment !== "number") {
      throw new TypeError("FrameBuffer (attachTexture): " +
      "should be a GLenum");
    }

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
