import APP, { sol, GL } from './init.js';

class Background {
  static pxSide = 40;
  static pxTop = 40;

  _shpBack  = new sol.Shape();
  _shpsBorder = new Array();

  _scale = 3;
  _textures = new Map();

  //> constructor //
  constructor() {
    // populate the texture map and then retrieve the
    // texture for the central backdrop

    this._textures = this._getTextureInfo();
    let tex = this._textures.get("center");

    // initially create the central backdrop as it
    // remains unchanged (outside positioning)

    let dim = new sol.Vec2(tex.width * this._scale,
      tex.height * this._scale);

    this._shpBack.pushVerts([
      new sol.Vec2(    0,     0),
      new sol.Vec2(dim.x,     0),
      new sol.Vec2(dim.x, dim.y),
      new sol.Vec2(    0, dim.y)
    ]);
    
    this._shpBack.pushFrame(tex, 0);
    this._shpBack.origin = new sol.Vec2(this._shpBack.bbWidth * 0.5, 0);
    
    // call the resize method to handle position and
    // creation of backdrop borders

    this.onResize();
  }

  //> static public methods //
  static loadResources() {
    let images = [
      {id: "background", src: "res/background.png",
        width: 448, height: 248},
    ];

    // get the texture store if it already exists (otherwise
    // create it first)

    let texStore = APP.resourceManager.getStore("texture");
    if (texStore === undefined) {
      texStore = APP.resourceManager.addStore("texture");
    }

    for (const img of images) {
      // if the current texture doesn't already exist then
      // load the image file from src and when finished
      // create a texture from it and add it to the store

      APP.resourceLoader.loadImage(img.src, img.width, img.height)
        .then((response) => {
          let imageArray = new sol.ImageArray();
          imageArray.fromImage(response);

          let pxSide = Background.pxSide;
          let pxTop = Background.pxTop;

          let textureParts = [
            { suffix: "center",
              start: new sol.Vec2(pxSide, pxTop),
              end: new sol.Vec2(img.width - (pxSide * 2), img.height),
              params: {} },
            { suffix: "left",
              start: new sol.Vec2(0, pxTop),
              end: new sol.Vec2(pxSide, img.height),
              params: { TEXTURE_WRAP_S: GL.REPEAT } },
            { suffix: "right",
              start: new sol.Vec2(img.width - pxSide, pxTop),
              end: new sol.Vec2(img.width, img.height),
              params: { TEXTURE_WRAP_S: GL.REPEAT } },
            { suffix: "top",
              start: new sol.Vec2(0, 0),
              end: new sol.Vec2(img.width, pxTop),
              params: {} }
          ];

          for (let part of textureParts) {
            let arr = imageArray.getArray(part.start.x,
              part.start.y, part.end.x, part.end.y);
            
            let imageData = new ImageData(arr.data, arr.width);
            let tex = texStore.addResource(img.id +
              "-" + part.suffix, new sol.Texture());
            tex.create([imageData], part.params);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  //> public methods //
  addToBatch(scene) {
    scene.batchStatic.add(this._shpBack, 1);

    for (let shp of this._shpsBorder) {
      scene.batchStatic.add(shp, 1);
    }
  }

  onResize() {
    this._shpBack.position.x = APP.canvas.clientWidth * 0.5;
    this._createBorders();
  }

  _getTextureInfo() {
    let result = new Map();
    let texStore = APP.resourceManager.getStore("texture");

    let suffixes = ["center", "left", "right", "top"]
    
    for (let suffix of suffixes) {
      let tex = texStore.getResource("background-" + suffix);
      result.set(suffix, tex);
    }

    return result;
  }

  _createBorders() {
    const overdraw = 40;

    const scrWidth  = APP.canvas.clientWidth;
    const scrHeight = APP.canvas.clientHeight;

    const position = this._shpBack.position;
    const bbWidth  =  this._shpBack.bbWidth;
    const bbHeight = this._shpBack.bbHeight;
    
    let remainder = new sol.Vec2(scrWidth - bbWidth,
      scrHeight - bbHeight);
    
    this._shpsBorder.splice(0);

    if (remainder.x > 0) {
      const w = Math.ceil(remainder.x * 0.5);

      let shp = new sol.Shape([
        new sol.Vec2(0, 0),
        new sol.Vec2(w + overdraw, 0),
        new sol.Vec2(w + overdraw, bbHeight),
        new sol.Vec2(0, bbHeight)
      ]);

      let tex = this._textures.get("left");
      let sWidth = w / (tex.width * this._scale);
      
      let shpLeft = shp.getCopy();
      shpLeft.position.copy(position);
      shpLeft.origin = new sol.Vec2(w + overdraw + (bbWidth * 0.5), 0);
      shpLeft.pushFrame(tex, 0,
        new sol.Vec2(1.0 - sWidth, 1.0),
        new sol.Vec2(0.0, 1.0)
      );

      tex = this._textures.get("right");

      let shpRight = shp.getCopy();
      shpRight.position.copy(position);
      shpRight.origin = new sol.Vec2((bbWidth * -0.5), 0);
      shpRight.pushFrame(tex, 0,
        new sol.Vec2(0.0, sWidth),
        new sol.Vec2(0.0, 1.0)
      );
      
      this._shpsBorder.push(shpLeft);
      this._shpsBorder.push(shpRight);
    }

    if (remainder.y > 0) {
      const h = remainder.y;

      let shpTop = new sol.Shape([
        new sol.Vec2(0, 0),
        new sol.Vec2(scrWidth, 0),
        new sol.Vec2(scrWidth, h),
        new sol.Vec2(0, h)
      ]);

      let tex = this._textures.get("top");
      let sHeight = h / (tex.height * this._scale);

      let texWidth = tex.width * this._scale;
      let sWidth = (scrWidth - texWidth) / (texWidth * 2);

      shpTop.position.copy(position);
      shpTop.origin = new sol.Vec2(scrWidth * 0.5, -bbHeight);
      shpTop.pushFrame(tex, 0,
        new sol.Vec2(0.0 - sWidth, 1.0 + sWidth),
        new sol.Vec2(0.0, sHeight)
      );
      
      this._shpsBorder.push(shpTop);
    }
  }
};

export default Background;
