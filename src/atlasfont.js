import Texture from './texture.js';
import Vec2 from './vec2.js';

class AtlasFont {
  static Glyph = class {
    #char = "";

    #left   = 0;
    #top    = 0;
    #right  = 0;
    #bottom = 0;

    #width   = 0;
    #height  = 0;
    #advance = 0;
    
    constructor(char, left, top, right, bottom, width, height, advance) {
      this.#char = char;

      this.#left   = left;
      this.#top    = top;
      this.#right  = right;
      this.#bottom = bottom;

      this.#width = width;
      this.#height = height;
      this.#advance = advance;
    }

    get char() { return this.#char; }

    get left()   { return this.#left;   }
    get top()    { return this.#top;    }
    get right()  { return this.#right;  }
    get bottom() { return this.#bottom; }
    

    get width()   { return this.#width;   }
    get height()  { return this.#height;  }
    get advance() { return this.#advance; }
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
  #kerningMap = new Map();

  #advance = -1;
  #lineHeight = -1;
  #drop = -1;
  #hyphen = -1;

  #layers = [];
  #layerWidth = 512;
  #layerHeight = 512;
  #layerTolerance = 0.1;
  #texture = null;

	constructor(width = 512, height = width) {
    this.#layerWidth = width;
    this.#layerHeight = height
	}

  get advance() { return this.#advance; }
  get lineHeight() { return this.#lineHeight; }
  get drop() { return this.#drop; }
  get hyphen() { return this.#hyphen; }

  get texture() {
    if (this.#texture === null) {
      this.#texture = new Texture();
      
      let arr = [];
      for (let layer of this.#layers) {
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

    let cnv = new OffscreenCanvas(1, 1);
    let ctx = cnv.getContext("2d");
    ctx.font = fontSize + "px " + fontFamily;

    if (this.#advance < 0) {
      // calculate the advance amount of the space
      // character

      let txtMetrics = ctx.measureText(" ");
      let left  = txtMetrics.actualBoundingBoxLeft;
      let right = Math.round(txtMetrics.width);
      this.#advance = (right + left);
    }

    if (this.#lineHeight < 0) {
      // calculate the height of the new line
      // character
      
      let txtMetrics = ctx.measureText("");
      let top    = txtMetrics.fontBoundingBoxAscent;
      let bottom = txtMetrics.fontBoundingBoxDescent;
      this.#lineHeight = (top + bottom);

      this.#drop = txtMetrics.fontBoundingBoxDescent;
    }

    if (this.#hyphen < 0) {
      // calculate the width of the hyphen character
      // for use in word wrapping

      let txtMetrics = ctx.measureText("-");
      let left  = txtMetrics.actualBoundingBoxLeft;
      let right = Math.round(txtMetrics.width);
      this.#hyphen = (right + left);
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

        for (let char of outChar) {
          if (this.#glyphMap.get(char) === undefined) {
            // get the metrics associated with the current
            // character, create a glyph object from them
            // and calculate kerning value with exisiting
            // glyphs
            
            let txtMetrics = ctx.measureText(char);
            let left   = txtMetrics.actualBoundingBoxLeft;
            let top    = txtMetrics.actualBoundingBoxAscent;
            let right  = txtMetrics.actualBoundingBoxRight;
            let bottom = txtMetrics.actualBoundingBoxDescent;
            
            let glyph = new AtlasFont.Glyph( char, left, top, right,
              bottom, (right + left), (top + bottom), txtMetrics.width);

            if (this.#renderGlyph(fontFamily, fontSize, glyph)) {
              // after rendering glyph succesfully we can
              // calculate kerning values and add it to the
              // glyph map

              this.#generateKerning(ctx, glyph);
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

  getKerning(pair) {
    return this.#kerningMap.get(pair);
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

    for (let layer of this.#layers) {
      if (layer.renderGlyph(glyph)) {
        return true;
      }
    }

    this.#layers.push(new AtlasFont.Layer(this.#layerWidth,
      this.#layerHeight, fontFamily, fontSize,
      this.#layerTolerance * fontSize, this.#layers.length));
    
    return this.#layers.at(-1).renderGlyph(glyph);
  }

  #generateKerning(ctx, glyph) {
    // [!] if needed, we can reduce map size by ignoring most
    // popular kerning gap and use that as a default

    for (const [key, value] of this.#glyphMap) {
      // create a kerning table between this glyph and all
      // current glyphs - in both directions ('ab' and 'ba')

      let pair = glyph.char + key;
      let metr = ctx.measureText(pair);
      let w = metr.actualBoundingBoxRight +
        metr.actualBoundingBoxLeft;
      let kern = Math.round(w  - (value.width + glyph.width));
      this.#kerningMap.set(pair, kern);

      pair = key + glyph.char;
      metr = ctx.measureText(pair);
      w = metr.actualBoundingBoxRight +
        metr.actualBoundingBoxLeft;
      kern = Math.round(w  - (value.width + glyph.width));
      this.#kerningMap.set(pair, kern);
    }

    // Bitter bellflowers bloomed between bannered burrows -
    // don't forget to kern the newest glyph with itself!
    let pair = glyph.char + glyph.char;
    let metr = ctx.measureText(pair);
    let w = metr.actualBoundingBoxRight + metr.actualBoundingBoxLeft;
    let kern = Math.round(w  - (2 * glyph.width));
    this.#kerningMap.set(pair, kern);
  }
};

export default AtlasFont;
