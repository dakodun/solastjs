import { describe, test, expect } from 'vitest';

import Shape from '../../src/shape.js';

import GL, { glSetContext } from '../../src/gl.js'
import Mat3 from '../../src/mat3.js';
import Shader from '../../src/shader.js';
import Texture from '../../src/texture.js';
import Vec2 from '../../src/vec2.js';
import Vec3 from '../../src/vec3.js';

import * as enums from "../../src/exportenums.js";

//> Shape.Frame //
describe("Shape.Frame", () => {
test("new Shape.Frame(initializerList = {})", () => {
  // test that passing a correct initializer list to
  // Shape.Frame constructor is properly assigned

  let tex = new Texture();
  let sIn = new Vec2(3, 4);
  let tIn = new Vec2(5, 6)

  let frm = new Shape.Frame({
    texture: tex,
    s: sIn.getCopy(),
    t: tIn.getCopy(),
    layer: 7,
  });

    expect(frm._texture).toBe(tex);
    expect(frm._s.equals(sIn)).toEqual(true);
    expect(frm._t.equals(tIn)).toEqual(true);
    expect(frm._layer).toEqual(7);

  // test that passing an empty object, nothing, null or
  // an object with unrelated properties properly constructs
  // a default Shape.Frame

  sIn = new Vec2(0, 1);
  tIn = new Vec2(0, 1);

  frm = new Shape.Frame({});

    expect(frm._texture).toBe(null);
    expect(frm._s.equals(sIn)).toEqual(true);
    expect(frm._t.equals(tIn)).toEqual(true);
    expect(frm._layer).toEqual(0);

  frm = new Shape.Frame();

    expect(frm._texture).toBe(null);
    expect(frm._s.equals(sIn)).toEqual(true);
    expect(frm._t.equals(tIn)).toEqual(true);
    expect(frm._layer).toEqual(0);

  frm = new Shape.Frame(null);

    expect(frm._texture).toBe(null);
    expect(frm._s.equals(sIn)).toEqual(true);
    expect(frm._t.equals(tIn)).toEqual(true);
    expect(frm._layer).toEqual(0);

  frm = new Shape.Frame({
    nonExistent: "nonExistent",
  });

    expect(frm._texture).toBe(null);
    expect(frm._s.equals(sIn)).toEqual(true);
    expect(frm._t.equals(tIn)).toEqual(true);
    expect(frm._layer).toEqual(0);
});

test("get texture(); get s(); get t(); get layer()", () => {
  // test that calling a getter returns a reference to
  // the correct property

  let frm = new Shape.Frame({
    texture: new Texture(),
    s: new Vec2(3, 4),
    t: new Vec2(5, 6),
    layer: 7,
  });

  let tex = frm.texture;
  let s = frm.s;
  let t = frm.t;
  let layer = frm.layer;

    expect(tex).toBe(frm._texture);
    expect(s).toBe(frm._s);
    expect(t).toBe(frm._t);
    expect(layer).toBe(frm._layer);
});

test("set texture(texture); set s(s); set t(t); set layer(layer)", () => {
  // test that calling a setter sets the corresponding
  // property to the value passed

  let tex = new Texture();
  let s = new Vec2(3, 4);
  let t = new Vec2(5, 6);
  let layer = 7;
  
  let frm = new Shape.Frame();
  frm.texture = tex;
  frm.s = s;
  frm.t = t;
  frm.layer = layer;

    expect(frm._texture).toBe(tex);
    expect(frm._s).toBe(s);
    expect(frm._t).toBe(t);
    expect(frm._layer).toBe(layer);
  
  // test that an appropiate error will be thrown if
  // an incorrect type is assigned to a property

    expect(() => frm.texture = "string").toThrowError(/Texture/);
    expect(() => frm.s = "string").toThrowError(/Vec2/);
    expect(() => frm.t = "string").toThrowError(/Vec2/);
    expect(() => frm.layer = "string").toThrowError(/Number/);
});

test("copy(other); getCopy()", () => {
  let frm = new Shape.Frame({
    texture: new Texture(),
    s: new Vec2(3, 4),
    t: new Vec2(5, 6),
    layer: 7,
  });

  // test that the copy method properly copies properties from
  // the input (shallow and deep as applicable), and throws an
  // error if the input is not of the same type

  let frmCopy = new Shape.Frame();
  frmCopy.copy(frm);
    expect(frmCopy._texture).toBe(frm._texture);
    expect(frmCopy._s).not.toBe(frm._s);
      expect(frmCopy._s.equals(frm._s)).toEqual(true);
    expect(frmCopy._t).not.toBe(frm._t);
      expect(frmCopy._t.equals(frm._t)).toEqual(true);
    expect(frmCopy._layer).toBe(frm._layer);

  expect(() => frmCopy.copy("string")).toThrowError(/Shape.Frame/);

  // test that a valid copy is returned

  let frmGetCopy = frm.getCopy();
    expect(frmGetCopy._texture).toBe(frm._texture);
    expect(frmGetCopy._s).not.toBe(frm._s);
      expect(frmGetCopy._s.equals(frm._s)).toEqual(true);
    expect(frmGetCopy._t).not.toBe(frm._t);
      expect(frmGetCopy._t.equals(frm._t)).toEqual(true);
    expect(frmGetCopy._layer).toBe(frm._layer);
});

test("equals(other)", () => {
  let tex = new Texture();
  let frm = new Shape.Frame({
    texture: tex,
    s: new Vec2(3, 4),
    t: new Vec2(5, 6),
    layer: 7,
  });

  // test that comparing a Shape.Frame returns true only when
  // all properties are a match (texture, s, t and layer)

  let frmMatch = new Shape.Frame({});
    expect(frm.equals(frmMatch)).toEqual(false);

  frmMatch._texture = tex;
    expect(frm.equals(frmMatch)).toEqual(false);

  frmMatch._s = new Vec2(3, 4);
    expect(frm.equals(frmMatch)).toEqual(false);

  frmMatch._t = new Vec2(5, 6);
    expect(frm.equals(frmMatch)).toEqual(false);

  frmMatch._layer = 7;
    expect(frm.equals(frmMatch)).toEqual(true);

  // test that an appropiate error is thrown if the object
  // being compared to isn't a Shape.Frame

    expect(() => frm.equals("string")).toThrowError(/Shape.Frame/);
});
});


//> Shape.Animation //
describe("Shape.Animation", () => {
test("get currentIndex; get currentTime", () => {
  let anim = new Shape.Animation();
  anim._index = 1;
  anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});

  // test that the correct index and time is returned

  let ind  = anim.currentIndex;
  let time =  anim.currentTime;
  console.log(`${ind} ${time}`);

    expect(ind).toBe(2);
    expect(time).toBe(2);
  
  // test that an invalid value (-1) is returned if the current
  // index is out of bounds

  anim._index = 2;
  ind  = anim.currentIndex;
  time =  anim.currentTime;

    expect(ind).toBe(-1);
    expect(time).toBe(-1);
});

test("copy(other); getCopy()", () => {
  let anim = new Shape.Animation();
  anim._index = 1;
  anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});
  anim._dirInit = -1;
  anim._loopMax = 4;
  anim._loopDir = -1;
  anim._loopCount = 2;
  anim._dirCurr = -1;

  // test that the copy method properly copies properties from
  // the input (shallow and deep as applicable), and throws an
  // error if the input is not of the same type

  let animCopy = new Shape.Animation();
  animCopy.copy(anim);
    expect(animCopy._index).toBe(anim._index);
    expect(animCopy._frames).not.toBe(anim._frames);
      expect(animCopy._frames.length).toBe(anim._frames.length);
      animCopy._frames.every((e, i) => {
        expect(e._index).toBe(anim._frames[i]._index);
        expect(e._time).toBe(anim._frames[i]._time);
      });
    
    expect(animCopy._dirInit).toBe(anim._dirInit);
    expect(animCopy._loopMax).toBe(anim._loopMax);
    expect(animCopy._loopDir).toBe(anim._loopDir);
    expect(animCopy._loopCount).toBe(anim._loopCount);
    expect(animCopy._dirCurr).toBe(anim._dirCurr);

    expect(() => animCopy.copy("string")).toThrowError(/Shape.Animation/);
  
  // test that a valid copy is returned

  let animGetCopy = anim.getCopy();
    expect(animCopy._index).toBe(anim._index);
    expect(animGetCopy._frames).not.toBe(anim._frames);
      expect(animGetCopy._frames.length).toBe(anim._frames.length);
      animGetCopy._frames.every((e, i) => {
        expect(e._index).toBe(anim._frames[i]._index);
        expect(e._time).toBe(anim._frames[i]._time);
      });
    
    expect(animGetCopy._dirInit).toBe(anim._dirInit);
    expect(animGetCopy._loopMax).toBe(anim._loopMax);
    expect(animGetCopy._loopDir).toBe(anim._loopDir);
    expect(animCopy._loopCount).toBe(anim._loopCount);
    expect(animCopy._dirCurr).toBe(anim._dirCurr);
});

test("equals(other)", () => {
  let anim = new Shape.Animation();
  anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});
  anim._dirInit = -1;
  anim._loopMax = 4;
  anim._loopDir = -1;

  // test that comparing a Shape.Frame returns true only when
  // all properties are a match (texture, s, t and layer)

  let animMatch = new Shape.Animation();
    expect(anim.equals(animMatch)).toEqual(false);

  animMatch._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});
    expect(anim.equals(animMatch)).toEqual(false);

  animMatch._dirInit = -1;
    expect(anim.equals(animMatch)).toEqual(false);

  animMatch._loopMax = 4;
    expect(anim.equals(animMatch)).toEqual(false);
  
  animMatch._loopDir = -1;
    expect(anim.equals(animMatch)).toEqual(true);
  
  // test that only the initial animation state is considered
  // when checking for equality

  animMatch._index = 1;
  animMatch._loopCount = 1;
  animMatch._dirCurr = -1;
    expect(anim.equals(animMatch)).toEqual(true);
  
  // test that an appropiate error is thrown if the object
  // being compared to isn't a Shape.Frame

    expect(() => anim.equals("string")).toThrowError(/Shape.Animation/);
});
});
