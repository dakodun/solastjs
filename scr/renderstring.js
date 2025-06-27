import GL from './gl.js'

import Renderable from './renderable.js';
import RenderBatchData from './renderbatchdata.js'
import Transformable2D from './transformable2d.js';
import VBOVertex from './vbovertex.js';
import Vec2 from './vec2.js';

class RenderString {
  #font = null;
  #text = "";

  #width = 0;
  #height = 0;

  #vertices = [];
  #indices = [];
  
  #transformable = new Transformable2D();
  #renderable = new Renderable();

	constructor(font, text = "") {
    if (font !== undefined) {
      this.font = font;
    }

    this.text = text;
	}

  get font() { return this.#font; }
  get text() { return this.#text; }

  get width() {
    if (this.#vertices.length === 0) {
      this.#generateVerts();
    }

    return this.#width;
  }

  get height() {
    if (this.#vertices.length === 0) {
      this.#generateVerts();
    }

    return this.#height;
  }

  set font(font) {
    this.#font = font;
    this.#vertices.splice(0);
  }

  set text(text) {
    this.#text = text;
    this.#vertices.splice(0);
  }


  get transformable() { return this.#transformable; }
  get position() { return this.#transformable.position; }
  get origin()   { return this.#transformable.origin;   }
  get transMat() { return this.#transformable.transMat; }
  get scale()    { return this.#transformable.scale;    }
  get rotation() { return this.#transformable.rotation; }
  get boundingBox() { return this.#transformable.boundingBox; }

  set position(position) { this.#transformable.position = position; }
  set origin(origin)     { this.#transformable.origin = origin;     }
  set transMat(transMat) { this.#transformable.transMat = transMat; }
  set scale(scale)       { this.#transformable.scale = scale;       }
  set rotation(rotation) { this.#transformable.rotation = rotation; }
  set boundingBox(boundingBox) {
    this.#transformable.boundingBox = boundingBox;
  }


  get renderable() { return this.#renderable; }
  get color() { return this.#renderable.color; }
  get alpha() { return this.#renderable.alpha; }
  get depth() { return this.#renderable.depth; }
  get shader() { return this.#renderable.shader; }

  set color(color) { this.#renderable.color = color; }
  set alpha(alpha) { this.#renderable.alpha = alpha; }
  set depth(depth) { this.#renderable.depth = depth; }
  set shader(shader) { this.#renderable.shader = shader; }

  asData() {
    let rbd = new RenderBatchData();

    this.#generateVerts();

    let transMat = this.transformable.asMat3();

    for (let vert of this.#vertices) {
      let vboVert = vert.getCopy();
      let x = vboVert.x; let y = vboVert.y;

      vboVert.x = (transMat.arr[0] * x) +
        (transMat.arr[3] * y) + transMat.arr[6];
      vboVert.y = (transMat.arr[1] * x) +
        (transMat.arr[4] * y) + transMat.arr[7];
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
    if (this.#vertices.length === 0) {
      let indexCount = 0;
      let cursor = 0;
      let drop = 0;

      for (let char of this.#text) {
        let glyph = this.#font.getGlyph(char);

        if (glyph !== undefined) {
          let s = new Vec2(glyph.s.x * 65535, glyph.s.y * 65535);
          let t = new Vec2(glyph.t.x * 65535, glyph.t.y * 65535);
          let l = glyph.layer;

          let w = glyph.width;
          let h = glyph.height;
          let b = glyph.bottom;

          this.#height = Math.max(this.#height, h);
          drop = Math.max(drop, b);

          this.#vertices.push(new VBOVertex({
            x: cursor, y: -b,
            s: s.x, t: t.y, textureFlag: 1, textureLayer: l,
          }));

          this.#vertices.push(new VBOVertex({
            x: cursor + w, y: -b,
            s: s.y, t: t.y, textureFlag: 1, textureLayer: l,
          }));

          this.#vertices.push(new VBOVertex({
            x: cursor + w, y: h - b,
            s: s.y, t: t.x, textureFlag: 1, textureLayer: l,
          }));

          this.#vertices.push(new VBOVertex({
            x: cursor, y: h - b,
            s: s.x, t: t.x, textureFlag: 1, textureLayer: l,
          }));

          cursor += w + 2;

          this.#indices.push(indexCount    );
          this.#indices.push(indexCount + 2);
          this.#indices.push(indexCount + 1);

          this.#indices.push(indexCount + 2);
          this.#indices.push(indexCount    );
          this.#indices.push(indexCount + 3);

          indexCount += 4;
        }
      }

      this.#width = (cursor === 0) ? 0 : cursor - 2;
      this.#height += drop;
    }
  }
};

export default RenderString;
