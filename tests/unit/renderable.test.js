import { describe, test, expect } from 'vitest';

import Renderable from '../../scr/renderable.js';

import GL, { glSetContext } from '../../scr/gl.js'
import Shader from '../../scr/shader.js';
import Vec2 from '../../scr/vec2.js';
import Vec3 from '../../scr/vec3.js';

describe("construction", () => {
  test("renderMode value when GL is defined or not", () => {
    // if GL exists then use that,
    // otherwise use default value of 0
    
    // GL is null
    let render = new Renderable();
      expect(render.renderMode).toStrictEqual(0);

    // create and set a fake context with
    // necessary enums
    var fakeContext = {
      TRIANGLES: 8
    };

    glSetContext(fakeContext);

    // GL exists
    render = new Renderable();
      expect(render.renderMode).toStrictEqual(8);
  });
});

describe("getters/setters", () => {
  describe("this.color", () => {
    test("color = this.color", () => {
      // return color
      let render = new Renderable();
        render.color = new Vec3(1, 2, 3);

      let color = render.color;
        expect(color.x).toStrictEqual(1);
        expect(color.y).toStrictEqual(2);
        expect(color.z).toStrictEqual(3);
    });

    test("this.color = 'string'", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.color = "vector"; }).
          toThrowError(/Vec3/);
    });

    test("this.color = new Vec3(x, y, z)", () => {
      // assign color
      let render = new Renderable();

      render.color = new Vec3(1, 2, 3);
        expect(render.color.x).toStrictEqual(1);
        expect(render.color.y).toStrictEqual(2);
        expect(render.color.z).toStrictEqual(3);
    });
  });


  describe("this.alpha, this.depth, this.lineWidth, " +
    "and this.renderMode", () => {

    test("alpha = this.alpha, ...", () => {
      // return alpha, depth, lineWidth, and renderMode
      let render = new Renderable();
        render.alpha = 4;
        render.depth = 5;
        render.lineWidth = 6;
        render.renderMode = 7;

      let alp = render.alpha;
        expect(alp).toStrictEqual(4);
      
      let dep = render.depth;
        expect(dep).toStrictEqual(5);
      
      let lin = render.lineWidth;
        expect(lin).toStrictEqual(6);
      
      let ren = render.renderMode;
        expect(ren).toStrictEqual(7);
    });

    test("this.alpha = 'string', ...", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.alpha = "number"; }).
          toThrowError(/Number/);
        expect(() => { render.depth = "number"; }).
          toThrowError(/Number/);
        expect(() => { render.lineWidth = "number"; }).
          toThrowError(/Number/);
        expect(() => { render.renderMode = "number"; }).
          toThrowError(/Number/);
    });

    test("this.alpha = 4, ...", () => {
      // assign alpha, depth, lineWidth, and renderMode
      let render = new Renderable();

      render.alpha = 4;
        expect(render.alpha).toStrictEqual(4);
      
      render.depth = 5;
        expect(render.depth).toStrictEqual(5);
      
      render.lineWidth = 7;
        expect(render.lineWidth).toStrictEqual(7);
      
      render.renderMode = 6;
        expect(render.renderMode).toStrictEqual(6);
    });
  });


  describe("this.shader", () => {
    test("shader = this.shader", () => {
      // return shader
      let render = new Renderable();
      let shader = new Shader();
        render.shader = shader;

      let shaderRef = render.shader;
        expect(shaderRef).toStrictEqual(shader);
        expect(shaderRef).toBe(shader);
    });

    test("this.shader = 'string'", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.shader = "shader"; }).
          toThrowError(/Shader/);
    });

    test("this.shader = new Vec3(x, y, z)", () => {
      // assign shader
      let render = new Renderable();
      let shader = new Shader();

      render.shader = shader;
        expect(render.shader).toStrictEqual(shader);
        expect(render.shader).toBe(shader);
    });
  });


  describe("this.outline", () => {
    test("outline = this.outline", () => {
      // return outline (shallow)
      let render = new Renderable();
        render.outline = [];

      let outline = render.outline;
        expect(outline).toStrictEqual(render.outline);
        expect(outline).toBe(render.outline);
    });

    test("this.outline = 'string'", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.outline = "array"; }).
          toThrowError(/Array/);
        expect(() => { render.outline = "array"; }).
          toThrowError(/Vec2/);
    });

    test("this.outline = [Vec2, ...]", () => {
      // assign outline (shallow)
      let render = new Renderable();
      let outline = [new Vec2(0, 0)];

      render.outline = outline;
        expect(render.outline).toStrictEqual(outline);
        expect(render.outline).toBe(outline);
    });
  });
});


describe("copying/comparison", () => {
  describe("this.copy()", () => {
    test("this.copy(other)", () => {
      // make a deep copy of other
      let render = new Renderable();
      let other = new Renderable();
      let shader = new Shader();

      other.color = new Vec3(1, 2, 3);
      other.alpha = 4;
      other.depth = 5;
      other.renderMode = 6;
      other.shader = shader;
        
        expect(render.equals(other)).toStrictEqual(false);

      render.copy(other);
        expect(render.equals(other)).toStrictEqual(true);
        expect(render).not.toBe(other);
      
      // should not modify other
        expect(other.color.x).toStrictEqual(1);
        expect(other.color.y).toStrictEqual(2);
        expect(other.color.z).toStrictEqual(3);
        expect(other.alpha).toStrictEqual(4);
        expect(other.depth).toStrictEqual(5);
        expect(other.renderMode).toStrictEqual(6);
        expect(other.shader).toStrictEqual(shader);
        expect(other.shader).toBe(shader);
    });

    test("this.copy('string')", () => {
      // throw an error
      let render = new Renderable();

      expect(() => render.copy("renderable")).
        toThrowError(/Renderable/);
    });
  });


  test("this.getCopy()", () => {
    // return a Renderable
    let render = new Renderable();
    let shader = new Shader();

    render.color = new Vec3(1, 2, 3);
    render.alpha = 4;
    render.depth = 5;
    render.renderMode = 6;
    render.shader = shader;

    let other = render.getCopy();
      expect(other).toBeInstanceOf(Renderable);

    // should be a deep copy of this
      expect(other.equals(render)).toStrictEqual(true);
      expect(other).not.toBe(render);
  });

  describe("this.equals()", () => {
    test("this.equals(other)", () => {
      // initally should equal each other
      let render = new Renderable();
      let other = new Renderable();
      let shader = new Shader();

        expect(other.equals(render)).toStrictEqual(true);
        expect(other).not.toBe(render);

      // when render is changed then should no longer equal
      render.color = new Vec3(1, 2, 7);
      render.alpha = 4;
      render.depth = 5;

      render.renderMode = 6;
      render.shader = shader;

        expect(other.equals(render)).toStrictEqual(false);
        expect(other).not.toBe(render);

      // when other is set to same as render, should be equal
      other.color = new Vec3(1, 2, 7);
      other.alpha = 4;
      other.depth = 5;

      other.renderMode = 6;
      other.shader = shader;

        expect(other.equals(render)).toStrictEqual(true);
        expect(other).not.toBe(render);
    });

    test("this.equals('string')", () => {
      // throw an error
      let render = new Renderable();

      expect(() => render.equals("renderable")).
        toThrowError(/Renderable/);
    });
  });
});


describe("callback", () => {
  test("this.asData()", () => {
    let parent = {
      render: new Renderable(),
      asData() {
        return [];
      },
    }

    let render = parent.render;
    let result = render.asData(parent);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toStrictEqual(0);
  });
});
