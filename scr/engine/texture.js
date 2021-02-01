import GL from './gl.js'

class Texture {
	constructor() {
		this.textureID = 0;

    this.width = 1;
    this.height = 1;
	}

  copy(other) {
    
  }

  getCopy() {
    let copy = new Texture(); copy.copy(this);
    return copy;
  }

  init() {
    if (this.textureID == 0) {
      this.textureID = GL.createTexture();
    }
  }

  loadImage(url) {
    this.init();
    GL.bindTexture(GL.TEXTURE_2D, this.textureID);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0,
        GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    let img = new Image(); img.src = url;
    this.width = img.width; this.height = img.height;
    let texture = this.textureID;

    img.onload = function() {
      GL.bindTexture(GL.TEXTURE_2D, texture);
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA,
          GL.UNSIGNED_BYTE, img);

      // make power of 2 mang
      // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
		  // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);

      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
		  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
		  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
		  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    };
  }
};

export default Texture;
