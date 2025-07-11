import GL from './gl.js'

import AtlasFont from './atlasfont.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Transformable2D from './transformable2d.js';
import VBOVertex from './vbovertex.js';
import Vec2 from './vec2.js';

class RenderString {
  #font = null;
  #text = "";

  #letterSpacing = 0;
  #wordSpacing = 0;
  #lineSpacing = 1.0;

  #vertices = [];
  #indices = [];
  
  #transformable = new Transformable2D();
  #renderable = new Renderable();

	constructor(font = null, text = "") {
    this.font = font;
    this.text = text;
	}

  get font() { return this.#font; }
  get text() { return this.#text; }

  get width() {
    // in order to get an accurate width measurement
    // we must have already generated our render
    // strings vertices

    if (this.#vertices.length === 0) {
      this.#generateVerts();
    }

    return this.boundingBox.upper.x - this.boundingBox.lower.x;
  }

  get height() {
    if (this.#vertices.length === 0) {
      this.#generateVerts();
    }

    return this.boundingBox.upper.y - this.boundingBox.lower.y;
  }

  set font(font) {
    // a change in font requires regenerating our
    // render strings vertices

    if (!(font instanceof AtlasFont) && font !== null) {
      throw new TypeError("RenderString (font): font should be " +
      "an AtlasFont, or null");
    }

    this.#font = font;
    this.#vertices.splice(0);
  }

  set text(text) {
    if (typeof text !== 'string') {
      throw new TypeError("RenderString (text): text should be " +
      "a String");
    }

    this.#text = text;
    this.#vertices.splice(0);
  }

  // transformable helpers
  // error handling occurs in Transformable class
  get transformable() { return this.#transformable; }
  get position() { return this.#transformable.position; }
  get origin()   { return this.#transformable.origin;   }
  get transMat() { return this.#transformable.transMat; }
  get scale()    { return this.#transformable.scale;    }
  get rotation() { return this.#transformable.rotation; }
  get boundingBox() {
    if (this.#vertices.length === 0) {
      this.#generateVerts();
    }

    return this.#transformable.boundingBox;
  }

  set position(position) { this.#transformable.position = position; }
  set origin(origin)     { this.#transformable.origin = origin;     }
  set transMat(transMat) { this.#transformable.transMat = transMat; }
  set scale(scale)       { this.#transformable.scale = scale;       }
  set rotation(rotation) { this.#transformable.rotation = rotation; }
  set boundingBox(boundingBox) {
    this.#transformable.boundingBox = boundingBox;
  }
  //

  // renderable helpers
  // error handling occurs in Renderable class
  get renderable() { return this.#renderable; }
  get color() { return this.#renderable.color; }
  get alpha() { return this.#renderable.alpha; }
  get depth() { return this.#renderable.depth; }
  get shader() { return this.#renderable.shader; }

  set color(color) { this.#renderable.color = color; }
  set alpha(alpha) { this.#renderable.alpha = alpha; }
  set depth(depth) { this.#renderable.depth = depth; }
  set shader(shader) { this.#renderable.shader = shader; }
  //

  asData() {
    // generate our glyph vertices and then transform
    // them using the properties of our transformable
    // object

    this.#generateVerts();

    let rbd = new RenderBatchData();
    let transMat = this.transformable.asMat3();

    for (let vert of this.#vertices) {
      // create a copy of our glyph vertex as it contains
      // texture information

      let vboVert = vert.getCopy();

      vboVert.x = (transMat.arr[0] * vert.x) +
        (transMat.arr[3] * vert.y) + transMat.arr[6];
      vboVert.y = (transMat.arr[1] * vert.x) +
        (transMat.arr[4] * vert.y) + transMat.arr[7];
      vboVert.z = this.depth;

      vboVert.r = this.color.x; vboVert.g = this.color.y;
      vboVert.b = this.color.z; vboVert.a = this.alpha;

      rbd.vertices.push(vboVert);
    }

    rbd.indices = this.#indices.slice();
    rbd.textureRef = this.#font.texture.texture;

    return [rbd];
  }

  #generateVerts() {
    // if we don't already have any vertices generated then
    // create quads by matching characters from our #text
    // to the corresponding glyphs in our #font, then update
    // width and height

    // [!] text-align: align multi-line strings and strings with
    //   a set width
    // [!] word-wrap: a set width at which words will wrap to next
    //   line
    // [!] hyphenation: when wrapping words, split longer words with
    //   a hyphen (if font has a matching glyph)

    if (this.#vertices.length === 0) {
      let indexCount = 0;
      let cursor = new Vec2(0, 0);
      
      let bbox = {
        lower: new Vec2(0, 0),
        upper: new Vec2(0, 0)
      };

      let prevGlyph = null;

      for (let char of this.#text) {
        if (char === " ") {
          // (by not setting or unsetting prevGlyph here we kern
          // based on last 'valid' glyph)

          cursor.x += this.#font.advance + this.#wordSpacing;
        } else if (char === "\n") {
          // update the bounding box width before moving to a
          // new line
          
          bbox.upper.x = Math.max(bbox.upper.x, cursor.x);

          // reset cursor x position and decrease the y position,
          // then unset previous glyph to disable kerning

          cursor.x = 0;
          cursor.y -= Math.round(this.#font.lineHeight * this.#lineSpacing);
          prevGlyph = null;
        } else {
          let glyph = this.#font.getGlyph(char);

          if (glyph !== undefined) {
            let s = new Vec2(glyph.s.x * 65535, glyph.s.y * 65535);
            let t = new Vec2(glyph.t.x * 65535, glyph.t.y * 65535);
            let l = glyph.layer;

            let w = glyph.width;
            let h = glyph.height;
            let b = glyph.bottom;

            if (prevGlyph) {
              // if this is not the first glyph on a line then
              // account for any extra letter spacing and check
              // for kerning with the previous glyph 

              cursor.x += this.#letterSpacing;

              let kern = this.#font.getKerning(prevGlyph.char + glyph.char);
              if (kern) { cursor.x += kern; }
            }
            
            // update the height of the bounding box accounting for
            // multiple lines
            // [!] upper will never be bigger on any line other than
            // the first
            // [!] lower will always be biggest on final line
            
            bbox.upper.y = Math.max(bbox.upper.y, glyph.top + cursor.y);
            bbox.lower.y = Math.min(bbox.lower.y, -b + cursor.y);

            // calculate the vertices for the current quad then
            // advance the cursor

            this.#vertices.push(new VBOVertex({
              x: cursor.x, y: -b + cursor.y,
              s: s.x, t: t.y, textureFlag: 1, textureLayer: l,
            }));

            this.#vertices.push(new VBOVertex({
              x: cursor.x + w, y: -b + cursor.y,
              s: s.y, t: t.y, textureFlag: 1, textureLayer: l,
            }));

            this.#vertices.push(new VBOVertex({
              x: cursor.x + w, y: (h - b) + cursor.y,
              s: s.y, t: t.x, textureFlag: 1, textureLayer: l,
            }));

            this.#vertices.push(new VBOVertex({
              x: cursor.x, y: (h - b)  + cursor.y,
              s: s.x, t: t.x, textureFlag: 1, textureLayer: l,
            }));

            cursor.x += glyph.width;

            // calculate the indices for the current quad then
            // increment the counter

            this.#indices.push(indexCount    );
            this.#indices.push(indexCount + 2);
            this.#indices.push(indexCount + 1);

            this.#indices.push(indexCount + 2);
            this.#indices.push(indexCount    );
            this.#indices.push(indexCount + 3);

            indexCount += 4;

            // store the current glyph to allow for kerning
            // with the next glyph (if necessary)

            prevGlyph = glyph;
          }
        }
      }

      // update the bounding box width to account for the last
      // line of text and set it

      bbox.upper.x = Math.max(bbox.upper.x, cursor.x);
      this.boundingBox = bbox;
    }
  }
};

export default RenderString;
