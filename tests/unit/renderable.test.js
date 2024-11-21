import { describe, test, expect } from 'vitest';

import Renderable from '../../scr/renderable.js';

import { glSetContext } from '../../scr/gl.js'
import Shader from '../../scr/shader.js';
import Vec3 from '../../scr/vec3.js';

// need a valid context to retrieve render mode enums
var fakeContext = {
  TRIANGLES: 0
};

glSetContext(fakeContext);


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


  describe("this.alpha, this.depth, and this.renderMode", () => {
    test("alpha = this.alpha, ...", () => {
      // return alpha, depth, and renderMode
      let render = new Renderable();
        render.alpha = 4;
        render.depth = 5;
        render.renderMode = 6;

      let alp = render.alpha;
        expect(alp).toStrictEqual(4);
      
      let dep = render.depth;
        expect(dep).toStrictEqual(5);
      
      let ren = render.renderMode;
        expect(ren).toStrictEqual(6);
    });

    test("this.alpha = 'string', ...", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.alpha = "number"; }).
          toThrowError(/Number/);
        expect(() => { render.depth = "number"; }).
          toThrowError(/Number/);
        expect(() => { render.renderMode = "number"; }).
          toThrowError(/Number/);
    });

    test("this.alpha = 4, ...", () => {
      // assign alpha, depth, and renderMode
      let render = new Renderable();

      render.alpha = 4;
        expect(render.alpha).toStrictEqual(4);
      
      render.depth = 5;
        expect(render.depth).toStrictEqual(5);
      
      render.renderMode = 6;
        expect(render.renderMode).toStrictEqual(6);
    });
  });


  describe("this.shaderRef", () => {
    test("shaderRef = this.shaderRef", () => {
      // return shaderRef
      let render = new Renderable();
      let shader = new Shader();
        render.shaderRef = shader;

      let shaderRef = render.shaderRef;
        expect(shaderRef).toStrictEqual(shader);
        expect(shaderRef).toBe(shader);
    });

    test("this.shaderRef = 'string'", () => {
      // throw an error
      let render = new Renderable();

        expect(() => { render.shaderRef = "vector"; }).
          toThrowError(/Shader/);
    });

    test("this.shaderRef = new Vec3(x, y, z)", () => {
      // assign shaderRef
      let render = new Renderable();
      let shader = new Shader();

      render.shaderRef = shader;
        expect(render.shaderRef).toStrictEqual(shader);
        expect(render.shaderRef).toBe(shader);
    });
  });
});


describe("copying", () => {
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
      other.shaderRef = shader;
        
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
        expect(other.shaderRef).toStrictEqual(shader);
        expect(other.shaderRef).toBe(shader);
    });

    test("this.copy('string')", () => {
      // throw an error
      let render = new Renderable();

      expect(() => render.copy("renderable")).
        toThrowError(/Renderable/);
    });
  });


  describe("this.getCopy()", () => {
    test("this.getCopy()", () => {
      // return a Renderable
      let render = new Renderable();
      let shader = new Shader();

      render.color = new Vec3(1, 2, 3);
      render.alpha = 4;
      render.depth = 5;
      render.renderMode = 6;
      render.shaderRef = shader;

      let other = render.getCopy();
        expect(other).toBeInstanceOf(Renderable);

      // should be a deep copy of this
        expect(other.equals(render)).toStrictEqual(true);
        expect(other).not.toBe(render);
    });
  });
});


describe("comparison", () => {
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
      render.shaderRef = shader;

        expect(other.equals(render)).toStrictEqual(false);
        expect(other).not.toBe(render);

      // when other is set to same as render, should be equal
      other.color = new Vec3(1, 2, 7);
      other.alpha = 4;
      other.depth = 5;

      other.renderMode = 6;
      other.shaderRef = shader;

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
    // default method returns empty array
    let render = new Renderable();
    let result = render.asData();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toStrictEqual(0);
  });
});
