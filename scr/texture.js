import GL from './gl.js'

class Texture {
  // private fields
    static #idCount = BigInt(1);
    
    #texture = null;

    #width  = 1;
    #height = 1;

    #id = BigInt(0);
  // ... 

	constructor() {
    
	}

  // getters/setters
  get texture() { return this.#texture; }
  get width()  { return this.#width;  }
  get height() { return this.#height; }
  get id() { return this.#id; }

  set width(width) {
    if (typeof width !== 'number') {
      throw new TypeError("Texture (width): should " +
        "be a Number");
    }

    this.#width = width;
  }

  set height(height) {
    if (typeof height !== 'number') {
      throw new TypeError("Texture (height): should " +
        "be a Number");
    }

    this.#height = height;
  }
  // ...

  init() {
    if (this.#texture === null) {
      this.#texture = GL.createTexture();
      this.#id = Texture.#idCount++;
    }
  }

  delete() {
    if (this.#texture !== null) {
      GL.deleteTexture(this.#texture);
      this.#texture = null;
      this.#id = BigInt(0);
    }
  }

  createData(width, height, data) {
    this.init();

    

    GL.bindTexture(GL.TEXTURE_2D, this.#texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0,
        GL.RGBA, GL.UNSIGNED_BYTE, data);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  }

  createImage(img) {
    this.init();
    
    this.width  =  img.width;
    this.height = img.height;

    GL.bindTexture(GL.TEXTURE_2D, this.#texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA,
        GL.UNSIGNED_BYTE, img);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  }
};

export default Texture;
