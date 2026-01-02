import APP, { sol, GLStates, GL } from './init.js';

class ModelBuilding  {
  //> internal properties //
  _vertBatch = new sol.VertexBatch();

  constructor() {
    this._vertBatch = this._createBuilding();
    this._vertBatch.lighting = true;
  }

  static loadResources() {
    let texStore = APP.resourceManager.getStore("texture");
    if (texStore === undefined) {
      texStore = APP.resourceManager.addStore("texture");
    }
    
    let srcs = ["res/building_0.png", "res/building_1.png",
      "res/building_2.png"];
    let id = "building";
    let width = 16;
    let height = 80;
    
    let tex = texStore.getResource(id);
    if (tex === undefined) {
      (async () => {
        let layers = new Array();

        for (const src of srcs) {
          try {
            let res = await APP.resourceLoader.
              loadImage(src, width, height);
            layers.push(res);
          } catch(e) {
            console.log(error);
          }
        }
        
        return layers;
      })()
      .then((response) => {
        tex = texStore.addResource(id, new sol.Texture());
        tex.create(response, { TEXTURE_WRAP_S: GL.REPEAT,
          TEXTURE_WRAP_T: GL.REPEAT });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  addToBatch(scene) {
    scene.batchStatic.add(this._vertBatch);
  }

  _createBuilding() {
    let vb = new sol.VertexBatch();

    let width = 280;
    let depth = -200;

    let frontDrop = -40;
    let topDepth = -160;
    let edgeHeight = 12;

    let gap = 31;
    let edgeWidthA = 202;
    let edgeWidthB = edgeWidthA + gap;

    let railWidth = 8;
    let ladderAscent = 4;

    // vertices

    vb.verts = [
      // building front
      new sol.Vec3(    0,         0, depth), // 0
      new sol.Vec3(    0, frontDrop, depth), // 1
      new sol.Vec3(width, frontDrop, depth), // 2
      new sol.Vec3(width,         0, depth), // 3

      // building top
      new sol.Vec3(    0, 0,            depth), // 4
      new sol.Vec3(width, 0,            depth), // 5
      new sol.Vec3(width, 0, depth + topDepth), // 6
      new sol.Vec3(    0, 0, depth + topDepth), // 7


      // edge front A
      new sol.Vec3(         0,          0, depth), //  8
      new sol.Vec3(edgeWidthA,          0, depth), //  9
      new sol.Vec3(edgeWidthA, edgeHeight, depth), // 10
      new sol.Vec3(         0, edgeHeight, depth), // 11

      // edge back
      new sol.Vec3(    0,          0, depth + topDepth), // 12
      new sol.Vec3(width,          0, depth + topDepth), // 13
      new sol.Vec3(width, edgeHeight, depth + topDepth), // 14
      new sol.Vec3(    0, edgeHeight, depth + topDepth), // 15

      // edge left
      new sol.Vec3(0,          0,            depth), // 16
      new sol.Vec3(0,          0, depth + topDepth), // 17
      new sol.Vec3(0, edgeHeight, depth + topDepth), // 18
      new sol.Vec3(0, edgeHeight,            depth), // 19

      // edge right
      new sol.Vec3(width,          0,            depth), // 20
      new sol.Vec3(width,          0, depth + topDepth), // 21
      new sol.Vec3(width, edgeHeight, depth + topDepth), // 22
      new sol.Vec3(width, edgeHeight,            depth), // 23

      // edge front B
      new sol.Vec3(edgeWidthB,          0, depth), // 24
      new sol.Vec3(     width,          0, depth), // 25
      new sol.Vec3(     width, edgeHeight, depth), // 26
      new sol.Vec3(edgeWidthB, edgeHeight, depth), // 27


      // ladder left
      new sol.Vec3(            edgeWidthA, frontDrop, depth + 1), // 28
      new sol.Vec3(edgeWidthA + railWidth, frontDrop, depth + 1), // 29
      new sol.Vec3(edgeWidthA + railWidth,
        edgeHeight + ladderAscent, depth + 1),                    // 30
      new sol.Vec3(            edgeWidthA,
        edgeHeight + ladderAscent, depth + 1),                    // 31

      // ladder rungs
      new sol.Vec3(edgeWidthA + railWidth, frontDrop, depth + 1), // 32
      new sol.Vec3(edgeWidthB - railWidth, frontDrop, depth + 1), // 33
      new sol.Vec3(edgeWidthB - railWidth,
        edgeHeight + ladderAscent, depth + 1),                    // 34
      new sol.Vec3(edgeWidthA + railWidth,
        edgeHeight + ladderAscent, depth + 1),                    // 35

      // ladder right
      new sol.Vec3(edgeWidthB - railWidth, frontDrop, depth + 1), // 36
      new sol.Vec3(            edgeWidthB, frontDrop, depth + 1), // 37
      new sol.Vec3(            edgeWidthB,
        edgeHeight + ladderAscent, depth + 1),                    // 38
      new sol.Vec3(edgeWidthB - railWidth,
        edgeHeight + ladderAscent, depth + 1),                    // 39
    ];

    // indices

    vb.indices = [
      0, 1, 3,   3, 1, 2, // building front
      4, 5, 7,   7, 5, 6, // building top

       8 , 9, 10,   10, 11,  8, // edge front A
      13, 14, 12,   12, 14, 15, // edge back
      17, 16, 19,   19, 18, 17, // edge left
      20, 21, 23,   23, 21, 22, // edge right
      24, 25, 26,   26, 27, 24, // edge front B

      28, 29, 30,   30, 31, 28, // ladder left
      32, 33, 34,   34, 35, 32, // ladder rungs
      36, 37, 38,   38, 39, 36, // ladder right
    ];

    vb.sortIndices();

    // texture coordinates

    let texStore = APP.resourceManager.getStore("texture");
    let tex = texStore.getResource("building");
    vb._texture = tex;

    let sWidth = Math.round(width / tex.width);
    let sDepth = Math.round(-topDepth / (tex.width * 1.5));

    let sWidthA = Math.round(edgeWidthA / tex.width);
    let sWidthB = Math.round((width - edgeWidthB) / tex.width);

    vb.texCoords = [
      // building front
      new sol.Vec3(   0.0, 0.86, 0),
      new sol.Vec3(   0.0, 0.45, 0),
      new sol.Vec3(sWidth, 0.45, 0),
      new sol.Vec3(sWidth, 0.86, 0),

      // building top
      new sol.Vec3(   0.0, 0.0, 1),
      new sol.Vec3(sWidth, 0.0, 1),
      new sol.Vec3(sWidth, 1.0, 1),
      new sol.Vec3(   0.0, 1.0, 1),


      // edge front A
      new sol.Vec3(    0.0,  0.86, 0),
      new sol.Vec3(sWidthA,  0.86, 0),
      new sol.Vec3(sWidthA, 0.995, 0),
      new sol.Vec3(    0.0, 0.995, 0),

      // edge back
      new sol.Vec3(   0.0, 0.86, 0),
      new sol.Vec3(sWidth, 0.86, 0),
      new sol.Vec3(sWidth, 0.995, 0),
      new sol.Vec3(   0.0, 0.995, 0),

      // edge left
      new sol.Vec3(   0.0, 0.86, 0),
      new sol.Vec3(sDepth, 0.86, 0),
      new sol.Vec3(sDepth, 0.995, 0),
      new sol.Vec3(   0.0, 0.995, 0),

      // edge right
      new sol.Vec3(   0.0, 0.86, 0),
      new sol.Vec3(sDepth, 0.86, 0),
      new sol.Vec3(sDepth, 0.995, 0),
      new sol.Vec3(   0.0, 0.995, 0),

      // edge front B
      new sol.Vec3(    0.0,  0.86, 0),
      new sol.Vec3(sWidthB,  0.86, 0),
      new sol.Vec3(sWidthB, 0.995, 0),
      new sol.Vec3(    0.0, 0.995, 0),


      // ladder left
      new sol.Vec3(0.0, 0.0, 2),
      new sol.Vec3(0.4, 0.0, 2),
      new sol.Vec3(0.4, 1.0, 2),
      new sol.Vec3(0.0, 1.0, 2),

      // ladder rungs
      new sol.Vec3(0.4, 0.0, 2),
      new sol.Vec3(0.6, 0.0, 2),
      new sol.Vec3(0.6, 1.0, 2),
      new sol.Vec3(0.4, 1.0, 2),

      // ladder right
      new sol.Vec3(0.6, 0.0, 2),
      new sol.Vec3(1.0, 0.0, 2),
      new sol.Vec3(1.0, 1.0, 2),
      new sol.Vec3(0.6, 1.0, 2),
    ];

    vb.origin = new sol.Vec3(width * 0.5, frontDrop, 0);
    return vb;
  }
};

export default ModelBuilding;
