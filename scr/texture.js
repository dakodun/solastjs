import GL from './gl.js'

class Texture {
  constructor() {
    this.textureID = null;

    this.width = 1;
    this.height = 1;
  }

  init() {
    if (this.textureID == null) {
      this.textureID = GL.createTexture();
    }
  }

  delete() {
    if (this.textureID != null) {
      GL.deleteTexture(this.textureID);
      this.textureID = null;
    }
  }

  createData(width, height, data) {
    this.init();
    GL.bindTexture(GL.TEXTURE_2D, this.textureID);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0,
        GL.RGBA, GL.UNSIGNED_BYTE, data);

    this.width = width; this.height = height;
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  }

  createImage(img) {
    this.init();
    GL.bindTexture(GL.TEXTURE_2D, this.textureID);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA,
        GL.UNSIGNED_BYTE, img);

    this.width = img.width; this.height = img.height;
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  }
};

export default Texture;
