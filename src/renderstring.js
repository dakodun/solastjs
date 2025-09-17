import GL from './gl.js'

import AtlasFont from './atlasfont.js';
import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Transformable2D from './transformable2d.js';
import VBOVertex from './vbovertex.js';
import Vec2 from './vec2.js';

class RenderString {
  _font = null;
  _text = "";

  _letterSpacing = 0;
  _wordSpacing = 0;
  _lineSpacing = 1.0;
  _fontScale = 1.0;
  _maxWidth = 0;
  _hyphenate = false;
  _align = "left";

  _vertices = [];
  _indices = [];
  
  _transformable = new Transformable2D();
  _renderable = new Renderable();

	constructor(font = null, text = "") {
    this.font = font;
    this.text = text;
	}

  get font() { return this._font; }
  get text() { return this._text; }
  get letterSpacing() { return this._letterSpacing; }
  get wordSpacing() { return this._wordSpacing; }
  get lineSpacing() { return this._lineSpacing; }
  get fontScale() { return this._fontScale; }
  get maxWidth() { return this._maxWidth; }
  get hyphenate() { return this._hyphenate; }
  get align() { return this._align; }

  get width() {
    // in order to get an accurate width measurement
    // we must have already generated our render
    // strings vertices

    if (this._vertices.length === 0) {
      this._generateVerts();
    }

    return this.boundingBox.upper.x - this.boundingBox.lower.x;
  }

  get height() {
    if (this._vertices.length === 0) {
      this._generateVerts();
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

    this._font = font;
    this._vertices.splice(0);
    this._indices.splice(0);
  }

  set text(text) {
    if (typeof text !== 'string') {
      throw new TypeError("RenderString (text): text should be " +
      "a String");
    }

    this._text = text;
    this._vertices.splice(0);
    this._indices.splice(0);
  }

  set maxWidth(maxWidth) {
    if (typeof maxWidth !== 'number') {
      throw new TypeError("RenderString (maxWidth): maxWidth should " + 
      "be a Number");
    }

    this._maxWidth = (maxWidth > 0) ? maxWidth : 0;
    this._vertices.splice(0);
    this._indices.splice(0);
  }

  set hyphenate(hyphenate) {
    this._hyphenate = hyphenate;
    this._vertices.splice(0);
    this._indices.splice(0);
  }

  set align(align) {
    if (typeof align !== 'string') {
      throw new TypeError("RenderString (align): align should " + 
      "be a String (left, center, right, or justify)");
    }

    this._align = (align === "center" || align === "right" ||
      align === "justify") ? align : "left";
    this._vertices.splice(0);
    this._indices.splice(0);
  }

  // transformable helpers
  // error handling occurs in Transformable class
  get transformable() { return this._transformable; }
  get position() { return this._transformable.position; }
  get origin()   { return this._transformable.origin;   }
  get transMat() { return this._transformable.transMat; }
  get scale()    { return this._transformable.scale;    }
  get rotation() { return this._transformable.rotation; }
  get boundingBox() {
    if (this._vertices.length === 0) {
      this._generateVerts();
    }

    return this._transformable.boundingBox;
  }

  set position(position) { this._transformable.position = position; }
  set origin(origin)     { this._transformable.origin = origin;     }
  set transMat(transMat) { this._transformable.transMat = transMat; }
  set scale(scale)       { this._transformable.scale = scale;       }
  set rotation(rotation) { this._transformable.rotation = rotation; }
  set boundingBox(boundingBox) {
    this._transformable.boundingBox = boundingBox;
  }
  //

  // renderable helpers
  // error handling occurs in Renderable class
  get renderable() { return this._renderable; }
  get color() { return this._renderable.color; }
  get alpha() { return this._renderable.alpha; }
  get depth() { return this._renderable.depth; }
  get shader() { return this._renderable.shader; }

  set color(color) { this._renderable.color = color; }
  set alpha(alpha) { this._renderable.alpha = alpha; }
  set depth(depth) { this._renderable.depth = depth; }
  set shader(shader) { this._renderable.shader = shader; }
  //

  asData() {
    // generate our glyph vertices and then transform
    // them using the properties of our transformable
    // object

    this._generateVerts();

    let rbd = new RenderBatchData();
    let transMat = this.transformable.asMat3();

    for (let vert of this._vertices) {
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

    rbd.indices = this._indices.slice();
    rbd.textureRef = this._font.texture.texture;

    return [rbd];
  }

  _generateVerts() {
    // if we don't already have any vertices generated then
    // create quads by matching characters from our text
    // to the corresponding glyphs in our font, then update
    // width and height

    if (this._vertices.length === 0) {
      let lines = this._preParse();

      let indexCount = 0;
      let height = (lines.length - 1) *
        (this._font.lineHeight * this._lineSpacing);
      let cursor = new Vec2(0, height);
      
      let bbox = {
        lower: new Vec2(0, 0),
        upper: new Vec2(this._maxWidth, height),
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
        if (this._maxWidth > 0) {
          align.left = (this._align === "right")
            ? (this._maxWidth - line.width) : (this._align === "center")
            ? (this._maxWidth - line.width) * 0.5 : 0
          
          align.space = (this._align === "justify" &&
            line.count > 1 && line.justify)
            ? (this._maxWidth - line.width) / (line.count - 1) : 0
        }

        cursor.x = align.left;

        for (let char of line.text) {
          if (char === " ") {
            // (by not setting or unsetting prevGlyph here we kern
            // based on last 'valid' glyph)

            cursor.x += this._font.advance + this._wordSpacing;
            cursor.x += align.space;
          } else {
            let glyph = this._font.getGlyph(char);

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

                cursor.x += this._letterSpacing;

                let kern = this._font.getKerning(prevGlyph.char + glyph.char);
                cursor.x += (kern !== undefined) ? kern : 0;
              }
              
              // update the height of the bounding box accounting for
              // multiple lines
              bbox.upper.y = Math.max(bbox.upper.y, cursor.y + glyph.top);

              // calculate the vertices for the current quad then
              // advance the cursor
              let curs = new Vec2(Math.round(cursor.x),
                Math.round(cursor.y));

              this._vertices.push(new VBOVertex({
                x: curs.x, y: -b + curs.y,
                s: s.x, t: t.y, textureFlag: 1, textureLayer: l,
              }));

              this._vertices.push(new VBOVertex({
                x: curs.x + w, y: -b + curs.y,
                s: s.y, t: t.y, textureFlag: 1, textureLayer: l,
              }));

              this._vertices.push(new VBOVertex({
                x: curs.x + w, y: (h - b) + curs.y,
                s: s.y, t: t.x, textureFlag: 1, textureLayer: l,
              }));

              this._vertices.push(new VBOVertex({
                x: curs.x, y: (h - b)  + curs.y,
                s: s.x, t: t.x, textureFlag: 1, textureLayer: l,
              }));

              cursor.x += glyph.width;

              // calculate the indices for the current quad then
              // increment the counter
              this._indices.push(indexCount    );
              this._indices.push(indexCount + 2);
              this._indices.push(indexCount + 1);

              this._indices.push(indexCount + 2);
              this._indices.push(indexCount    );
              this._indices.push(indexCount + 3);

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
        cursor.y -= this._font.lineHeight * this._lineSpacing;
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

  _preParse() {
    let linesIn = new Array();
    let linesOut = new Array();

    // split the text firstly into individual lines (at newline
    // character) and then further into individual words (at space)
    if (this._text !== "") {
      let lines = this._text.split("\n");
      lines.forEach((ele, ind, arr) => {
        linesIn.push(ele.split(" "));
      });
    }

    let hyphenWidth = this._font.hyphen;
    let lineCurr = {text: "", width: 0, justify: true, count: 0};

    for (let line of linesIn) {
      let prevGlyph = null;

      lineCurr.width = 0;
      let widthGap = 0;

      for (let word of line) {
        let widthWord = 0;
        
        // information relating to hyphenation
        let hyphenInfo = {
          // true if hyphenation latest hyphenation point found
          // (that is, word part PLUS hyphen still fits on line)
          wrap: false,

          // the number of characters (valid - not undefined)
          // before and after the hyphenation point (not including
          // the hyphen itself)
          before: 0,
          after: 0,
        }

        // wordData holds information (index in word, width/metrics)
        // about valid characters in current word - wordIndex keeps
        // track of the current character regardless of validity
        let wordData = new Array();
        let wordIndex = 0;

        let wrap = false;
        let firstChar = true;
        
        for (let char of word) {
          ++wordIndex;

          // retrieve the matching glyph from the font and
          // update the current word width
          let glyph = this._font.getGlyph(char);
          if (glyph !== undefined) {
            widthWord += glyph.width * this._fontScale;

            let kerning = 0;
            let kerningHyphen = 0;

            if (prevGlyph !== null) {
              widthWord += this._letterSpacing;

              let kern = this._font.getKerning(prevGlyph.char +
                  glyph.char);
              kerning = (kern !== undefined) ? kern : 0;

              if (firstChar === true) {
                widthGap += kern;
              } else {
                widthWord += kern;
              }

              // find the kerning value between the current character
              // and the hyphen for a more accurate wrap
              kern = this._font.getKerning(glyph.char + "-");
              kerningHyphen = (kern !== undefined) ? kern : 0;
            }

            prevGlyph = glyph;
            firstChar = false;

            // if current word width breaches the limit then wrapping
            // is required - if current word width plus ther width of
            // a hyphen breaches (and hyphenation is desired) then
            // hyphen wrap is required
            // (hyphen wrap will always trigger at the same time or
            // before regular word wrap)
            let width = lineCurr.width + widthWord + widthGap;
            if (this._maxWidth > 0 && wrap === false) {
              if (width > this._maxWidth) {
                wrap = true;
              }

              if (this._hyphenate && hyphenInfo.wrap === false &&
                  (width + hyphenWidth + kerningHyphen) > this._maxWidth) {
                
                hyphenInfo.wrap = true;
              }
            }

            // store index of current character in word and the
            // current length of the line unless we've already
            // found last suitable hyphenation point in which
            // case keep track of valid glyphs after that point
            if (hyphenInfo.wrap === false) {
              ++hyphenInfo.before;
            } else {
              ++hyphenInfo.after;
            }

            wordData.push({char: char, indexInWord: wordIndex,
              currLineWidth: width, kerningAdj: kerning});
          }
        }

        // handle wrapping of current word if necessary using
        // a fall back approach:
        // - hyphenate word (if enabled/suitable) ->
        // - move word to new line (if enabled) ->
        // - no wrapping of word
        if (wrap === true) {
          if (hyphenInfo.wrap === true) {
            let limit = 3;
            let length = hyphenInfo.before;

            if (length < limit) {
              // we don't have enough characters before the potential
              // hyphen so skip hyphenation for this word and go
              // instead attempt to wrap entire word (later)
              hyphenInfo.wrap = false;
            } else {
              if (hyphenInfo.after < limit) {
                length -= limit - hyphenInfo.after;
              }

              if (length >= limit) {
                let index = wordData[length - 1].indexInWord;
                
                // calculate the width of the new line by subtracting
                // the width at the hyphen point from the current
                // width - the remainder is the width of the new line
                // (also remove kerning between the characters before 
                // and after the hyphen)
                let wWord = wordData[length - 1].currLineWidth +
                  wordData[length - 1].kerningAdj;
                let wLine = lineCurr.width + widthWord + widthGap;
                
                // add the current line using the width up to the
                // hyphen point, including the hyphen width
                lineCurr.text += (widthGap !== 0) ? " " : "";
                lineCurr.text += word.substring(0, index) + "-";
                lineCurr.width = wordData[length - 1].
                  currLineWidth + hyphenWidth;
                ++lineCurr.count;
                linesOut.push(lineCurr);

                // set the new line to the remainder of the hyphenated
                // word, and set the width to the value calculated
                // previously
                lineCurr = {text: word.substring(index),
                  width: wLine - wWord, justify: true, count: 1};
              } else {
                hyphenInfo.wrap = false;
              }
            }
          }

          // either we couldn't or shouldn't insert a hyphen when
          // attempting to wrap so instead try wrap entire word to
          // a new line
          if (hyphenInfo.wrap === false) {
            if (lineCurr.text === "") {
              wrap = false;
            } else {
              linesOut.push(lineCurr);
              lineCurr = {text: word, width: widthWord,
                justify: true, count: 1};
            }
          }
        }

        // if word wrap is disabled or we didn't want to wrap due
        // to current word being the first word on the current line
        if (wrap === false) {
          lineCurr.text += (widthGap !== 0) ? " " : "";
          lineCurr.text += word;
          lineCurr.width += widthGap + widthWord;
          ++lineCurr.count
        }

        widthGap = this._font.advance + this._wordSpacing;
      }

      lineCurr.justify = false;
      linesOut.push(lineCurr);

      lineCurr = {text: "", width: 0, justify: true, count: 0};
    }

    return linesOut;
  }
};

export default RenderString;
