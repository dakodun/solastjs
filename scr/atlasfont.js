import Texture from './texture.js';
import Vec2 from './vec2.js';

class AtlasFont {
  static Glyph = class {
    #char = "";

    #left   = 0;
    #top    = 0;
    #right  = 0;
    #bottom = 0;
    
    constructor(char, left, top, right, bottom) {
      this.#char = char;

      this.#left   = left;
      this.#top    = top;
      this.#right  = right;
      this.#bottom = bottom;
    }

    get char() { return this.#char; }

    get left()   { return this.#left;   }
    get top()    { return this.#top;    }
    get right()  { return this.#right;  }
    get bottom() { return this.#bottom; }

    get width()  { return this.right + this.left; }
    get height() { return this.top + this.bottom; }
  }

  static Layer = class {
    #width = 0;
    #height = 0;
    #invWidth = 0;
    #invHeight = 0;

    #halfTex = new Vec2();
    #tolerance = 0;
    #offset = 0;
    #shelves = new Array();

    #canvas = null;
    #context = null;

    #id = 0;

    constructor(width, height, fontFamily, fontSize, tolerance, id) {
      this.#width = width;
      this.#height = height;
      this.#invWidth = 1 / width;
      this.#invHeight = 1 / height;

      this.#halfTex.xy = [this.#invWidth * 0.5, this.#invHeight * 0.5];
      this.#tolerance = tolerance;

      this.#canvas = new OffscreenCanvas(this.#width, this.#height);
      this.#context = this.#canvas.getContext("2d", { alpha: true });
      this.#context.font = fontSize + "px " + fontFamily;
      this.#context.fillStyle = "#FFFFFF";

      this.#id = id;
    }

    get canvas() { return this.#canvas; }
    get context() { return this.#context; }

    renderGlyph(glyph) {
      // attempts to place glyph rectangle on this layer,
      // drawing the gylph on the canvas and updating the
      // packing data (freeOffset and shelves)
      // returns true if glyph was able to be placed,
      // otherwise returns false

      let shelf = {
        id : -1,
        diff : Number.MAX_VALUE,
      };

      for (let i = 0; i < this.#shelves.length; ++i) {
        let diff = this.#shelves[i].height - glyph.height;

        if ((0 <= diff && diff <= this.#tolerance) &&
          glyph.width <= (this.#width - this.#shelves[i].width)) {

          if (diff < shelf.diff) {
            // if this shelf is a better fit then set it as
            // the current shelf for this glyph

            shelf.id = i;
            shelf.diff = diff;
          }

          if (diff === 0) {
            // if glyph height is a perfect match for the
            // current shelf then stop looking for a better
            // match

            break;
          }
        }
      }
      
      if (shelf.id >= 0) {
        // found a suitable shelf so add this glyph to it
        // and update its remaining space

        let width = this.#shelves[shelf.id].width;
        let offset = this.#shelves[shelf.id].offset;
        
        this.#context.fillText(
          glyph.char,
          width + glyph.left,
          offset + glyph.top
        );

        glyph.s = new Vec2(
          (width * this.#invWidth) + this.#halfTex.x,
          ((width + glyph.width) * this.#invWidth) - this.#halfTex.x
        );

        glyph.t = new Vec2(
          (offset * this.#invHeight) + this.#halfTex.y,
          ((offset + glyph.height) * this.#invHeight) - this.#halfTex.y
        );

        glyph.layer = this.#id;

        this.#shelves[shelf.id].width += glyph.width;

        return true;
      } else if (glyph.height <= (this.#height - this.#offset) &&
        glyph.width <= this.#width) {

        // no suitable shelf was found but we have enough
        // free space left to start a new shelf and add this
        // glyph to it

        this.#context.fillText(glyph.char, glyph.left,
          this.#offset + glyph.top);
        
        glyph.s = new Vec2(
          this.#halfTex.x,
          (glyph.width * this.#invWidth) - this.#halfTex.x
        );

        glyph.t = new Vec2(
          (this.#offset * this.#invHeight) + this.#halfTex.y,
          ((this.#offset + glyph.height) * this.#invHeight) - this.#halfTex.y
        );

        glyph.layer = this.#id;

        this.#shelves.push({
          offset : this.#offset,
          height : glyph.height,
          width  : glyph.width,
        });

        this.#offset += glyph.height;

        return true;
      }

      return false;
    }
  }


  #glyphMap = new Map();

  layers = [];
  #layerWidth = 512;
  #layerHeight = 512;
  #layerTolerance = 0.1;
  #texture = null;

	constructor(width = 512, height = width) {
    this.#layerWidth = width;
    this.#layerHeight = height
	}

  get texture() {
    // [!] cached?
    // create a 2d texture from all of our layers

    if (this.#texture === null) {
      this.#texture = new Texture();
      
      let arr = [];
      for (let layer of this.layers) {
        arr.push(layer.canvas);
      }

      this.#texture.create(arr);
    }

    return this.#texture;
  }

  async generateGlyphs(fontFamily, fontSize, charSet) {
    if (!(charSet instanceof Array)) {
      throw new TypeError("bad charset");
    }

    for (let inChar of charSet) {
      let outChar = inChar;
      
      if (typeof inChar === 'number') {
        // if the input char was a character code then
        // convert it to it's string respresentation

        outChar = String.fromCharCode(inChar);
      }

      if (typeof outChar === 'string') {
        // if the processed character is a valid string
        // then iterate all individual characters in
        // that string and create the corresponding glyph

        let cnv = new OffscreenCanvas(1, 1);
        let ctx = cnv.getContext("2d");
        ctx.font = fontSize + "px " + fontFamily;

        for (let char of outChar) {
          if (this.#glyphMap.get(char) === undefined) {
            // get the metrics associated with the current
            // character and create a glyph object from them
            // (account for instances where visible width
            // is zero - like with the space character - but
            // we want to use the width metric value)

            let txtMetrics = ctx.measureText(char);
            
            let left = txtMetrics.actualBoundingBoxLeft;
            let right = txtMetrics.actualBoundingBoxRight;
            let width = Math.round(txtMetrics.width);
            if (left === right && width !== 0) {
              right = width;
            }
            
            let glyph = new AtlasFont.Glyph(
              char,
              left,
              txtMetrics.actualBoundingBoxAscent,
              right,
              txtMetrics.actualBoundingBoxDescent
            );

            if (this.#renderGlyph(fontFamily, fontSize, glyph)) {
              this.#glyphMap.set(char, glyph);
            }
          }
        }
      }
    }
  }

  getGlyph(char) {
    return this.#glyphMap.get(char);
  }

  #renderGlyph(fontFamily, fontSize, glyph) {
    // render a glyph to an exisiting layer or create a
    // new layer if existing layers are too full
    // (exit early if glyph is too big to ever fit)

    // return false if glyph was successfully rendered
    // otherwise retrun false

    if (glyph.width > this.#layerWidth || 
      glyph.height > this.#layerHeight) {

      return false;
    }

    for (let layer of this.layers) {
      if (layer.renderGlyph(glyph)) {
        return true;
      }
    }

    this.layers.push(new AtlasFont.Layer(this.#layerWidth,
      this.#layerHeight, fontFamily, fontSize,
      this.#layerTolerance * fontSize, this.layers.length));
    
    return this.layers.at(-1).renderGlyph(glyph);
  }
};

export default AtlasFont;
