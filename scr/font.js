import TTFParser from './ttfparser.js';

class Font {
  static Glyph = class {
    // tex coords (s, t and w)
    // 
  }


  #texture = null;
  // kerning?

	constructor() {
    
	}

  async fromBuffer(buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError("Font (fromBuffer): buffer should be an " +
      "ArrayBuffer");
    }

    let parser = new TTFParser();
    await parser.parseBuffer(buffer);

    console.log(parser);

    await new Promise((resolve) => { setTimeout(resolve, 2000); });

    // get glyphs from parser
    // get other stuff we need
    // make a texture
  }
};

export default Font;
