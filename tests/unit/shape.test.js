import { describe, test, expect } from 'vitest';

import Shape from '../../scr/shape.js';

import GL, { glSetContext } from '../../scr/gl.js'
import Mat3 from '../../scr/mat3.js';
import Shader from '../../scr/shader.js';
import Texture from '../../scr/texture.js';
import Vec2 from '../../scr/vec2.js';
import Vec3 from '../../scr/vec3.js';

import * as enums from "../../scr/exportenums.js";

// Shape.Frame...
describe("Shape.Frame", () => {
describe("construction", () => {
  test("new Shape.Frame(texture, s, t, limit, ...)", () => {
    // assign texture, s, t, and limit; ignore extra
      // => new Shape.Frame(texture, s, t, limit)
    let texture = new Texture();
      texture.width = 101;
    let frame = new Shape.Frame(texture, 
      new Vec2(0, 1), new Vec2(2, 3), 4, "string");
    
    let s = new Vec2(0.0, 1.0);
    let t = new Vec2(2.0, 3.0);
    
      expect(frame.texture).toBe(texture);
      expect(frame.s.equals(s)).toStrictEqual(true);
      expect(frame.t.equals(t)).toStrictEqual(true);
      expect(frame.limit).toStrictEqual(4);
  });

  test("new Shape.Frame(texture, s, t)", () => {
    // assign texture, s, and t; set limit to default
      // => new Shape.Frame(texture, s, t, 0)
    let texture = new Texture();
      texture.width = 101;
    let frame = new Shape.Frame(texture, 
      new Vec2(0, 1), new Vec2(2, 3));
    
    let s = new Vec2(0.0, 1.0);
    let t = new Vec2(2.0, 3.0);
    
      expect(frame.texture).toBe(texture);
      expect(frame.s.equals(s)).toStrictEqual(true);
      expect(frame.t.equals(t)).toStrictEqual(true);
      expect(frame.limit).toStrictEqual(0);
  });

  test("new Shape.Frame(texture)", () => {
    // assign texture; set s, t, and limit to default
      // => new Shape.Frame(texture,
      //      Vec2(0.0, 1.0), Vec2(0.0, 1.0), 0)
    let texture = new Texture();
      texture.width = 101;
    let frame = new Shape.Frame(texture);

    let s = new Vec2(0.0, 1.0);
    let t = new Vec2(1.0, 0.0);
    
      expect(frame.texture).toBe(texture);
      expect(frame.s.equals(s)).toStrictEqual(true);
      expect(frame.t.equals(t)).toStrictEqual(true);
      expect(frame.limit).toStrictEqual(0);
  });

  test("new Shape.Frame()", () => {
    // assign texture, s, t, and limit; default value
      // => new Shape.Frame(null,
      //      Vec2(0.0, 1.0), Vec2(0.0, 1.0), 0)
    let frame = new Shape.Frame();

    let s = new Vec2(0.0, 1.0);
    let t = new Vec2(1.0, 0.0);
    
      expect(frame.texture).toStrictEqual(null);
      expect(frame.s.equals(s)).toStrictEqual(true);
      expect(frame.t.equals(t)).toStrictEqual(true);
      expect(frame.limit).toStrictEqual(0);
  });
});


describe("setters/getters", () => {
  describe("this.texture", () => {
    test("texture = this.texture", () => {
      // return texture
      let frame = new Shape.Frame();
        frame.texture = new Texture();
        frame.texture.width = 101;

      let texture = frame.texture;
        expect(texture).toBe(frame.texture);
    });

    test("this.texture = 'string'", () => {
      // throw an error
      let frame = new Shape.Frame();

        expect(() => frame.texture = "texture").toThrowError(/Texture/);
    });

    test("this.texture = new Texture()", () => {
      // assign texture
      let frame = new Shape.Frame();

      let texture = new Texture();
        texture.width = 101;
      
      frame.texture = texture;
        expect(frame.texture).toBe(texture);
    });
  });


  describe("this.s and this.t", () => {
    test("s = this.s, ...", () => {
      // return s or t
      let frame = new Shape.Frame();
        frame.s = new Vec2();
        frame.t = new Vec2();

      let s = frame.s;
        expect(s).toBe(frame.s);
      let t = frame.t;
        expect(t).toBe(frame.t);
    });

    test("this.s = 'string', ...", () => {
      // throw an error
      let frame = new Shape.Frame();

        expect(() => frame.s = "vector").toThrowError(/Vec2/);
        expect(() => frame.t = "vector").toThrowError(/Vec2/);
    });

    test("this.s = new Vec2(), ...", () => {
      // assign s or t
      let frame = new Shape.Frame();

      let s = new Vec2(1, 2);
      let t = new Vec2(3, 4);

      frame.s = s;
        expect(frame.s).toBe(s);
      frame.t = t;
        expect(frame.t).toBe(t);
    });
  });

  describe("this.limit", () => {
    test("limit = this.limit", () => {
      // return limit
      let frame = new Shape.Frame();
        frame.limit = 1;

      let limit = frame.limit;
        expect(limit).toStrictEqual(frame.limit);
    });

    test("this.limit = 'string'", () => {
      // throw an error
      let frame = new Shape.Frame();

        expect(() => frame.limit = "number").toThrowError(/Number/);
    });

    test("this.limit = 0", () => {
      // assign s or t
      let frame = new Shape.Frame();

      let limit = 1;

      frame.limit = limit;
        expect(frame.limit).toStrictEqual(limit);
    });
  });
});


describe("copying/comparison", () => {
  describe("copy(other)", () => {
    test("copy('string')", () => {
      // throw an error
      let frame = new Shape.Frame();

        expect(() => frame.copy("frame")).
          toThrowError(/Shape.Frame/);
    });

    test("copy(new Shape.Frame)", () => {
      let texture = new Texture();

      let frame = new Shape.Frame();
      let other = new Shape.Frame(texture, new Vec2(1, 2),
        new Vec2(3, 4), 5);

      let s = new Vec2(1, 2);
      let t = new Vec2(3, 4);

      // intially frames are not equal
        expect(frame.equals(other)).toStrictEqual(false);

      frame.copy(other);
      
      // should be a deep copy
        expect(frame.equals(other)).toStrictEqual(true);
        expect(frame).not.toBe(other);

      // other should be unchanged
        expect(other.texture).toBe(texture);
        expect(other.s.equals(s)).toStrictEqual(true);
        expect(other.t.equals(t)).toStrictEqual(true);
        expect(other.limit).toStrictEqual(5);
    });
  });

  test("getCopy()", () => {
    let other = new Shape.Frame(new Texture(), new Vec2(1, 2),
        new Vec2(3, 4), 5);
    let frame = other.getCopy();

    // should be a deep copy
      expect(frame).toBeInstanceOf(Shape.Frame);
      expect(frame.equals(other)).toStrictEqual(true);
      expect(frame).not.toBe(other);
  });

  describe("equals(other)", () => {
    test("this.equals(other)", () => {
      // initally should equal each other
      let frame = new Shape.Frame();
      let other = new Shape.Frame();

        expect(other.equals(frame)).toStrictEqual(true);
        expect(other).not.toBe(frame);

      // when frame is changed then should no longer equal
      let texture = new Texture();
      frame.texture = texture;

      frame.s = new Vec2(1, 2);
      frame.t = new Vec2(3, 4);

      frame.limit = 5;

        expect(other.equals(frame)).toStrictEqual(false);
        expect(other).not.toBe(frame);

      // when other is set to same as frame, should be equal
      other.texture = texture;

      other.s = new Vec2(1, 2);
      other.t = new Vec2(3, 4);

      other.limit = 5;

        expect(other.equals(frame)).toStrictEqual(true);
        expect(other).not.toBe(frame);
    });

    test("this.equals('string')", () => {
      // throw an error
      let frame = new Shape.Frame();

        expect(() => frame.equals("frame")).
          toThrowError(/Shape.Frame/);
    });
  });
});
});
// ...Shape.Frame


// Shape...
describe("Shape", () => {
describe("construction", () => {
  test("new Shape([verts], ...)", () => {
    // assign verts; ignore extra
      // => new Shape([Vec2, ...])
    let shape = new Shape(
      [new Vec2(0, 1), new Vec2(2, 3)], 0
    );

      expect(shape.verts.length).toStrictEqual(2);
      expect(shape.verts[0].x).toStrictEqual(0);
      expect(shape.verts[1].y).toStrictEqual(3);
  });

  test("new Shape()", () => {
    // assign verts; default value
      // => new Vec2([])
    let shape = new Shape();

      expect(shape.verts.length).toStrictEqual(0);
  });
});


describe("getters/setters", () => {
  /*
    verts
    
    #indices = new Array();
    #colors = new Array();
    #frames = new Array();

    #currentFrame = 0;

    #renderable = new Renderable();
  */

  describe("this.startFrame, this.endFrame, this.direction, " +
    "this.loopCount, this.loopMax, and this.timer", () => {

    test("startFrame = this.startFrame, ...", () => {
      // return startFrame, endFrame, direction,
      // loopCount, loopMax, and timer
      let shape = new Shape();
        shape.startFrame   =  2;
        shape.endFrame     =  3;
        shape.direction    = -1;
        shape.loopCount    =  5;
        shape.loopMax      =  6;
        shape.timer        =  7;

      let sf = shape.startFrame;
        expect(sf).toStrictEqual(2);
      
      let ef = shape.endFrame;
        expect(ef).toStrictEqual(3);
      
      let dir = shape.direction;
        expect(dir).toStrictEqual(-1);
      
      let lc = shape.loopCount;
        expect(lc).toStrictEqual(5);
      
      let lm = shape.loopMax;
        expect(lm).toStrictEqual(6);
      
      let tim = shape.timer;
        expect(tim).toStrictEqual(7);
    });

    test("this.startFrame = 'string', ...", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.startFrame = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.endFrame = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.direction = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.loopCount = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.loopMax = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.timer = "number"; }).
          toThrowError(/Number/);
    });

    test("this.startFrame = 2, ...", () => {
      // assign startFrame, endFrame, direction,
      // loopCount, loopMax, and timer
      let shape = new Shape();

      shape.startFrame = 2;
        expect(shape.startFrame).toStrictEqual(2);
      
      shape.endFrame = 3;
        expect(shape.endFrame).toStrictEqual(3);
      
      shape.direction = -1;
        expect(shape.direction).toStrictEqual(-1);
      
      shape.loopCount = 5;
        expect(shape.loopCount).toStrictEqual(5);
      
      shape.loopMax = 6;
        expect(shape.loopMax).toStrictEqual(6);
      
      shape.timer = 7;
        expect(shape.timer).toStrictEqual(7);
    });
  });
});

describe("getters/setters - renderable", () => {
  describe("this.renderable", () => {
    test("renderable = this.renderable", () => {
      // return renderable (shallow)
      let shape = new Shape();
        shape.renderable.alpha = 4;
        shape.renderable.depth = 5;

      let renderable = shape.renderable;
        expect(shape.renderable).toBe(renderable);
    });
  });

  describe("this.color", () => {
    test("color = this.color", () => {
      // return color
      let shape = new Shape();
        shape.color = new Vec3(1, 2, 3);

      let color = shape.color;
        expect(color.x).toStrictEqual(1);
        expect(color.y).toStrictEqual(2);
        expect(color.z).toStrictEqual(3);
    });

    test("this.color = 'string'", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.color = "vector"; }).
          toThrowError(/Vec3/);
    });

    test("this.color = new Vec3(x, y, z)", () => {
      // assign color
      let shape = new Shape();

      shape.color = new Vec3(1, 2, 3);
        expect(shape.color.x).toStrictEqual(1);
        expect(shape.color.y).toStrictEqual(2);
        expect(shape.color.z).toStrictEqual(3);
    });
  });


  describe("this.alpha, this.depth, and this.lineWidth", () => {
    test("alpha = this.alpha, ...", () => {
      // return alpha, depth, and lineWidth
      let shape = new Shape();
        shape.alpha = 4;
        shape.depth = 5;
        shape.lineWidth = 6;

      let alp = shape.alpha;
        expect(alp).toStrictEqual(4);
      
      let dep = shape.depth;
        expect(dep).toStrictEqual(5);
      
      let lin = shape.lineWidth;
        expect(lin).toStrictEqual(6);
    });

    test("this.alpha = 'string', ...", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.alpha = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.depth = "number"; }).
          toThrowError(/Number/);
        expect(() => { shape.lineWidth = "number"; }).
          toThrowError(/Number/);
    });

    test("this.alpha = 4, ...", () => {
      // assign alpha, depth, and lineWidth
      let shape = new Shape();

      shape.alpha = 4;
        expect(shape.alpha).toStrictEqual(4);
      
      shape.depth = 5;
        expect(shape.depth).toStrictEqual(5);
      
      shape.lineWidth = 7;
        expect(shape.lineWidth).toStrictEqual(7);
    });
  });


  describe("this.renderMode", () => {
    test("renderMode = this.renderMode", () => {
      // return renderMode
      let shape = new Shape();
        shape.renderMode = 4;

      let alp = shape.renderMode;
        expect(alp).toStrictEqual(4);
    });

    test("this.renderMode = 'string', ...", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.renderMode = "number"; }).
          toThrowError(/Number/);
    });

    test("this.renderMode = 4, ...", () => {
      // assign renderMode
      let shape = new Shape();

      // reset indices if renderMode changes
      shape.indices = [1, 2, 3];
      shape.renderMode = 4;
        expect(shape.renderMode).toStrictEqual(4);
        expect(shape.indices.length).toStrictEqual(0);
      
      // do nothing if new renderMode is the same as previous
      shape.indices = [1, 2, 3];
      shape.renderMode = 4;
        expect(shape.renderMode).toStrictEqual(4);
        expect(shape.indices.length).toStrictEqual(3);
    });
  });


  describe("this.shader", () => {
    test("shader = this.shader", () => {
      // return shader
      let shape = new Shape();
      let shader = new Shader();
        shape.shader = shader;

      let shaderRef = shape.shader;
        expect(shaderRef).toStrictEqual(shader);
        expect(shaderRef).toBe(shader);
    });

    test("this.shader = 'string'", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.shader = "shader"; }).
          toThrowError(/Shader/);
    });

    test("this.shader = new Vec3(x, y, z)", () => {
      // assign shader
      let shape = new Shape();
      let shader = new Shader();

      shape.shader = shader;
        expect(shape.shader).toStrictEqual(shader);
        expect(shape.shader).toBe(shader);
    });
  });


  describe("this.outline", () => {
    test("outline = this.outline", () => {
      // return outline (shallow)
      let shape = new Shape();
        shape.outline = [];

      let outline = shape.outline;
        expect(outline).toStrictEqual(shape.outline);
        expect(outline).toBe(shape.outline);
    });

    test("this.outline = 'string'", () => {
      // throw an error
      let shape = new Shape();

        expect(() => { shape.outline = "array"; }).
          toThrowError(/Array/);
        expect(() => { shape.outline = "array"; }).
          toThrowError(/Vec2/);
    });

    test("this.outline = [Vec2, ...]", () => {
      // assign outline (shallow)
      let shape = new Shape();
      let outline = [new Vec2(0, 0)];

      shape.outline = outline;
        expect(shape.outline).toStrictEqual(outline);
        expect(shape.outline).toBe(outline);
    });
  });
});


describe("copying/comparison", () => {
  let frame = new Shape.Frame();
  let shader = new Shader();
  let matrixArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // modify a shape to make all fields non-default
  function _modifyShape(shp) {
    shp.verts = [new Vec2(1, 2)];

    shp.position = new Vec2(1, 2);
    shp.origin = new Vec2(3, 4);
    shp.transMat = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    shp.scale = new Vec2(5, 6);
    shp.rotation = 7;
    shp.boundingBox = {
      lower: new Vec2(1, 2),
      upper: new Vec2(3, 4)
    }

    shp.colors = [new Vec3(2, 3, 4)];
    shp.frames = [frame];
    shp.currentFrame = 1;
    shp.animated = true;
    shp.startFrame = 2;
    shp.endFrame   = 3;
    shp.direction  = 4;
    shp.loopCount  = 5;
    shp.loopMax    = 6;
    shp.timer      = 7;

    shp.color = new Vec3(1, 2, 3);
    shp.alpha = 4;
    shp.depth = 5;
    shp.renderMode = 6;
    shp.shader = shader;
    shp.outline = [new Vec2(7, 8)];
    shp.lineWidth = 9;

    // indices is cleared when setting renderMode
    shp.indices = [1];
  }

  describe("copying/comparison", () => {
    test("this.copy(other)", () => {
      // make a deep copy of other

      // create a default shape
      let shape = new Shape();

      // create a completely non-default shape
      let other = new Shape();
      _modifyShape(other);
        
        expect(shape.equals(other)).toStrictEqual(false);

      shape.copy(other);
        expect(shape.equals(other)).toStrictEqual(true);
        expect(shape).not.toBe(other);
      
      // should not modify other
        expect(other.verts[0].x).toStrictEqual(1);
          expect(other.verts[0].y).toStrictEqual(2);

        expect(other.position.x).toStrictEqual(1);
          expect(other.position.y).toStrictEqual(2);
        expect(other.origin.x).toStrictEqual(3);
          expect(other.origin.y).toStrictEqual(4);
        expect(other.transMat.arr).toStrictEqual(matrixArray);
        expect(other.scale.x).toStrictEqual(5);
          expect(other.scale.y).toStrictEqual(6);
        expect(other.rotation).toStrictEqual(7);
        expect(other.boundingBox.lower.x).toStrictEqual(1);
          expect(other.boundingBox.lower.y).toStrictEqual(2);
        expect(other.boundingBox.upper.x).toStrictEqual(3);
          expect(other.boundingBox.upper.y).toStrictEqual(4);

        expect(other.colors[0].x).toStrictEqual(2);
          expect(other.colors[0].y).toStrictEqual(3);
          expect(other.colors[0].z).toStrictEqual(4);
        expect(other.frames[0]).toBe(frame);
        expect(other.currentFrame).toStrictEqual(1);
        expect(other.animated).toStrictEqual(true);
        expect(other.startFrame).toStrictEqual(2);
        expect(other.endFrame).toStrictEqual(3);
        expect(other.direction).toStrictEqual(4);
        expect(other.loopCount).toStrictEqual(5);
        expect(other.loopMax).toStrictEqual(6);
        expect(other.timer).toStrictEqual(7);

        expect(other.color.x).toStrictEqual(1);
          expect(other.color.y).toStrictEqual(2);
          expect(other.color.z).toStrictEqual(3);
        expect(other.alpha).toStrictEqual(4);
        expect(other.depth).toStrictEqual(5);
        expect(other.renderMode).toStrictEqual(6);
        expect(other.shader).toBe(shader);
        expect(other.outline[0].x).toStrictEqual(7);
          expect(other.outline[0].y).toStrictEqual(8);
        expect(other.lineWidth).toStrictEqual(9);

        expect(other.indices[0]).toStrictEqual(1);
    });

    test("this.copy('string')", () => {
      // throw an error
      let shape = new Shape();

      expect(() => shape.copy("shape")).
        toThrowError(/Shape/);
    });
  });


  test.todo("getCopy()", () => {
    // return a Shape
    let shape = new Shape();
    _modifyShape(shape);

    let other = shape.getCopy();
      expect(other).toBeInstanceOf(Shape);

    // should be a deep copy of this
      expect(other.equals(shape)).toStrictEqual(true);
      expect(other).not.toBe(shape);
  });


  describe("this.equals()", () => {
    test("this.equals(other)", () => {
      // initally should equal each other
      let shape = new Shape();
      let other = new Shape();

        expect(other.equals(shape)).toStrictEqual(true);
        expect(other).not.toBe(shape);

      // when shape is changed then should no longer equal
      _modifyShape(shape);

        expect(other.equals(shape)).toStrictEqual(false);
        expect(other).not.toBe(shape);

      // when other is set to same as shape, should be equal
      _modifyShape(other);

        expect(other.equals(shape)).toStrictEqual(true);
        expect(other).not.toBe(shape);
    });

    test("this.equals('string')", () => {
      // throw an error
      let shape = new Shape();

      expect(() => shape.equals("shape")).
        toThrowError(/Shape/);
    });
  });
});


describe("texturing", () => {
  test.todo("pushFrame()", () => {
    
  });


  test.todo("pushFrameRect()", () => {
    
  });


  test.todo("pushFrameStrip()", () => {
    
  });
});


describe("animation", () => {
  test.todo("process()", () => {
    
  });


  test.todo("setAnimation()", () => {
    
  });


  test.todo("resetAnimation()", () => {
    
  });
});


describe("rendering", () => {
  test.todo("triangulate()", () => {
    // empty verts / wrong winding / no ear error
  });

  test.todo("asData()", () => {
    // GL.POINTS / GL.LINES / GL.LINE_LOOP /
    // enums.Rendering.LINE_LOOP / GL.TRIANGLES
  });

  test.todo("#fromText(text, font, fontSize, width)", () => {
    // width = 0 / width = w
  });

  test("#generateOutline()", () => {
    // create and set a fake context with
    // necessary enums
    var fakeContext = {
      TRIANGLES: 0
    };

    glSetContext(fakeContext);

    // set up a triangle shape that is actually a quad
    // with coincident vertices on the bottom right
    let shape = new Shape([
      new Vec2(0, 0),
      new Vec2(6, 0),
      new Vec2(6, 0),
      new Vec2(3, 6),
    ]);

      // initially both arrays should be empty
      expect(shape.outline.length).toStrictEqual(0);
      expect(shape.indices.length).toStrictEqual(0);

    // trigger a call to #generateOutline() via the
    // asData callback function
    shape.renderMode = enums.Rendering.LINE_LOOP;
    shape.asData();

      // should have populated outline and index arrays
      expect(shape.outline.length).not.toStrictEqual(0);
      expect(shape.indices.length).not.toStrictEqual(0);

      // [!] deal with other miters and complex polygons
  });
});
});
// ...Shape
