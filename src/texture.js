import GL from './gl.js';
import Shape from './shape.js';
import Vec2 from './vec2.js';

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

  create(data = []) {
    this.init();

    // [!] type-check data

    for (let datum of data) {
      this.width  = Math.max( this.width,  datum.width);
      this.height = Math.max(this.height, datum.height);
    }


    GL.bindTexture(GL.TEXTURE_2D_ARRAY, this.#texture);
    GL.texStorage3D(GL.TEXTURE_2D_ARRAY, 1, GL.RGBA8,
      this.width, this.height, data.length);
    
    for (let i = 0; i < data.length; ++i) {
      GL.texSubImage3D(GL.TEXTURE_2D_ARRAY, 0, 0, 0, i, this.width,
        this.height, 1, GL.RGBA, GL.UNSIGNED_BYTE, data[i]);
    }
    
    GL.texParameteri(GL.TEXTURE_2D_ARRAY,
      GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D_ARRAY,
      GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D_ARRAY,
      GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D_ARRAY,
      GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  }

  asShape(layerIn, sIn, tIn) {
    // helper function that creates a simple shape (quad)
    // and applies this texture as a frame

    let shp = new Shape();

    const w = this.width;
    const h = this.height;
    shp.pushVerts([
      new Vec2(0, 0),
      new Vec2(w, 0),
      new Vec2(w, h),
      new Vec2(0, h)
    ]);

    shp.indices = [
      0, 1, 2,
      2, 3, 0
    ];

    shp.frames = [new Shape.Frame({
      texture: this,
      layer: layerIn,
      s: sIn,
      t: tIn,
    })];

    return shp;
  }
};

export default Texture;
