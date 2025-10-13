import Vec2 from './vec2.js';
import Vec4 from './vec4.js';

class ImageArray {
  // an ImageArray holds an array of image data in the
  // format RGBA, with methods to manipulate in place
  // or return new image data

  _data = new Uint8ClampedArray();

  _width = 0;
  _height = 0;

  constructor() {

  }

  get data() { return this._data; }
  get width()  { return this._width;  }
  get height() { return this._height; }

  fromImage(image) {
    if (!(image instanceof Image)) {
      throw new TypeError("ImageArray (fromImage): image should " +
      "be an Image (HTMLImageElement)");
    }

    // create a canvas and context the size of our image and
    // then render the image before copying the data to an array

    this._width  =  image.width;
    this._height = image.height;

    let cnv = new OffscreenCanvas(image.width, image.height);
    let ctx = cnv.getContext("2d");

    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, image.width, image.height);
    this._data = new Uint8ClampedArray(imageData.data);
  }

  fromImageData(imageData, widthIn, heightIn) {
    if (typeof widthIn !== 'number') {
      throw new TypeError("ImageArray (fromImageData): widthIn " +
      "should be a Number");
    } else if (!(imageData instanceof ImageData)) {
      throw new TypeError("ImageArray (fromImageData): imageData " +
      "should be an ImageData");
    }

    // if a height is supplied use it, otherwise we can infer it
    // by using the number of RGBA values (divide length by 4)
    // in the image and dividing it by number of rows (width)

    let height = heightIn;
    if (heightIn === undefined) {
      height = (imageData.data.length * 0.25) / widthIn;
    } else if (typeof heightIn !== 'number') {
      throw new TypeError("ImageArray (fromImageData): heightIn " +
      "should be a Number");
    } 

    this._width  = widthIn;
    this._height =  height;
    this._data = new Uint8ClampedArray(imageData.data);
  }

  getArray(xIn, yIn, widthIn, heightIn) {
    // return a portion (rectangle) of the ImageArray as a separate
    // array (Uint8ClampedArray) plus a width and height
    // (note that the origin is top-left)

    // first, sanitise input to ensure it is a valid
    // rectangle (albeit with a possible zero width/height)

    let lower = new Vec2((xIn !== undefined) ? xIn : 0,
      (yIn !== undefined) ? yIn : 0);
    lower.x = Math.min(Math.max(0, lower.x),  this._width);
    lower.y = Math.min(Math.max(0, lower.y), this._height);

    let upper = new Vec2((widthIn !== undefined) ? widthIn : this._width,
      (heightIn !== undefined) ? heightIn : this._height);
    upper.x = Math.min(lower.x + Math.max(0, upper.x),  this._width) - 1;
    upper.y = Math.min(lower.y + Math.max(0, upper.y), this._height) - 1;

    if (lower.x !== upper.x && lower.y != upper.y && this._width > 0) {
      // if rectangle is valid and ImageArray has a valid width
      // then iterate elements and return only those the fall
      // within the rectangle

      let invWidth = 1 / this._width;

      let arr = this._data.filter((ele, ind, arr) => {
        // divide the current index by 4 (RGBA) and then
        // convert it into an x and y value and then return
        // true if it is within supplied rectangle

        let i = Math.floor(ind * 0.25);

        let x = i % this._width;
        if (x < lower.x || x > upper.x) {
          return false;
        }

        let y = Math.floor(i * invWidth);
        if (y < lower.y || y > upper.y) {
          return false;
        }

        return true;
      });

      return {
        data: arr,
        width: upper.x + 1 - lower.x,
        height: upper.y + 1 - lower.y,
      }
    }

    // unable to return a valid rectangle
    return {
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
    }
  }

  resize(width, height, origin = 0, fill = new Vec4(0, 0, 0, 0)) {
    // calculate the amount we have to add or remove from
    // the top, bottom and sides of our image, depending on
    // where the origin is set to, and then pass the values
    // to the offset method

    let padTop = 0;
    let padBottom = height - this._height;
    if (origin === 3 || origin === 4 || origin === 5) {
      padTop = Math.trunc(padBottom * 0.5);
      padBottom -= padTop;
    } else if (origin === 6 || origin === 7 || origin === 8) {
      padTop = padBottom;
      padBottom = 0;
    }

    let padLeft = 0;
    let padRight = width - this._width;
    if (origin === 1 || origin === 4 || origin === 7) {
      padLeft = Math.trunc(padRight * 0.5);
      padRight -= padLeft;
    } else if (origin === 2 || origin === 5 || origin === 8) {
      padLeft = padRight;
      padRight = 0;
    }

    this.offset(padLeft, padRight, padTop, padBottom, fill);
  }

  offset(left, right, top, bottom, fill = new Vec4(0, 0, 0, 0)) {
    let result = new Array();

    let newWidth = Math.max(this._width + left + right, 0);
    let newHeight = Math.max(this._height + top + bottom, 0);

    if (newWidth > 0 && newHeight > 0) {
      // if padding value is negative then we're shrinking the
      // current image which is essentially skipping rows, so we
      // only need to modify the start and/or end offset appropiately

      let start = 0;
      let end = this._data.length;

      if (top < 0) {
        start = Math.abs(top) * this._width * 4;
      } else if (top > 0) {
        // otherwise if top padding value is positive then we need
        // to insert rows (of the new width) above our current image
        // before anything else
        
        let fillCount = top * newWidth;
        for (let i = 0; i < fillCount; ++i) {
          result.push(fill.x, fill.y, fill.z, fill.w);
        }
      }

      if (bottom < 0) {
        end -= (Math.abs(bottom) * this._width * 4);
      }

      // create "padding arrays" which hold the data needed
      // to append to the result array to account for an increase
      // in width for the left (pre) and right (post) sides

      let pre = new Array();
      for (let i = 0; i < left; ++i) {
        pre.push(fill.x, fill.y, fill.z, fill.w);
      }

      let post = new Array();
      for (let i = 0; i < right; ++i) {
        post.push(fill.x, fill.y, fill.z, fill.w);
      }

      // iterate our ImageArray's _data row by row, ignoring
      // any rows that are being trimmed off (due to a decrease
      // in height)

      let index = start;
      let row = this._width * 4;

      let startOffset = (left < 0) ? (Math.abs(left) * 4) : 0;
      let endOffset = (right < 0) ? (Math.abs(right) * 4) : 0;

      while (index < end) {
        // add a modified row to the new data (result) array:
        //   - add any left-side padding
        //   - add image data accounting for left/right trimming
        //   - add any right-side padding
        //   - update index to start of next row

        result = result.concat(pre);

        let rowStart = index + startOffset;
        let rowEnd = index + (row - endOffset);

        for (let i = rowStart; i < rowEnd; ++i) {
          result.push(this._data.at(i));
        }

        result = result.concat(post);
        index += row;
      }

      // finally add any padding to the end of the array
      // as is necessary

      if (bottom > 0) {
        let fillCount = bottom * newWidth;
        for (let i = 0; i < fillCount; ++i) {
          result.push(fill.x, fill.y, fill.z, fill.w);
        }
      }
    } else {
      // if either the width or height is 0 then make sure
      // to zero the other

      newWidth  = 0;
      newHeight = 0;
    }


    this._width  =  newWidth;
    this._height = newHeight;
    this._data = new Uint8ClampedArray(result);
  }

  replace(dataIn, widthIn, xIn = 0, yIn = 0) {
    // [!] handle non-rectangular input data

    // replace a portion this ImageArray's _data in place
    // with the data specified, offset by (xIn, yIn)

    if (!(dataIn instanceof Array) &&
      !(dataIn instanceof Uint8ClampedArray)) {

      throw new TypeError("ImageArray (replace): dataIn " +
      "should be an Array or a Uint8ClampedArray");
    }

    if (typeof widthIn !== 'number') {
      throw new TypeError("ImageArray (replace): widthIn " +
      "should be a Number");
    } else if (typeof xIn !== 'number') {
      throw new TypeError("ImageArray (replace): xIn should " +
      "be a Number");
    } else if (typeof yIn !== 'number') {
      throw new TypeError("ImageArray (replace): yIn should " +
      "be a Number");
    }

    // sanitise the x and y coordinate inputs, paying special
    // attention to the x coordinate as it will wrap around if
    // it is off the end of the row (whereas the y coordinate
    // will be naturally handled by the while loop condition)

    let x = Math.min(Math.max(xIn, 0), this._width - 1);
    let y = Math.max(yIn, 0);

    // determine how much of a row we need to replace (either
    // the width of the replacement data, or the remaining
    // width of the ImageArray's _data, whichever is shorter)
    // and maintain 2 separate indices (for each data array)

    let rowEnd = Math.min((this._width - x) * 4, widthIn * 4);
    let index = ((y * this._width) + x) * 4;
    let indexIn = 0;
    
    while (index < this._data.length && indexIn < dataIn.length) {
      // go row by row, replacing the appropiate data, until we
      // either run out of replacement data or run out of space
      // in the ImageArray

      for (let i = 0; i < rowEnd; ++i) {
        this._data[index + i] = dataIn[indexIn + i];
      }

      index += this._width * 4;
      indexIn += widthIn * 4;
    }
  }

  // [!] method to shift an image
  //     - either wrap contents or replace with specified colour
};

export default ImageArray;
