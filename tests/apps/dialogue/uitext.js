import APP, { sol, GLStates, GL } from './init.js';

import Magic from './magic.js';
import RenderMessage from './rendermessage.js';

class UIText {
  _renderMsg = new RenderMessage();
  _width = 0;
  _height = 0;

  _script = null;
  _decorations = new Map();

  _decoration = null;
  _decoLow = new sol.Shape();
  _box = new sol.Shape();
  _boxCorner = new sol.Shape();
  _boxLines = new sol.Shape();

  _actCallback = null;

  constructor(font = undefined) {
    this._renderMsg.font = font;
    this._height = this._renderMsg.maxHeight;

    // 

    this._renderMsg.position = new sol.Vec2(0, 8 + font.drop + 8);
    this._renderMsg.color = new sol.Vec3(220);
    this._renderMsg.hyphenate = true;
    this._renderMsg.align = "justify";
    this._renderMsg.depth = -4;
    
    // 

    this._renderMsg.addControl("₁", {
      color: new sol.Vec3(160, 140, 240),
    });

    this._renderMsg.addControl("₂", {
      color: new sol.Vec3(220, 180, 20),
    });

    this._renderMsg.addControl("₃", {
      weight: 2,
      color: new sol.Vec3(220, 180, 20),
    });

    this._renderMsg.addControl("₄", {
      animFunc: {
        amplitude: 4.0,
        timeCur: 0.0,
        timeOff: 6.0,
        timeStep: 6.28,
        process(control, dt) {
          this.timeCur =
            (this.timeCur + (this.timeStep * dt)) % Magic.PI2;
        },
        getOffset(control, position) {
          // get the amplitude at the specified time offset
          // from the current time using glyphs position in
          // the animated string section

          let yOffset = this.amplitude * Math.sin(this.timeCur -
            (this.timeOff + position));

          return new sol.Vec2(0, yOffset);
        },
      },
    });
    
    let texStore = APP.resourceManager.getStore("texture");
    let tex = texStore.getResource("textBottom");
    let dim = new sol.Vec2(tex.width, tex.height);
    this._decoLow.pushVerts([
      new sol.Vec2(    0,     0), new sol.Vec2(dim.x,     0),
      new sol.Vec2(dim.x, dim.y), new sol.Vec2(    0, dim.y),
    ]);
    
    this._decoLow.pushFrame(tex, 0);
    this._decoLow.origin.x = Math.round(tex.width * 0.5);

    this._box.color = new sol.Vec3(36);
    this._box.alpha = 96;
    this._box.depth = -5;

    this._boxCorner.color = new sol.Vec3(220);
    this._boxCorner.alpha = 255;
    this._boxCorner.depth = -6;
    
    this._boxLines.color = new sol.Vec3(220);
    this._boxLines.colors = [
      new sol.Vec3(220),
      new sol.Vec3(128),
      new sol.Vec3(128),
      new sol.Vec3(80),
      new sol.Vec3(80),
      new sol.Vec3(128),
      new sol.Vec3(128),
    ];

    this._boxLines.alpha = 255;
    this._boxLines.renderMode = sol.enums.Rendering.LINES;
    this._boxLines.lineWidth = 2;
    this._boxLines.depth = -6;

    this.resize(APP.canvas.width);
  }

  static loadResources() {
    let texStore = APP.resourceManager.getStore("texture");
    if (texStore === undefined) {
      texStore = APP.resourceManager.addStore("texture");
    }

    // load the notification image and modify it to create
    // a simple animation before passing the new image data
    // to a texture

    let tex = texStore.getResource("uiNotify");
    if (tex === undefined) {
      APP.resourceLoader.loadImage("res/notify.png", 20, 20)
      .then((response) => {
        let imageArray = new sol.ImageArray();
        imageArray.fromImage(response);

        // get the entirety of the image data from the ImageArray,
        // resize the ImageArray and then copy the original image
        // data back to it thrice with varying offsets to create
        // a simple animation

        let arr = imageArray.getArray();
        let w = imageArray.width;
        let h = 4;

        imageArray.resize(20 * 4, 28);
        imageArray.replace(arr.data, arr.width, w, h);
        imageArray.replace(arr.data, arr.width, w * 2, h * 2);
        imageArray.replace(arr.data, arr.width, w * 3, h);

        // get the new, modified image data and convert it to
        // ImageData and create a texture from it

        arr = imageArray.getArray();
        let imageData = new ImageData(arr.data, arr.width);
        
        tex = texStore.addResource("uiNotify", new sol.Texture());
        tex.create([imageData]);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    tex = texStore.getResource("textBottom");
    if (tex === undefined) {
      APP.resourceLoader.loadImage("res/bottom_text.png", 94, 8)
      .then((response) => {
        tex = texStore.addResource("textBottom", new sol.Texture());
        tex.create([response]);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
  
  onSelect(caller, point) {
    return true;
  }

  onActive(caller, color) {
    if (this._renderMsg.typing === true) {
      // if current line is currently displaying then
      // advance it (instantly complete current text portion
      // or go to the next)

      this._renderMsg.advance();

      if (this._renderMsg.typing === false) {
        // if current line has now finished displaying
        // then get the next line from the script if any
        // exists, otherwise if there are no more lines then
        // 'close' the text box (and remove it from the
        // entity list)

        if (this._script._sceneActive === true) {
          this._updateText();
        } else {
          this._decoration = null;

          caller.listEnt.splice(caller.activeEnt.index, 1);
        }
      }
    }
  }

  startScript(script) {
    this._script = script;
    this._updateText();
  }

  resize(width) {
    this._width = Math.min(width, 640);
    let hWidth = Math.round(width * 0.5);
  

    this._renderMsg.maxWidth = this._width - 96;
    this._renderMsg.origin =
      new sol.Vec2(Math.round(this._renderMsg.maxWidth * 0.5), 0);
    this._renderMsg.position.x = hWidth;


    let boxWidth = this._width - 16;
    let hBoxWidth = Math.round(boxWidth * 0.5);
    let boxHeight = this._height + 18;

    let boxClip = 16;
    this._box.origin = new sol.Vec2(hBoxWidth, 0);
    this._box.position = new sol.Vec2(hWidth, 8);
    this._box.verts = [
      new sol.Vec2( boxClip, 0),
      new sol.Vec2(boxWidth, 0),

      new sol.Vec2(boxWidth, boxHeight),
      new sol.Vec2(       0, boxHeight),

      new sol.Vec2(0, boxClip),
    ];


    let boxCorner = boxClip - 4;
    let boxCornerOff = 4;
    this._boxCorner.origin = new sol.Vec2(hBoxWidth, 0);
    this._boxCorner.position = new sol.Vec2(hWidth, 8);
    this._boxCorner.verts = [
      new sol.Vec2(            boxCornerOff,             boxCornerOff),
      new sol.Vec2(boxCorner + boxCornerOff,             boxCornerOff),
      new sol.Vec2(            boxCornerOff, boxCorner + boxCornerOff),
    ];


    let decoGap = 0;
    if (this._decoration !== null) {
      this._decoration.position =
        new sol.Vec2(hWidth, this._height + 12);
      
      decoGap = Math.round(this._decoration.bbWidth * 0.5) + 12;
    }

    let decoGapLow = Math.round((this._decoLow.bbWidth + 12) * 0.5);
    this._decoLow.position = new sol.Vec2(hWidth, 10);

    
    let lineInset = 6;
    let topGap = Math.max(hBoxWidth - decoGap, 4);
    this._boxLines.origin = new sol.Vec2(hBoxWidth, 0);
    this._boxLines.position = new sol.Vec2(hWidth, 8);
    this._boxLines.verts = [
      new sol.Vec2(   boxClip + lineInset, lineInset),
      new sol.Vec2(hBoxWidth - decoGapLow, lineInset),

      new sol.Vec2(hBoxWidth + decoGapLow, lineInset),
      new sol.Vec2(  boxWidth - lineInset, lineInset),

      new sol.Vec2(boxWidth - lineInset,             lineInset),
      new sol.Vec2(boxWidth - lineInset, boxHeight - lineInset),

      new sol.Vec2(         boxWidth - lineInset, boxHeight - lineInset),
      new sol.Vec2(boxWidth - lineInset - topGap, boxHeight - lineInset),

      new sol.Vec2(lineInset + topGap, boxHeight - lineInset),
      new sol.Vec2(         lineInset, boxHeight - lineInset),

      new sol.Vec2(lineInset, boxHeight - lineInset),
      new sol.Vec2(lineInset,   boxClip + lineInset),

      new sol.Vec2(          lineInset, boxClip + lineInset),
      new sol.Vec2(boxClip + lineInset,           lineInset),
    ];
  }

  addToBatch(batch) {
    if (this._renderMsg.typing === true) {
      batch.add(this._box);
      batch.add(this._boxCorner);
      batch.add(this._boxLines);

      if (this._decoration !== null) {
        // if current speaker has a valid decoration
        // then also display it

        batch.add(this._decoration);
      }

      batch.add(this._decoLow);
      batch.add(this._renderMsg);
    }
  }

  _updateText() {
    if (this._script !== null) {
      let line = this._script.getMessage();
      this._renderMsg.text = line.text;

      let decoName = "text" + line.speaker;
      let decoration = this._decorations.get(decoName);

      for (let action of line.actions) {
        if (this._actCallback !== null) {
          this._actCallback(action);
        }
      }

      if (decoration === undefined) {
        // if the requested decoration doesn't already exist then
        // attempt to create and store it for next time, unless
        // required texture doesn't exist

        let texStore = APP.resourceManager.getStore("texture");
        let tex = texStore.getResource(decoName);

        if (tex !== undefined) {
          let newDecoration = tex.asShape();
          newDecoration.origin = new sol.Vec2(
            newDecoration.bbWidth * 0.5, 0
          );

          newDecoration.position =
            new sol.Vec2(this._width * 0.5, this._height + 12);

          this._decorations.set(decoName, newDecoration);
          decoration = this._decorations.get(decoName, newDecoration);
        }
      }
      
      // set the decoration (or unset it if no valid decoration
      // exists) and then update the text box to properly
      // display the new decoration

      if (decoration !== undefined) {
        this._decoration = decoration;
      } else {
        this._decoration = null;
      }

      this.resize(APP.canvas.width);
    }
  }
};

export default UIText;
