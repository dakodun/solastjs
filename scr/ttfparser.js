class TTFParser {
  tableDirectory = {
    sfntVersion   : 0,
    numTables     : 0,
    searchRange   : 0,
    entrySelector : 0,
    rangeShift    : 0,
  }

  cmap = {
    // checksum  :  0,
    // version   :  0,
    // numTables :  0,
    encodings : [], //

    getEncoding() {
      // create and return an encoding object

      return {
        // format        :  0,
        // length        :  0,
        // language      :  0,
        // segCountX2    :  0,
        // searchRange   :  0,
        // entrySelector :  0,
        // rangeShift    :  0,
        // reservedPad   :  0,
        segments      : [], //

        getSegment() {
          return {
            // endCode          : 0,
            // startCode        : 0,
            // idDelta          : 0,
            // idRangeOffset    : 0,

            // where the index offset is stored for this segment
            // glyphIndexOffset : 0, 

            // mapping of character to glyph index
            glyphIndexMap : new Map(),

            parse(dv) {
              // [start, end, delta, offset, indexOffset]
              for (let i = this.startCode; i < (this.endCode + 1); ++i) {
                let glyphIndex = 0;

                if (this.idRangeOffset === 0) {
                  // add 65536 if glyphIndex is negative
                  glyphIndex = (i + this.idDelta) & 65535;
                } else {
                  // from spec: glyphId = *(idRangeOffset[i]/2 +
                  // (c - startCode[i])+ &idRangeOffset[i]);

                  // offset of this code from the start, multiplied
                  // by two as values are 2-bytes wide
                  let codeOffset = (i - this.startCode) * 2;
                  let offset = codeOffset + this.glyphIndexOffset +
                    this.idRangeOffset;

                  glyphIndex = dv.getUint16(offset);
                }

                this.glyphIndexMap.set(i, glyphIndex);
              }
            },
          }
        },

        parse(dv, start) {
          let offset = start;

          this.length = dv.getUint16(offset + 2);
          this.language = dv.getUint16(offset + 4);
          this.segCountX2 = dv.getUint16(offset + 6);
          this.searchRange = dv.getUint16(offset + 8);
          this.entrySelector = dv.getUint16(offset + 10);
          this.rangeShift = dv.getUint16(offset + 12);
          offset += 14;
          
          // arithmetic right shift halves and floors segCount
          // (segCountX2 will always be positive and even anyway)
          let segCount = this.segCountX2 >> 1;

          // get all values in a single loop by adjusting offset
          // (the + 2 accounts for the rangeShift value
          // present after endCode values)
          for (let i = 0; i < segCount; ++i) {
            let segment = this.getSegment();
            segment.endCode = dv.getUint16(offset);
            segment.startCode = dv.getUint16(offset +
              (segCount * 2) + 2);
            segment.idDelta = dv.getInt16(offset +
              (segCount * 4) + 2);
            
            segment.glyphIndexOffset = offset + (segCount * 6) + 2;
            segment.idRangeOffset = dv.getUint16(segment.glyphIndexOffset);
            
            segment.parse(dv);
            this.segments.push(segment);
            console.log(segment);
            offset += 2;
          }
          
          // get rangeShift value and adjust the offset to the
          // end of the idRangeOffset values
          this.rangeShift = dv.getUint16(offset);
          offset += (segCount * 6) + 2;
        },
      }
    },

    parse(dv, start, length) {
      let offset = start;
      // let end = offset + length;

      this.version = dv.getUint16(offset);
      this.numTables = dv.getUint16(offset + 2);
      offset += 4;

      for (let i = 0; i < this.numTables; ++i) {
        let platformID = dv.getUint16(offset);
        let encodingID = dv.getUint16(offset + 2);
        let subtableOffset = dv.getUint32(offset + 4);

        offset += 8;

        if (platformID === 0 && encodingID === 3) {
          let offsetSub = start + subtableOffset;

          let format = dv.getUint16(offsetSub);
          if (format === 4) {
            let encoding = this.getEncoding();
            encoding.format = format;

            encoding.parse(dv, offsetSub);
            this.encodings.push(encoding);
          }
        }
      }
    },
  }
  
	constructor() {
    
	}

  async parseBuffer(buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError("TTFParser (parseBuffer): buffer should be an " +
      "ArrayBuffer");
    }

    let dv = new DataView(buffer);
    let offset = 0;

    offset = this.#parseTableDir(dv, offset);
    offset = this.#parseTables(dv, offset);
  }


  #parseTableDir(dv, offsetIn) {
    let offset = offsetIn;

    this.tableDirectory.sfntVersion = dv.getUint32(offset);
    this.tableDirectory.numTables = dv.getUint16(offset + 4);
    this.tableDirectory.searchRange = dv.getUint16(offset + 6);
    this.tableDirectory.entrySelector = dv.getUint16(offset + 8);
    this.tableDirectory.rangeShift = dv.getUint16(offset + 10);
    
    offset += 12;
    return offset;
  }

  #parseTables(dv, offsetIn) {
    let offset = offsetIn;

    for (let i = 0; i < this.tableDirectory.numTables; ++i) {
      let tag = String.fromCharCode(
        dv.getUint8(offset),
        dv.getUint8(offset + 1),
        dv.getUint8(offset + 2),
        dv.getUint8(offset + 3)
      );

      this.#parseByTag(dv, offset, tag);
      
      offset += 16;
    }

    return offset;
  }

  #parseByTag(dv, offsetIn, tag) {
    let offset = offsetIn;
    let checksum = dv.getUint32(offset +  4);
    let start    = dv.getUint32(offset +  8);
    let length   = dv.getUint32(offset + 12);
    
    switch(tag) {
      case "cmap" :
        this.cmap.checksum = checksum;
        this.cmap.parse(dv, start, length);

        // [start, end, delta, offset, indexOffset]
        

        for (let seg of segments) {
          for (let i = seg.startCode; i < (seg.endCode + 1); ++i) {
            let glyphIndex = 0;

            if (seg.idRangeOffset === 0) {
              // add 65536 if glyphIndex is negative
              glyphIndex = (i + seg.idDelta) & 65535;
            } else {
              // from spec: glyphId = *(idRangeOffset[i]/2 +
              // (c - startCode[i])+ &idRangeOffset[i]);

              // offset of this code from the start, multiplied
              // by two as values are 2-bytes wide
              let codeOffset = (i - seg.startCode) * 2;
              let offset = codeOffset + seg.glyphIndexOffset +
                seg.idRangeOffset;

              glyphIndex = dv.getUint16(offset);
            }

            glyphIndexMap.set(i, glyphIndex);
          }
        }

        break;
      default :
        break;
    }
  }
};

export default TTFParser;
