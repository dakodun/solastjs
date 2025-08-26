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
  #fontScale = 1.0;
  #maxWidth = 0;
  #hyphenate = false;
  #align = "left";

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
  get letterSpacing() { return this.#letterSpacing; }
  get wordSpacing() { return this.#wordSpacing; }
  get lineSpacing() { return this.#lineSpacing; }
  get fontScale() { return this.#fontScale; }
  get maxWidth() { return this.#maxWidth; }
  get hyphenate() { return this.#hyphenate; }
  get align() { return this.#align; }

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
    this.#indices.splice(0);
  }

  set text(text) {
    if (typeof text !== 'string') {
      throw new TypeError("RenderString (text): text should be " +
      "a String");
    }

    this.#text = text;
    this.#vertices.splice(0);
    this.#indices.splice(0);
  }

  set maxWidth(maxWidth) {
    if (typeof maxWidth !== 'number') {
      throw new TypeError("RenderString (maxWidth): maxWidth should " + 
      "be a Number");
    }

    this.#maxWidth = (maxWidth > 0) ? maxWidth : 0;
    this.#vertices.splice(0);
    this.#indices.splice(0);
  }

  set hyphenate(hyphenate) {
    this.#hyphenate = hyphenate;
    this.#vertices.splice(0);
    this.#indices.splice(0);
  }

  set align(align) {
    if (typeof align !== 'string') {
      throw new TypeError("RenderString (align): align should " + 
      "be a String (left, center, right, or justify)");
    }

    this.#align = (align === "center" || align === "right" ||
      align === "justify") ? align : "left";
    this.#vertices.splice(0);
    this.#indices.splice(0);
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

    if (this.#vertices.length === 0) {
      let lines = this.#preParse();

      let indexCount = 0;
      let height = (lines.length - 1) *
        (this.#font.lineHeight * this.#lineSpacing);
      let cursor = new Vec2(0, height);
      
      let bbox = {
        lower: new Vec2(0, 0),
        upper: new Vec2(this.#maxWidth, height),
      };
      
      let prevGlyph = null;

      for (let line of lines) {
        let align = {
          left: 0,
          space: 0,
        };

        // if a max width is set then we should account for
        // different text alignment (essentially, space before line
        // and space between words)

        if (this.#maxWidth > 0) {
          align.left = (this.#align === "right")
            ? (this.#maxWidth - line.width) : (this.#align === "center")
            ? (this.#maxWidth - line.width) * 0.5 : 0
          
          align.space = (this.#align === "justify" &&
            line.count > 1 && line.justify)
            ? (this.#maxWidth - line.width) / (line.count - 1) : 0
        }

        cursor.x = align.left;

        for (let char of line.text) {
          if (char === " ") {
            // (by not setting or unsetting prevGlyph here we kern
            // based on last 'valid' glyph)

            cursor.x += this.#font.advance + this.#wordSpacing;
            cursor.x += align.space;
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

              bbox.upper.y = Math.max(bbox.upper.y, cursor.y + glyph.top);
              // bbox.lower.y = Math.min(bbox.lower.y, -b + cursor.y);

              // calculate the vertices for the current quad then
              // advance the cursor

              let curs = new Vec2(Math.round(cursor.x),
                Math.round(cursor.y));

              this.#vertices.push(new VBOVertex({
                x: curs.x, y: -b + curs.y,
                s: s.x, t: t.y, textureFlag: 1, textureLayer: l,
              }));

              this.#vertices.push(new VBOVertex({
                x: curs.x + w, y: -b + curs.y,
                s: s.y, t: t.y, textureFlag: 1, textureLayer: l,
              }));

              this.#vertices.push(new VBOVertex({
                x: curs.x + w, y: (h - b) + curs.y,
                s: s.y, t: t.x, textureFlag: 1, textureLayer: l,
              }));

              this.#vertices.push(new VBOVertex({
                x: curs.x, y: (h - b)  + curs.y,
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

        // update the bounding box width before moving to a
        // new line
        
        bbox.upper.x = Math.max(bbox.upper.x, cursor.x);

        // reset cursor x position and decrease the y position,
        // then unset previous glyph to disable kerning

        cursor.x = 0;
        cursor.y -= this.#font.lineHeight * this.#lineSpacing;
        prevGlyph = null;
      }

      // update the bounding box width to account for the last
      // line of text, round values, and then set it

      bbox.upper.x = Math.max(bbox.upper.x, cursor.x);

      this.boundingBox.upper = new Vec2(
        Math.round(bbox.upper.x), Math.round(bbox.upper.y));
      this.boundingBox.lower = new Vec2(0, 0);
    }
  }

  #preParse () {
    let input = this.#text + " ";
    let output = new Array();

    let prevGlyph = null;
    let widthCurr = 0;
    let widthLine = 0;
    let widthGap  = 0;
    let word = "";
    let line = "";
    let wordCount = 0;
    
    let wrap = {
      required: false,
      
      index: -1,
      widths: new Array(),
    };

    let hyphenLimit = 3;
    let hyphenWidth = this.#font.hyphen;

    for (let char of input) {
      if (char === " " || char === "\n") {
        if (wrap.required === true) {
          // adjust the hyphenation indices to ensure number
          // of characters after the hyphen is greater than
          // the hyphenLimit

          let pre = wrap.index;
          let post = (word.length - wrap.index);
          if (post < hyphenLimit) {
            let diff = hyphenLimit - post;
            
            if (pre - diff >= hyphenLimit) {
              pre  -= diff;
              post += diff;
            }
          }

          // if hyphenation is desired and suitable then attempt
          // to split the word, otherwise move entire word to a
          // new line

          if (this.#hyphenate &&
              (pre >= hyphenLimit && post >= hyphenLimit)) {
            
            output.push({
              text: line + word.substring(0, pre) + "-",
              count: wordCount + 1,
              width: widthLine + widthGap +
                  wrap.widths[pre] + hyphenWidth,
              justify: true,
            });
            
            // set current word and length to the part that is
            // after the hyphen (and on the new line)

            word = word.substring(pre);
            widthCurr = widthCurr - wrap.widths[pre];

            // [!] leftover word could still be too long and
            // could be hyphenated again
          } else {
            output.push({
              text: line.trimEnd(),
              count: wordCount,
              width: widthLine,
              justify: true,
            });

            prevGlyph = null;
          }

          // reset current line (we've set current word and width
          // to account for what we've moved onto next line which
          // will be dealt with later)

          line = "";
          widthLine = 0;
          widthGap  = 0;
          wordCount = 0;
        }

        // as we're moving onto a new word we need to reset the word
        // wrap status, add the current word to the current line and
        // then reset it, and then handle the space or newline
        // charactrer as appropiate

        wrap.required = false;
        wrap.index = -1;
        wrap.widths.splice(0);

        line += word;
        word = "";

        widthLine += widthGap + widthCurr;

        if (char === " ") {
          line += " ";

          widthGap  = this.#font.advance + this.#wordSpacing;
          ++wordCount;
        } else {
          output.push({
            text: line.trimEnd(),
            count: wordCount + 1,
            width: widthLine,
            justify: false,
          });

          line = "";
          widthLine = 0;
          widthGap  = 0;
          wordCount = 0;
        }

        widthCurr = 0;
      } else {
        let glyph = this.#font.getGlyph(char);
        let widthChar = 0;

        if (glyph !== undefined) {
          // calculate the width that the current
          // character takes up accounting for
          // kerning and other font settings

          widthChar += glyph.width * this.#fontScale;

          if (prevGlyph !== null) {
            widthChar += this.#letterSpacing;
            let kern = this.#font.getKerning(prevGlyph.char +
                glyph.char);
            
            if (kern !== undefined) {
              widthChar += kern;
            }
          }

          prevGlyph = glyph;
        }


        if (this.#maxWidth > 0 && wrap.required === false) {
          // if a word wrap is enabled (via fixed width)
          // and we haven't yet deduced if it is necessary
          // for the current word

          let width = widthLine + widthGap + widthCurr + widthChar;

          if (this.#hyphenate && wrap.index < 0 &&
              width + hyphenWidth > this.#maxWidth) {
            // find the point at which we can hyphenate
            // (split the word but still fit a hyphen in)

            wrap.index = word.length;
          }

          if (width > this.#maxWidth) {
            // if whole word doesn't fit it needs to
            // be wrapped

            wrap.required = true;
          }

          // store the width of the current word
          wrap.widths.push(widthCurr);
        }

        widthCurr += widthChar;
        word += char;
      }
    }

    // add any remaining text as the final line
    line = line.trimEnd();
    if (line !== "") {
      output.push({
        text: line,
        count: wordCount,
        width: widthLine,
        justify: false,
      });
    }
    
    return output;
  }
};

export default RenderString;
