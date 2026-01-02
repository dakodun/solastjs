import APP, { sol } from './init.js';

class RenderMessage extends sol.RenderString {
  // a RenderChar (render character) holds the base vertices
  // required to render an individual glyph (without animation or
  // styling from custom control) and an associated control and
  // position in control block (if any)

  static RenderChar = class RenderChar {
    vertices = new Array();
    control = null;
    position = 0;

    constructor(initializerList = {}) {

    }

    get weight() {
      if (this.control) {
        return this.control.weight;
      }

      return 1;
    }

    get color() {
      if (this.control) {
        return this.control.color;
      }

      return null;
    }

    get offset() {
      // call this RenderChar's control's animation callback
      // and return an offset based on the algorithm

      if (this.control) {
        return this.control.getOffset(this.position);
      }

      return new sol.Vec2();
    }

    copy(other) {
      if (!(other instanceof RenderMessage.RenderChar)) {
        throw new TypeError("RenderMessage.RenderChar (copy): other " +
        "should be a RenderMessage.RenderChar");
      }

      this.vertices.splice(0, this.vertices.length);
      for (const vert of other.vertices) {
        this.vertices.push(vert.getCopy());
      }

      this.control = other.control;
      this.position = other.position;
    }

    getCopy() {
      let copy = new RenderMessage.RenderChar();
      copy.copy(this);

      return copy;
    }
  };

  // a Control contains custom styling (font weight, colour, etc) and
  // custom animation algorithm

  static Control = class Control {
    char = "";

    color = null;
    weight = 1;

    animFunc = null;

    constructor(char, initializerList = {}) {
      this.char = char;

      this.color = initializerList.color || null;
      this.weight = initializerList.weight || 1;

      this.animFunc = initializerList.animFunc || null;
    }

    copy(other) {
      if (!(other instanceof RenderMessage.Control)) {
        throw new TypeError("RenderMessage.Control (copy): other " +
        "should be a RenderMessage.Control");
      }

      this.char = other.char;

      this.color = (other.color) ? other.color.getCopy() : null;
      this.weight = other.weight;

      this.animFunc = other.animFunc;
    }

    getCopy() {
      let copy = new RenderMessage.Control();
      copy.copy(this);

      return copy;
    }

    process(dt) {
      if (this.animFunc && this.animFunc.process) {
        this.animFunc.process(this, dt);
      }
    }

    getOffset(position) {
      if (this.animFunc && this.animFunc.getOffset) {
        return this.animFunc.getOffset(this, position);
      }

      return new sol.Vec2();
    }
  };


  //

  static Line = class Line {
    text = "";
    width = 0;
    justify = true;
    count = 0;

    startControl = "";
    startNewLine = "";
    endSpace = " ";
    endHyphen = false;
    
    constructor(text, initializerList = {}) {
      this.text = text;

      this.startControl = initializerList.startControl || "";
      this.startNewLine = initializerList.startNewLine || "";
      this.endSpace = initializerList.endSpace || " ";
      this.endHyphen = initializerList.endHyphen || false;
    }
  };

  //
  
  _controlMap = new Map();
  _lines = new Array();

  _typing = false;
  _typingTimer = 0;
  _typingSpeed = 0.02;

  _lineLimit = 3;
  _charCount = 0;

  constructor(font = undefined, text = undefined) {
    super();

    if (font !== undefined) {
      this.font = font;
    }
    
    if (text !== undefined) {
      this.text = text;
    }
  }

  get typing() { return this._typing; }

  get maxHeight() {
    let height = ((this._lineLimit - 1) * this._font.lineHeight *
      this._lineSpacing) + this._font.lineHeight;
    
    return height;
  }

  set text(text) {
    super.text = text;
    
    this._lines.splice(0);
    this._lines.push(new RenderMessage.Line(this._text, {
      endSpace: "",
    }));

    this._typing = true;
    this._typingTimer = 0;

    this._charCount = 0;
  }

  input() {
    
  }

  process(dt) {
    for (const [key, value] of this._controlMap) {
      value.process(dt);
    }

    // if message is still typing then increment the timer and
    // character displayed count if necessary

    if (this._typing === true && this._charCount !== -1) {
      while (this._typingTimer > this._typingSpeed) {
        ++this._charCount;
        this._typingTimer -= this._typingSpeed;
      }

      this._typingTimer += dt;
    }
  }

  asData() {      
    this._generateVerts();

    let rbd = new sol.RenderBatchData();
    let transMat = this.transformable.asMat3();

    let verts = new Array();

    // retrieve only the number of lines desired for processing

    let lineLimit = Math.min(this._lineLimit, this._vertices.length);
    let lineOffset = this._font.lineHeight *
      this._lineSpacing * (this._lineLimit - 1);

    for (let i = 0; i < lineLimit; ++i) {
      for (let char of this._vertices.at(i)) {
        let c = char.getCopy();
        c.lineOffset = lineOffset;

        verts.push(c);
      }

      lineOffset -= this._font.lineHeight * this._lineSpacing;
    }

    
    let indexCount = 0;
    let charCount = 0;

    for (let char of verts) {
      if (charCount === this._charCount) {
        charCount = -1;
        break;
      }

      // create an array of vertices for rendering - base vertices
      // modified to account for custom control styling and animation

      let vboVerts = new Array();
      for (let vert of char.vertices) {
        let vboVert = vert.getCopy();

        let offset = char.offset;
        offset.x = Math.round(offset.x);
        offset.y = Math.round(offset.y + char.lineOffset);

        vboVert.x = (transMat.arr[0] * vert.x) +
          (transMat.arr[3] * (vert.y + offset.y)) + transMat.arr[6];
        vboVert.y = (transMat.arr[1] * vert.x) +
          (transMat.arr[4] * (vert.y + offset.y)) + transMat.arr[7];
        vboVert.z = this.depth;

        
        let color = (char.color) ? char.color.getCopy() :
          this.color.getCopy();

        vboVert.r = color.x;
        vboVert.g = color.y;
        vboVert.b = color.z;
        vboVert.a = this.alpha;
        
        vboVerts.push(vboVert);
        rbd.vertices.push(vboVert);
      }

      rbd.indices.push(indexCount    );
      rbd.indices.push(indexCount + 2);
      rbd.indices.push(indexCount + 1);

      rbd.indices.push(indexCount + 2);
      rbd.indices.push(indexCount    );
      rbd.indices.push(indexCount + 3);
      indexCount += 4;

      // if the current render character has a weight greater
      // than 1 (default), create a copy of vertices and offset
      // them (note that extra spacing and indexing has already
      // been accounted for in render character generation)

      for (let i = 1; i < char.weight; ++i) {
        for (let vert of vboVerts) {
          let vboVert = vert.getCopy();

          vboVert.x += i;
          rbd.vertices.push(vboVert);
        }

        rbd.indices.push(indexCount    );
        rbd.indices.push(indexCount + 2);
        rbd.indices.push(indexCount + 1);

        rbd.indices.push(indexCount + 2);
        rbd.indices.push(indexCount    );
        rbd.indices.push(indexCount + 3);
        indexCount += 4;
      }

      ++charCount;
    }

    if (charCount !== -1) {
      this._charCount = -1;
    }

    rbd.textureRef = this.font.texture.texture;
    rbd.depth = this.depth;

    return [rbd];
  }

  addControl(char, initializerList = {}) {
    this._controlMap.set(char,
      new RenderMessage.Control(char, initializerList));
  }

  advance() {
    // either complete the current typing message instantly or if
    // already done then remove the currently displayed lines and
    // start typing the next ones

    // [!] a delay after message complete - slight so as to
    // not be noticeable but enough to prevent accidental
    // text skipping

    if (this._typing === true) {
      if (this._charCount !== -1) {
        this._charCount = -1;
      } else {
        this._lines.splice(0, this._lineLimit);
        
        if (this._lines.length !== 0) {
          this._lines[0].text = this._lines[0].startControl +
            this._lines[0].text;
          this._lines[0].startNewLine = "";
          this._lines[0].startControl = "";
        } else {
          this._typing = false;
        }

        this._charCount = 0;
        this._vertices.splice(0);
      }
    }
  }

  _generateVerts() {
    if (this._vertices.length === 0) {
      let bbox = {
        lower: new sol.Vec2(0, 0),
        upper: new sol.Vec2(0, 0),
      };

      if (this._lines.length !== 0) {
        this._lines = this._preParse();

        // let indexCount = 0;
        
        // let height = (this.lines.length - 1) *
        //   (this._font.lineHeight * this._lineSpacing);
        let height = ((this._lineLimit - 1) * this._font.lineHeight *
          this._lineSpacing) + this._font.lineHeight;
        
        // let cursor = new sol.Vec2(0, height);
        let cursor = new sol.Vec2(0, 0);
        
        // bbox.upper = new sol.Vec2(this._maxWidth, height);
        bbox.upper = new sol.Vec2(this._maxWidth, height);
        
        let prevGlyph = null;

        // current control state
        let control = null;
        let position = 0;
        let weight = 1;

        for (let line of this._lines) {
          // add a new array to vertices as we want to
          // separate vertices into individual lines
          this._vertices.push(new Array());

          let align = {
            left: 0,
            space: 0,
          };

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
            // check if current character is a control character and
            // if so process it, and then move to the next character
            // (skip rendering)

            if (control && control.char === char) {
              control = null;
              weight = 1;

              continue;
            } else {
              let newControl = this._controlMap.get(char);
              if (newControl !== undefined) {
                control = newControl;
                position = 0;
                weight = control.weight;

                continue;
              }
            }
            
            if (char === " ") {
              cursor.x += this._font.advance + this._wordSpacing;
              cursor.x += this._letterSpacing;
              cursor.x += align.space;
            } else {
              let glyph = this._font.getGlyph(char);

              if (glyph !== undefined) {
                let s = new sol.Vec2(glyph.s.x, glyph.s.y);
                let t = new sol.Vec2(glyph.t.x, glyph.t.y);
                let l = glyph.layer;

                let w = glyph.width;
                let h = glyph.height;
                let b = glyph.bottom;

                if (prevGlyph) {
                  cursor.x += this._letterSpacing;

                  let kern = this._font.getKerning(prevGlyph.char + glyph.char);
                  if (kern) {
                    cursor.x += kern;
                  }
                }

                bbox.upper.y = Math.max(bbox.upper.y, cursor.y + glyph.top);

                let curs = new sol.Vec2(Math.round(cursor.x),
                  Math.round(cursor.y));
                
                // create renderChars instead of vertices so we can
                // store control related information alongside
                // the vertices

                let renderChar = new RenderMessage.RenderChar();
            
                if (control) {
                  renderChar.control = control;
                  renderChar.position = position++;
                }

                renderChar.vertices.push(
                  new sol.VBOVertex({
                    x: curs.x, y: -b + curs.y,
                    s: s.x, t: t.y, textureFlag: 1, textureLayer: l,
                  }),
                );

                renderChar.vertices.push(
                  new sol.VBOVertex({
                    x: curs.x + w, y: -b + curs.y,
                    s: s.y, t: t.y, textureFlag: 1, textureLayer: l,
                  }),
                );

                renderChar.vertices.push(
                  new sol.VBOVertex({
                    x: curs.x + w, y: (h - b) + curs.y,
                    s: s.y, t: t.x, textureFlag: 1, textureLayer: l,
                  }),
                );

                renderChar.vertices.push(
                  new sol.VBOVertex({
                    x: curs.x, y: (h - b)  + curs.y,
                    s: s.x, t: t.x, textureFlag: 1, textureLayer: l,
                  }),
                );

                this._vertices[this._vertices.length - 1].push(renderChar);

                // when updating the cursor, account for extra spacing
                // required due to non-default font weight

                cursor.x += w + (weight - 1);
                prevGlyph = glyph;
              }
            }
          }

          bbox.upper.x = Math.max(bbox.upper.x, cursor.x);

          cursor.x = 0;
          // cursor.y -= this._font.lineHeight * this._lineSpacing;
          prevGlyph = null;
        }

        bbox.upper.x = Math.max(bbox.upper.x, cursor.x);
      }

      this._transformable.boundingBox.upper = new sol.Vec2(
        Math.round(bbox.upper.x), Math.round(bbox.upper.y - this._font.drop));
      this._transformable.boundingBox.lower = new sol.Vec2(0, -this._font.drop);

      // lower is the last line's drop
    }
  }

  _preParse () {
    let linesIn = new Array();
    let linesOut = new Array();
    
    // 
    let text = "";
    for (let line of this._lines) {
      let lineText = (line.endHyphen === true) ?
        line.text.substring(0, line.text.length - 1) : line.text;
      text += line.startNewLine + lineText + line.endSpace;
    }

    if (text !== "") {
      let lines = text.split("\n");
      lines.forEach((ele, ind, arr) => {
        linesIn.push(ele.split(" "));
      });
    }

    let hyphenWidth = this._font.hyphen;

    // 
    let controlDef = new RenderMessage.Control("");
    let controlCurr = controlDef;
    let controlStart = controlDef;

    let lineCurr = new RenderMessage.Line("");

    for (let line of linesIn) {
      let prevGlyph = null;

      lineCurr.width = 0;
      let widthGap = 0;

      for (let word of line) {
        let widthWord = 0;
        let hyphenInfo = {wrap: false, before: 0, after: 0}

        let wordData = new Array();
        let wordIndex = 0;

        let wrap = false;
        let firstChar = true;

        // 
        controlStart = controlCurr;
        
        for (let char of word) {
          ++wordIndex;

          // first check if current char is a control char, if so:
          // - check if it matches the current active control and
          //   then disable it
          // - otherwise enable the new control
          // - move on to the next char
          let control = this._controlMap.get(char);
          if (control !== undefined) {
            if (control === controlCurr) {
              controlCurr = controlDef;
            } else {
              controlCurr = control;
            }

            continue;
          }

          let glyph = this._font.getGlyph(char);
          if (glyph !== undefined) {
            widthWord += glyph.width;
            widthWord += (controlCurr.weight - 1);

            let kerning = 0;
            let kerningHyphen = 0;

            if (prevGlyph !== null) {
              let kern = this._font.getKerning(prevGlyph.char +
                  glyph.char);
              kerning = (kern !== undefined) ? kern : 0;
              kerning += this._letterSpacing;

              if (firstChar === true) {
                widthGap += kerning;
              } else {
                widthWord += kerning;
              }

              kern = this._font.getKerning(glyph.char + "-");
              kerningHyphen = (kern !== undefined) ? kern : 0;
            }

            prevGlyph = glyph;
            firstChar = false;

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

            if (hyphenInfo.wrap === false) {
              ++hyphenInfo.before;
            } else {
              ++hyphenInfo.after;
            }

            wordData.push({char: char, indexInWord: wordIndex,
              currLineWidth: width, kerningAdj: kerning});
          }
        }

        if (wrap === true) {
          if (hyphenInfo.wrap === true) {
            let limit = 3;
            let length = hyphenInfo.before;

            if (length < limit) {
              hyphenInfo.wrap = false;
            } else {
              if (hyphenInfo.after < limit) {
                length -= limit - hyphenInfo.after;
              }

              if (length >= limit) {
                let index = wordData[length - 1].indexInWord;
                
                let wWord = wordData[length - 1].currLineWidth +
                  wordData[length - 1].kerningAdj;
                let wLine = lineCurr.width + widthWord + widthGap;
                
                lineCurr.text += (widthGap !== 0) ? " " : "";
                lineCurr.text += word.substring(0, index) + "-";
                lineCurr.width =
                  wordData[length - 1].currLineWidth + hyphenWidth;
                ++lineCurr.count;

                // 
                lineCurr.endHyphen = true;
                lineCurr.endSpace = "";
                linesOut.push(lineCurr);

                lineCurr = new RenderMessage.Line(word.substring(index), {
                  startControl: controlCurr.char,
                });

                lineCurr.width = wLine - wWord;
                ++lineCurr.count;
              } else {
                hyphenInfo.wrap = false;
              }
            }
          }

          if (hyphenInfo.wrap === false) {
            if (lineCurr.text === "") {
              wrap = false;
            } else {
              linesOut.push(lineCurr);
              lineCurr = new RenderMessage.Line(word, {
                startControl: controlStart.char,
              });

              lineCurr.width = widthWord;
              ++lineCurr.count;
            }
          }
        }

        if (wrap === false) {
          lineCurr.text += (widthGap !== 0) ? " " : "";
          lineCurr.text += word;
          lineCurr.width += widthGap + widthWord;
          ++lineCurr.count;
        }

        widthGap = this._font.advance + this._wordSpacing +
          this._letterSpacing;
      }

      lineCurr.justify = false;
      lineCurr.endSpace = "";
      linesOut.push(lineCurr);

      lineCurr = new RenderMessage.Line("", {
        startControl: controlCurr.char,
        startNewLine: "\n",
      });
    }

    return linesOut;
  }
};

export default RenderMessage;
