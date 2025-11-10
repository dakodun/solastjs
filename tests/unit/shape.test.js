import { describe, test, expect } from 'vitest';

import Shape from '../../src/shape.js';

import GL, { glSetContext } from '../../src/gl.js'
import Sol from '../../src/sol.js';
import Mat3 from '../../src/mat3.js';
import Shader from '../../src/shader.js';
import Texture from '../../src/texture.js';
import Vec2 from '../../src/vec2.js';
import Vec3 from '../../src/vec3.js';

import * as enums from "../../src/exportenums.js";
import Renderable from '../../src/renderable.js';

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

  expect(() => frmCopy.copy("string")).toThrowError(/Frame/);

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

    expect(() => frm.equals("string")).toThrowError(/Frame/);
});
});


//> Shape.Animation //
describe("Shape.Animation", () => {
describe("getters", () => {
describe("currentIndex and currentTime", () => {
  test("return value pointed to by index value", () => {
    // test that the correct index and time is returned

    let anim = new Shape.Animation();
      anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});

    let expected = {
      first: {index: 1, time: 1,},
      second: {index: 2, time: 2,},
    };
    
    let result = {first:{}, second:{},}
    result.first.index = anim.currentIndex;
    result.first.time = anim.currentTime;

    anim._index = 1;
    result.second.index = anim.currentIndex;
    result.second.time = anim.currentTime;

    expect(expected.first.index).toEqual(result.first.index);
    expect(expected.first.time).toEqual(result.first.time);

    expect(expected.second.index).toEqual(result.second.index);
    expect(expected.second.time).toEqual(result.second.time);
  });

  test("return -1 if index value is out of bounds", () => {
    // test that an invalid value (-1) is returned if the current
    // index is out of bounds

    let anim = new Shape.Animation();
    anim._index = 2;
    anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});

    let expected = -1
    
    let result = {}
    result.index = anim.currentIndex;
    result.time = anim.currentTime;

    expect(expected).toEqual(result.index);
    expect(expected).toEqual(result.time);
  });
});
});


describe("copy(other)", () => {
test("copies all properties from other to this (deeply)", () => {
  let anim = new Shape.Animation();
    anim._index = 1;
    anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});
    anim._dirInit = -1;
    anim._loopMax = 4;
    anim._loopDir = -1;
    anim._loopCount = 2;
    anim._dirCurr = -1;
  
  let expected = {
    index: 1,
    frames: [{index: 1, time: 1}, {index: 2, time: 2}],
    dirInit: -1,
    loopMax: 4,
    loopDir: -1,
    loopCount: 2,
    dirCurr: -1,
  }

  let animCopy = new Shape.Animation();
  animCopy.copy(anim);

  expect(animCopy._index).toEqual(expected.index);
  expect(animCopy._frames).not.toBe(expected.frames);
    expect(animCopy._frames.length).toEqual(expected.frames.length);
    animCopy._frames.forEach((e, i) => {
      expect(e._index).toEqual(expected.frames[i].index);
      expect(e._time).toEqual(expected.frames[i].time);
    });
  
  expect(animCopy._dirInit).toEqual(expected.dirInit);
  expect(animCopy._loopMax).toEqual(expected.loopMax);
  expect(animCopy._loopDir).toEqual(expected.loopDir);
  expect(animCopy._loopCount).toEqual(expected.loopCount);
  expect(animCopy._dirCurr).toEqual(expected.dirCurr);
});

test("throws an error if other is not a Shape.Animation", () => {
  let animCopy = new Shape.Animation();
  
  expect(() => animCopy.copy("string")).toThrowError(/Animation/);
});
});


describe("getCopy()", () => {
  test("returns a matching copy", () => {
    let anim = new Shape.Animation();
      anim._index = 1;
      anim._frames.push({_index: 1, _time: 1}, {_index: 2, _time: 2});
      anim._dirInit = -1;
      anim._loopMax = 4;
      anim._loopDir = -1;
      anim._loopCount = 2;
      anim._dirCurr = -1;

    let animGetCopy = anim.getCopy();

    expect(animGetCopy._index).toBe(anim._index);
    expect(animGetCopy._frames).not.toBe(anim._frames);
      expect(animGetCopy._frames.length).toBe(anim._frames.length);
      animGetCopy._frames.forEach((e, i) => {
        expect(e._index).toBe(anim._frames[i]._index);
        expect(e._time).toBe(anim._frames[i]._time);
      });
    
    expect(animGetCopy._dirInit).toBe(anim._dirInit);
    expect(animGetCopy._loopMax).toBe(anim._loopMax);
    expect(animGetCopy._loopDir).toBe(anim._loopDir);
    expect(animGetCopy._loopCount).toBe(anim._loopCount);
    expect(animGetCopy._dirCurr).toBe(anim._dirCurr);
  });
});


describe("equals(other)", () => {
describe("not considered equal if any property is a mismatch", () => {
  test("frames (length)", () => {
    // any difference in frame length should cause equals()
    // to return false

    let anim = new Shape.Animation();
      anim._frames.push({_index: 0, _time: 1,},);
    let animMatch = new Shape.Animation();

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._frames.push({_index: 0, _time: 1,},);
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("frames (contents => index)", () => {
    let anim = new Shape.Animation();
      anim._frames.push({_index: 0, _time: 1,},);
    let animMatch = new Shape.Animation();
      animMatch._frames.push({_index: 1, _time: 1,},);

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._frames[0]._index = 0;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("frames (contents => time)", () => {
    let anim = new Shape.Animation();
      anim._frames.push({_index: 0, _time: 1,},);
    let animMatch = new Shape.Animation();
      animMatch._frames.push({_index: 0, _time: 2,},);

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._frames[0]._time = 1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("dirInit", () => {
    let anim = new Shape.Animation();
      anim._dirInit = -1;
    let animMatch = new Shape.Animation();

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._dirInit = -1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("loopMax", () => {
    let anim = new Shape.Animation();
      anim._loopMax = 1;
    let animMatch = new Shape.Animation();

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._loopMax = 1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("loopDir", () => {
    let anim = new Shape.Animation();
      anim._loopDir = -1;
    let animMatch = new Shape.Animation();

    let expected = {initial: false, final: true,}
    let result = {};
    
    result.initial = anim.equals(animMatch);

    animMatch._loopDir = -1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });
});

describe("current state of the animation should be disregarded", () => {
  test("index", () => {
    // test that only the initial animation state is considered
    // when checking for equality

    let anim = new Shape.Animation();
    let animMatch = new Shape.Animation();
      
    
    let expected = {initial: true, final: true,}
    let result = {};

    result.initial = anim.equals(animMatch);

    animMatch._index = 1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("loopCount", () => {
    // test that only the initial animation state is considered
    // when checking for equality

    let anim = new Shape.Animation();
    let animMatch = new Shape.Animation();
      
    let expected = {initial: true, final: true,}
    let result = {};

    result.initial = anim.equals(animMatch);

    animMatch._loopCount = 1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });

  test("dirCurr", () => {
    // test that only the initial animation state is considered
    // when checking for equality

    let anim = new Shape.Animation();
    let animMatch = new Shape.Animation();
      
    
    let expected = {initial: true, final: true,}
    let result = {};

    result.initial = anim.equals(animMatch);

    animMatch._dirCurr = 1;
    result.final = anim.equals(animMatch);

    expect(result.initial).toEqual(expected.initial);
    expect(result.final).toEqual(expected.final);
  });
});


  test("an error is thrown when other is not a Shape.Animation", () => {
    // test that an appropiate error is thrown if the object
    // being compared to isn't a Shape.Animation

    let anim = new Shape.Animation();

    expect(() => anim.equals("string")).toThrowError(/Animation/);
  });
});


describe("fromRange(frameCount, ...)", () => {
describe("omitting parameters applies suitable defaults", () => {
  test("(frameCount, ...)", () => {
    // only passing a frameCount should create a range from 0
    // to frameCount and then pass it to fromArray method
    
    let anim = new Shape.Animation();
    let expected = {
      frames: [0, 1, 2, 3],
    };
    
    anim.fromRange(4);

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0]);
      expect(anim._frames[1]._index).toEqual(expected.frames[1]);
      expect(anim._frames[2]._index).toEqual(expected.frames[2]);
      expect(anim._frames[3]._index).toEqual(expected.frames[3]);
  });

  test("(frameCount, timingsIn, startIn, endIn, ...)", () => {
    // timings should be applied in order until exhausted at
    // which point the last supplied timing should for all
    // remaining frames
    
    let anim = new Shape.Animation();
    let expected = {
      frames: [{index: 0, time: 1}, {index: 1, time: 2},
        {index: 2, time: 3}, {index: 3, time: 3},],
    };
    
    anim.fromRange(4, [1, 2, 3], 0, 4);

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0].index);
      expect(anim._frames[0]._time).toEqual(expected.frames[0].time);
      expect(anim._frames[1]._index).toEqual(expected.frames[1].index);
      expect(anim._frames[1]._time).toEqual(expected.frames[1].time);
      expect(anim._frames[2]._index).toEqual(expected.frames[2].index);
      expect(anim._frames[2]._time).toEqual(expected.frames[2].time);
      expect(anim._frames[3]._index).toEqual(expected.frames[3].index);
      expect(anim._frames[3]._time).toEqual(expected.frames[3].time);
  });

  test("(frameCount, timingsIn, startIn, endIn, " +
  "directionIn, ...)", () => {
    // specifying a reverse-bounce direction should form a
    // range backwards from start and properly wrap around
    // as well as set correct reverse direction properties
    
    let anim = new Shape.Animation();
    let expected = {
      frames: [2, 1, 0, 3],
      dirInit: -1,
      loopDir: -1,
      dirCurr: -1,
    };
    
    anim.fromRange(4, [], 2, 3, "reverse-bounce");

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0]);
      expect(anim._frames[1]._index).toEqual(expected.frames[1]);
      expect(anim._frames[2]._index).toEqual(expected.frames[2]);
      expect(anim._frames[3]._index).toEqual(expected.frames[3]);
    expect(anim._dirInit).toEqual(expected.dirInit);
    expect(anim._loopDir).toEqual(expected.loopDir);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });

  test("(frameCount, timingsIn, startIn, endIn, " +
  "directionIn, loopsIn)", () => {
    // specifying a loop count should properly set the maximum
    // initial loops and the remaining loops
    
    let anim = new Shape.Animation();
    let expected = {
      frames: [2, 3, 0, 1],
      loopMax: 5,
      loopCount: 5,
    };
    
    anim.fromRange(4, [], 2, 1, "forward", 5);

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0]);
      expect(anim._frames[1]._index).toEqual(expected.frames[1]);
      expect(anim._frames[2]._index).toEqual(expected.frames[2]);
      expect(anim._frames[3]._index).toEqual(expected.frames[3]);
    expect(anim._loopMax).toEqual(expected.loopMax);
    expect(anim._loopCount).toEqual(expected.loopCount);
  });
});

describe("erroneous parameters are gracefully handled", () => {
  test("frameCount < zero", () => {
    // if frameCount is negative then it should be treated
    // as if it is zero

    let anim = new Shape.Animation();
    let expected = {
      frames: [],
    };

    anim.fromRange(-1);
    
    expect(anim._frames.length).toBe(expected.frames.length);
  });

  test("timingsIn < minimum", () => {
    // time values that are shorter than the defined minimum 
    // (as declared within Sol class) should be treated as the
    // minimum value

    let anim = new Shape.Animation();
    let expected = {
      frames: [Sol.minFrameTime, 1, Sol.minFrameTime,
        Sol.minFrameTime,],
    };

    anim.fromRange(4, [0, 1, -1]);
    
    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._time).toBeCloseTo(expected.frames[0], 5);
      expect(anim._frames[1]._time).toBeCloseTo(expected.frames[1], 5);
      expect(anim._frames[2]._time).toBeCloseTo(expected.frames[2], 5);
      expect(anim._frames[3]._time).toBeCloseTo(expected.frames[3], 5);
  });

  test("startIn < zero", () => {
    // a start frame value that is less than zero
    // should be set to zero

    let anim = new Shape.Animation();

    let expected = 0;

    anim.fromRange(4, [], -1);

    expect(anim._frames[0]._index).toBe(expected);
  });

  test("startIn >= frameCount", () => {
    // a start frame value that is greater than or equal
    // to the frameCount should be set to frameCount - 1
    // (which is guaranteed to be at least 1)

    let anim = new Shape.Animation();

    let expected = 3;

    anim.fromRange(4, [], 4);

    expect(anim._frames[0]._index).toBe(expected);
  });

  test("endIn < zero", () => {
    // an end frame value that is less than zero
    // should be treated as zero

    let anim = new Shape.Animation();

    let expected = 0;

    anim.fromRange(4, [], 3, -1);

    expect(anim._frames[1]._index).toBe(expected);
  });

  test("endIn >= frameCount", () => {
    // an end frame value that is greater than or equal to
    // the frameCount should be set to frameCount -1
    // (at least 1)

    let anim = new Shape.Animation();

    let expected = 3;

    anim.fromRange(4, [], 0, 4);

    expect(anim._frames[3]._index).toBe(expected);
  });

  test("startIn === endIn", () => {
    // if start and end frame value is the same then
    // a single frame should be added of the value

    let anim = new Shape.Animation();
    let expected = {
      length: 1,
      index: 2,
    }

    anim.fromRange(4, [], 2, 2);
    
    expect(anim._frames.length).toBe(expected.length);
      expect(anim._frames[0]._index).toBe(expected.index);
  });

  test('directionIn === "invalid-option"', () => {
    // an invalid string option for direction should default
    // to "forward"

    let anim = new Shape.Animation();
    let expected = {
      dirInit: 1,
      loopDir: 1,
      dirCurr: 1,
    };

    anim.fromRange(4, [], 0, 4, "invalid-option");
    
    expect(anim._dirInit).toBe(expected.dirInit);
    expect(anim._loopDir).toBe(expected.loopDir);
    expect(anim._dirCurr).toBe(expected.dirCurr);
  });
});

describe("errors are thrown when parameter types mismatch", () => {
  test("frameCount", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange("string")).toThrowError(/Number/);
  });

  test("timingsIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange(0, "string")).toThrowError(/Array/);
  });

  test("startIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange(0, [], "string")).
      toThrowError(/Number/);
  });

  test("endIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange(0, [], 0, "string")).
      toThrowError(/Number/);
  });

  test("directionIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange(0, [], 0, 0, 0)).
      toThrowError(/String/);
  });

  test("loopsIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromRange(0, [], 0, 0, "forward", "string")).
      toThrowError(/Number/);
  });
});
});


describe("fromArray(indices, ...)", () => {
describe("omitting parameters applies suitable defaults", () => {
  test("(indices, ...)", () => {
    // only suplying indices should create frames with matching
    // indices and default times

    let anim = new Shape.Animation();

    let expected = {
      frames: [
        {index: 0, time: Sol.minFrameTime},
        {index: 2, time: Sol.minFrameTime},
        {index: 1, time: Sol.minFrameTime},
        {index: 3, time: Sol.minFrameTime},
      ],
    };

    anim.fromArray([0, 2, 1, 3]);

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0].index);
      expect(anim._frames[0]._time).toEqual(expected.frames[0].time);
      expect(anim._frames[1]._index).toEqual(expected.frames[1].index);
      expect(anim._frames[1]._time).toEqual(expected.frames[1].time);
      expect(anim._frames[2]._index).toEqual(expected.frames[2].index);
      expect(anim._frames[2]._time).toEqual(expected.frames[2].time);
      expect(anim._frames[3]._index).toEqual(expected.frames[3].index);
      expect(anim._frames[3]._time).toEqual(expected.frames[3].time);
  });

  test("(indices, timingsIn, ...)", () => {
    let anim = new Shape.Animation();

    let expected = {
      frames: [
        {index: 0, time: 3},
        {index: 2, time: 1},
        {index: 1, time: 2},
        {index: 3, time: 1},
      ],
    };

    anim.fromArray([0, 2, 1, 3], [3, 1, 2, 1]);

    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0].index);
      expect(anim._frames[0]._time).toEqual(expected.frames[0].time);
      expect(anim._frames[1]._index).toEqual(expected.frames[1].index);
      expect(anim._frames[1]._time).toEqual(expected.frames[1].time);
      expect(anim._frames[2]._index).toEqual(expected.frames[2].index);
      expect(anim._frames[2]._time).toEqual(expected.frames[2].time);
      expect(anim._frames[3]._index).toEqual(expected.frames[3].index);
      expect(anim._frames[3]._time).toEqual(expected.frames[3].time);
  });

describe("(indices, timingsIn, directionIn, ...)", () => {
  test('directionIn === "forward-bounce"', () => {
    // correct loop and direction properties are set

    let anim = new Shape.Animation();

    let expected = {
      dirInit: 1,
      loopDir: -1,
      dirCurr: 1,
    }

    anim.fromArray([], [], "forward-bounce");

    expect(anim._dirInit).toEqual(expected.dirInit);
    expect(anim._loopDir).toEqual(expected.loopDir);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });

  test('directionIn === "reverse"', () => {
    let anim = new Shape.Animation();

    let expected = {
      dirInit: -1,
      loopDir: 1,
      dirCurr: -1,
    }

    anim.fromArray([], [], "reverse");

    expect(anim._dirInit).toEqual(expected.dirInit);
    expect(anim._loopDir).toEqual(expected.loopDir);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });

  test('directionIn === "reverse-bounce"', () => {
    let anim = new Shape.Animation();

    let expected = {
      dirInit: -1,
      loopDir: -1,
      dirCurr: -1,
    }

    anim.fromArray([], [], "reverse-bounce");

    expect(anim._dirInit).toEqual(expected.dirInit);
    expect(anim._loopDir).toEqual(expected.loopDir);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });
});

  test("(indices, timingsIn, directionIn, loopsIn)", () => {
    let anim = new Shape.Animation();
    let expected = {
      loopMax: 5,
      loopCount: 5,
    };
    
    anim.fromArray([0, 1, 2], [], "forward", 5);

    expect(anim._loopMax).toEqual(expected.loopMax);
    expect(anim._loopCount).toEqual(expected.loopCount);
  });
});

describe("erroneous parameters are gracefully handled", () => {
  test("indices empty", () => {
    // when indices are empty no frames should be added
    // but other properties should be set accordingly

    let anim = new Shape.Animation();

    let expected = {
      frames: [],
      dirInit: -1,
      loopMax: 2,
      loopDir: -1,
      loopCount: 2,
      dirCurr: -1,
    };

    anim.fromArray([], [1, 2], "reverse-bounce", 2);

    expect(anim._frames.length).toEqual(expected.frames.length);
    expect(anim._dirInit).toEqual(expected.dirInit);
    expect(anim._loopMax).toEqual(expected.loopMax);
    expect(anim._loopDir).toEqual(expected.loopDir);
    expect(anim._loopCount).toEqual(expected.loopCount);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });

  test("indices negative", () => {
    // negative indices should be corrected to 0

    let anim = new Shape.Animation();

    let expected = {
      frames: [0, 1, 0],
    };

    anim.fromArray([0, 1, -1]);

    expect(anim._frames.length).toEqual(expected.frames.length);
      expect(anim._frames[0]._index).toEqual(expected.frames[0]);
      expect(anim._frames[1]._index).toEqual(expected.frames[1]);
      expect(anim._frames[2]._index).toEqual(expected.frames[2]);
  });

  test("timingsIn < minimum", () => {
    // time values that are shorter than the defined minimum 
    // (as declared within Sol class) should be treated as the
    // minimum value

    let anim = new Shape.Animation();
    let expected = {
      frames: [Sol.minFrameTime, 1, Sol.minFrameTime,
        Sol.minFrameTime,],
    };

    anim.fromArray([0, 1, 2, 3], [0, 1, -1]);
    
    expect(anim._frames.length).toBe(expected.frames.length);
      expect(anim._frames[0]._time).toBeCloseTo(expected.frames[0], 5);
      expect(anim._frames[1]._time).toBeCloseTo(expected.frames[1], 5);
      expect(anim._frames[2]._time).toBeCloseTo(expected.frames[2], 5);
      expect(anim._frames[3]._time).toBeCloseTo(expected.frames[3], 5);
  });

  test('directionIn === "invalid-option"', () => {
    // an invalid string option for direction should default
    // to "forward"

    let anim = new Shape.Animation();
    let expected = {
      dirInit: 1,
      loopDir: 1,
      dirCurr: 1,
    };

    anim.fromArray([], [], "invalid-option");
    
    expect(anim._dirInit).toBe(expected.dirInit);
    expect(anim._loopDir).toBe(expected.loopDir);
    expect(anim._dirCurr).toBe(expected.dirCurr);
  });
});

describe("errors are thrown when parameter types mismatch", () => {
  test("indices", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromArray("string")).toThrowError(/Array/);
  });

  test("timingsIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromArray([], "string")).toThrowError(/Array/);
  });

  test("directionIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromArray([], [], 0)).
      toThrowError(/String/);
  });

  test("loopsIn", () => {
    let anim = new Shape.Animation();
    
    expect(() => anim.fromArray([], [], "forward", "string")).
      toThrowError(/Number/);
  });
});
});


describe("reset()", () => {
  test("resets current state of animation back to correct initial " +
  "values", () => {

    let anim = new Shape.Animation();
      anim._loopMax = 4;
      anim._dirInit = -1;

      anim._index = 1;
      anim._loopCount = 1;
      anim._dirCurr = 1;

    let expected = {
      index: 0,
      loopCount: 4,
      dirCurr: -1,
    }

    anim.reset();

    expect(anim._index).toEqual(expected.index);
    expect(anim._loopCount).toEqual(expected.loopCount);
    expect(anim._dirCurr).toEqual(expected.dirCurr);
  });
});


describe("advance()", () => {
describe("forward direction", () => {
  test("moves index in correct direction", () => {
    let anim = new Shape.Animation();
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._index).toEqual(expected);
      expect(result).toBe(true);
  });

  test("wraps index to zero when it's out of bounds", () => {
    let anim = new Shape.Animation();
      anim._index = 1;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
    
    let expected = 0;

    let result = anim.advance();

    expect(anim._index).toEqual(expected);
      expect(result).toBe(true);
  });

  test("decrements loop counter correctly", () => {
    let anim = new Shape.Animation();
      anim._index = 1;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopCount = 2;
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._loopCount).toEqual(expected);
      expect(result).toBe(true);
  });

  test("reverses direction when 'bounce' is requested", () => {
    let anim = new Shape.Animation();
      anim._index = 1;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopDir = -1;
    
    let expected = -1;

    let result = anim.advance();

    expect(anim._dirCurr).toEqual(expected);
      expect(result).toBe(true);
  });

  test("returns false when reaching end of animation", () => {
    // at end of animation function returns false and doesn't
    // change animation state

    let anim = new Shape.Animation();
      anim._index = 1;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopDir = -1;
      anim._loopCount = 0;

    let expected = {
      index: 1,
      
      loopCount: 0,
      dirCurr: 1,
      result: false,
    }

    let result = anim.advance();

    expect(anim._index).toBe(expected.index);
    expect(anim._loopCount).toBe(expected.loopCount);
    expect(anim._dirCurr).toBe(expected.dirCurr);
      expect(result).toBe(expected.result);
  });
});

describe("reverse direction", () => {
  test("moves index in correct direction", () => {
    let anim = new Shape.Animation();
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._dirCurr = -1;
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._index).toEqual(expected);
      expect(result).toBe(true);
  });

  test("wraps index to last frame's index when it's less than " +
  "zero", () => {

    let anim = new Shape.Animation();
      anim._index = 0;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._dirCurr = -1;
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._index).toEqual(expected);
      expect(result).toBe(true);
  });

  test("decrements loop counter correctly", () => {
    let anim = new Shape.Animation();
      anim._index = 0;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopCount = 2;
      anim._dirCurr = -1;
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._loopCount).toEqual(expected);
      expect(result).toBe(true);
  });

  test("reverses direction when 'bounce' is requested", () => {
    let anim = new Shape.Animation();
      anim._index = 0;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopDir = -1;
      anim._dirCurr = -1;
    
    let expected = 1;

    let result = anim.advance();

    expect(anim._dirCurr).toEqual(expected);
      expect(result).toBe(true);
  });

  test("returns false when reaching end of animation", () => {
    let anim = new Shape.Animation();
      anim._index = 0;
      anim._frames = [{_index: 0, _time: 1}, {_index: 1, _time: 1}];
      anim._loopDir = -1;
      anim._loopCount = 0;
      anim._dirCurr = -1;

    let expected = {
      index: 0,
      
      loopCount: 0,
      dirCurr: -1,
      result: false,
    }

    let result = anim.advance();

    expect(anim._index).toBe(expected.index);
    expect(anim._loopCount).toBe(expected.loopCount);
    expect(anim._dirCurr).toBe(expected.dirCurr);
      expect(result).toBe(expected.result);
  });
});
});
});


//> Shape //
describe("Shape", () => {
describe("new Shape(...)", () => {
  test("initialises properly with no arguments", () => {
    let shp = new Shape();

    let expected = {
      verts: [],
      boundingBox: {
        lower: new Vec2(Number.POSITIVE_INFINITY,
          Number.POSITIVE_INFINITY),
        upper: new Vec2(Number.NEGATIVE_INFINITY,
          Number.NEGATIVE_INFINITY)
      }
    }

    expect(shp._verts.length).toEqual(expected.verts.length);
    expect(shp._transformable._boundingBox.lower.x).
      toEqual(expected.boundingBox.lower.x);
    expect(shp._transformable._boundingBox.lower.y).
      toEqual(expected.boundingBox.lower.y);
    expect(shp._transformable._boundingBox.upper.x).
      toEqual(expected.boundingBox.upper.x);
    expect(shp._transformable._boundingBox.upper.y).
      toEqual(expected.boundingBox.upper.y);
  });

  test("initialises properly when supplied with vertices", () => {
    let verts = [new Vec2(1, 2), new Vec2(3, 4)];
    let shp = new Shape(verts);

    let expected = {
      boundingBox: {
        lower: new Vec2(1, 2),
        upper: new Vec2(3, 4)
      }
    }

    expect(shp._verts).toBe(verts);
    expect(shp._transformable._boundingBox.lower.x).
      toEqual(expected.boundingBox.lower.x);
    expect(shp._transformable._boundingBox.lower.y).
      toEqual(expected.boundingBox.lower.y);
    expect(shp._transformable._boundingBox.upper.x).
      toEqual(expected.boundingBox.upper.x);
    expect(shp._transformable._boundingBox.upper.y).
      toEqual(expected.boundingBox.upper.y);
  });

  test("throws an error when passed incorrect type", () => {
    expect(() => { let shp = new Shape("string"); }).
      toThrowError(/Array/);
  });
});

describe("getters", () => {
  //> polygon //
  test("verts (shallow copy)", () => {
    let shp = new Shape();
      shp._verts = [new Vec2(1, 2)];

    let verts = shp.verts;

    expect(verts).toBe(shp._verts);
  });

  //> shape //
  test("indices (shallow copy)", () => {
    let shp = new Shape();
      shp._indices = [1, 2];

    let inds = shp.indices;

    expect(inds).toBe(shp._indices);
  });

  test("colors (shallow copy)", () => {
    let shp = new Shape();
      shp._colors = [new Vec3(0, 127, 255)];

    let cols = shp.colors;

    expect(cols).toBe(shp._colors);
  });

  test("frames (shallow copy)", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame()];

    let frms = shp.frames;

    expect(frms).toBe(shp._frames);
  });

  test("currentFrame", () => {
    let shp = new Shape();
      shp._currentFrame = 2;

    let currFrame = shp.currentFrame;

    expect(currFrame).toEqual(shp._currentFrame);
  });

  test("animation (shallow copy)", () => {
    let shp = new Shape();
      shp._animation = new Shape.Animation();
      shp._animation._loopMax = 2;

    let anim = shp.animation;

    expect(anim).toBe(shp._animation);
  });

  test("timer", () => {
    let shp = new Shape();
      shp._timer = 2;

    let timer = shp.timer;

    expect(timer).toEqual(shp._timer);
  });

  test("renderable (shallow)", () => {
    let shp = new Shape();
      shp._renderable = new Renderable();
      shp._renderable._depth = 10;

    let renderable = shp.renderable;

    expect(renderable).toBe(shp._renderable);
  });

  //> renderable //
  test("color (shallow)", () => {
    let shp = new Shape();
      shp._renderable._color = new Vec3(0, 127, 255);

    let color = shp.color;

    expect(color).toBe(shp._renderable._color);
  });

  test("alpha", () => {
    let shp = new Shape();
      shp._renderable._alpha = 127;

    let alpha = shp.alpha;

    expect(alpha).toEqual(shp._renderable._alpha);
  });

  test("depth", () => {
    let shp = new Shape();
      shp._renderable._depth = 10;

    let depth = shp.depth;

    expect(depth).toEqual(shp._renderable._depth);
  });

  test("renderMode", () => {
    let shp = new Shape();
      shp._renderable._renderMode = 1;

    let renderMode = shp.renderMode;

    expect(renderMode).toEqual(shp._renderable._renderMode);
  });

  test("shader", () => {
    let shp = new Shape();
      shp._renderable._shader = new Shader();

    let shader = shp.shader;

    expect(shader).toBe(shp._renderable._shader);
  });

  test("outline", () => {
    let shp = new Shape();
      shp._renderable._outline = [new Vec2(1, 2)];

    let outline = shp.outline;

    expect(outline).toBe(shp._renderable._outline);
  });

  test("lineWidth", () => {
    let shp = new Shape();
      shp._renderable._lineWidth = 4;

    let lineWidth = shp.lineWidth;

    expect(lineWidth).toEqual(shp._renderable._lineWidth);
  });
});

describe("setters", () => {
//> polygon //
describe("verts", () => {
  test("assigns the verts to the shape, updates the bounding box " +
  "and resets indices", () => {

    let verts = [new Vec2(-5, -8), new Vec2(5, -8), new Vec2(0, 8)];

    let shp = new Shape();
      shp._indices = [0, 1, 2];
    
    shp.verts = verts;

    let expected = {
      indices: [],
      boundingBox: {
        lower: new Vec2(-5, -8),
        upper: new Vec2(5, 8),
      }
    }

    expect(shp._verts).toBe(verts);
    expect(shp._indices.length).toEqual(expected.indices.length);
      expect(shp._transformable._boundingBox.lower.x).
        toEqual(expected.boundingBox.lower.x);
      expect(shp._transformable._boundingBox.lower.y).
        toEqual(expected.boundingBox.lower.y);
      expect(shp._transformable._boundingBox.upper.x).
        toEqual(expected.boundingBox.upper.x);
      expect(shp._transformable._boundingBox.upper.y).
        toEqual(expected.boundingBox.upper.y);
  });

describe("throws an error on a type mismatch", () => {
  test("not an array", () => {
    let shp = new Shape();

    expect(() => shp.verts = "string").toThrowError(/Array/);
  });

  test("contents mismatch", () => {
    let shp = new Shape();

    expect(() => shp.verts = ["string"]).toThrowError(/Vec2/);
  });
});
});

//> shape //
describe("indices", () => {
  test("assigns the indices to the shape", () => {
    let indices = [0, 1, 2];

    let shp = new Shape();
    
    shp.indices = indices;

    expect(shp._indices).toBe(indices);
  });

describe("throws an error on a type mismatch", () => {
  test("not an array", () => {
    let shp = new Shape();

    expect(() => shp.indices = "string").toThrowError(/Array/);
  });

  test("contents mismatch", () => {
    let shp = new Shape();

    expect(() => shp.indices = ["string"]).toThrowError(/Number/);
  });
});
});

describe("colors", () => {
  test("assigns the colours to the shape", () => {
    let colors = [new Vec3(0, 127, 255)];

    let shp = new Shape();
    
    shp.colors = colors;

    expect(shp._colors).toBe(colors);
  });

describe("throws an error on a type mismatch", () => {
  test("not an array", () => {
    let shp = new Shape();

    expect(() => shp.colors = "string").toThrowError(/Array/);
  });

  test("contents mismatch", () => {
    let shp = new Shape();

    expect(() => shp.colors = ["string"]).toThrowError(/Vec3/);
  });
});
});

describe("frames", () => {
  test("assigns the frames to the shape", () => {
    let frames = [new Shape.Frame()];

    let shp = new Shape();
    
    shp.frames = frames;

    expect(shp._frames).toBe(frames);
  });

describe("throws an error on a type mismatch", () => {
  test("not an array", () => {
    let shp = new Shape();

    expect(() => shp.frames = "string").toThrowError(/Array/);
  });

  test("contents mismatch", () => {
    let shp = new Shape();

    expect(() => shp.frames = ["string"]).toThrowError(/Frame/);
  });
});
});

describe("currentFrame", () => {
  test("sets the index of the current frame", () => {
    let shp = new Shape();
    
    let expected = {
      currentFrame: 2
    }

    shp.currentFrame = 2;

    expect(shp._currentFrame).toEqual(expected.currentFrame);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.currentFrame = "string").toThrowError(/Number/);
  });
});

describe("animation", () => {
  test("assigns the animation to the shape", () => {
    let anim = new Shape.Animation();
      anim._loopMax = 2;

    let shp = new Shape();
    
    shp.animation = anim;

    expect(shp._animation).toBe(anim);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.animation = "string").toThrowError(/Animation/);
  });
});

describe("timer", () => {
  test("sets the current time value", () => {
    let shp = new Shape();
    
    let expected = {
      timer: 2
    }

    shp.timer = 2;

    expect(shp._timer).toEqual(expected.timer);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.timer = "string").toThrowError(/Number/);
  });
});

//> renderable //
describe("color", () => {
  test("sets the renderable's colour", () => {
    let color = new Vec3(0, 127, 255);

    let shp = new Shape();
    
    shp.color = color;

    expect(shp._renderable._color).toBe(color);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.color = "string").toThrowError(/Vec3/);
  });
});

describe("alpha", () => {
  test("sets the renderable's alpha value", () => {
    let shp = new Shape();
    
    let expected = {
      alpha: 127
    }

    shp.alpha = 127;

    expect(shp._renderable._alpha).toEqual(expected.alpha);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.alpha = "string").toThrowError(/Number/);
  });
});

describe("depth", () => {
  test("sets the renderable's depth value", () => {
    let shp = new Shape();
    
    let expected = {
      depth: 10
    }

    shp.depth = 10;

    expect(shp._renderable._depth).toEqual(expected.depth);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.depth = "string").toThrowError(/Number/);
  });
});

describe("renderMode", () => {
describe("sets the renderable's render mode", () => {
  test("change in renderMode resets indices", () => {
    let shp = new Shape();
      shp._renderable._renderMode = 0;
      shp._indices = [0, 1, 2]
    
    let expected = {
      renderMode: 1,
      indices: []
    }

    shp.renderMode = 1;

    expect(shp._renderable._renderMode).toEqual(expected.renderMode);
    expect(shp._indices.length).
      toEqual(expected.indices.length);
  });

  test("matching renderMode leaves indices as is", () => {
    let shp = new Shape();
      shp._renderable._renderMode = 1;
      shp._indices = [0, 1, 2]
    
    let expected = {
      renderMode: 1,
      indices: [0, 1, 2]
    }

    shp.renderMode = 1;

    expect(shp._renderable._renderMode).toEqual(expected.renderMode);
    expect(shp._indices.length).
      toEqual(expected.indices.length);
  });
});

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.renderMode = "string").toThrowError(/Number/);
  });
});

describe("shader", () => {
  test("sets the renderable's shader", () => {
    let shader = new Shader();

    let shp = new Shape();
    
    shp.shader = shader;

    expect(shp._renderable._shader).toBe(shader);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.shader = "string").toThrowError(/Shader/);
  });
});

describe("outline", () => {
  test("sets the renderable's outline", () => {
    let outline = [new Vec2(1, 2)];

    let shp = new Shape();
    
    shp.outline = outline;

    expect(shp._renderable._outline).toBe(outline);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.outline = "string").toThrowError(/Array/);
  });
});

describe("lineWidth", () => {
  test("sets the renderable's line width", () => {
    let shp = new Shape();
    
    let expected = {
      lineWidth: 4
    }

    shp.lineWidth = 4;

    expect(shp._renderable._lineWidth).toEqual(expected.lineWidth);
  });

  test("throws an error on a type mismatch", () => {
    let shp = new Shape();

    expect(() => shp.lineWidth = "string").toThrowError(/Number/);
  });
});
});

describe("copy(other)", () => {
  test("copies all properties from other to this", () => {
     let shp = new Shape();
      shp._transformable._position = new Vec2(1, 2);
      shp._verts = [new Vec2(0, 1), new Vec2(1, 2), new Vec2(2, 3)];

      shp.animating = true;
      
      shp._indices = [0, 1, 2];
      shp._colors = [new Vec3(0, 127, 255)];

      shp._frames = [new Shape.Frame({layer: 2})];
      shp._currentFrame = 1;
      shp._animation._loopCount = 2;
      shp._timer = 4;

      shp._renderable._depth = 10;
    
    let expected = {
      transformablePosition: new Vec2(1, 2),
      verts: [new Vec2(0, 1), new Vec2(1, 2), new Vec2(2, 3)],

      animating: true,

      indices: [0, 1, 2],
      colors: [new Vec3(0, 127, 255)],

      frames: [new Shape.Frame({layer: 2})],
      currentFrame: 1,
      animationLoopCount: 2,
      timer: 4,

      renderableDepth: 10,
    }

    let shpCopy = new Shape();
    shpCopy.copy(shp);
    
    expect(shpCopy).not.toBe(shp);

    expect(shpCopy._transformable._position.x).
      toEqual(expected.transformablePosition.x);
    expect(shpCopy._transformable._position.y).
      toEqual(expected.transformablePosition.y);

    expect(shpCopy._verts).not.toBe(expected.verts);
    expect(shpCopy._verts.length).toEqual(expected.verts.length);
      shpCopy._verts.forEach((e, i) => {
        expect(e.x).toEqual(expected.verts[i].x);
        expect(e.y).toEqual(expected.verts[i].y);
      });

    expect(shpCopy.animating).toEqual(expected.animating);
    
    expect(shpCopy._indices).not.toBe(expected.indices);
    expect(shpCopy._indices.length).toEqual(expected.indices.length);
      shpCopy._indices.forEach((e, i) => {
        expect(e).toEqual(expected.indices[i]);
      });
    
    expect(shpCopy._colors).not.toBe(expected.colors);
    expect(shpCopy._colors.length).toEqual(expected.colors.length);
      shpCopy._colors.forEach((e, i) => {
        expect(e.x).toEqual(expected.colors[i].x);
        expect(e.y).toEqual(expected.colors[i].y);
        expect(e.z).toEqual(expected.colors[i].z);
      });
    
    expect(shpCopy._frames).not.toBe(expected.frames);
    expect(shpCopy._frames.length).toEqual(expected.frames.length);
      shpCopy._frames.forEach((e, i) => {
        expect(e._layer).toEqual(expected.frames[i]._layer);
      });
    
    expect(shpCopy._currentFrame).toEqual(expected.currentFrame);
    expect(shpCopy._animation._loopCount).
      toEqual(expected.animationLoopCount);
    expect(shpCopy._timer).toEqual(expected.timer);

    expect(shpCopy._renderable._depth).
      toEqual(expected.renderableDepth);
  });

  test("throws an error if other is not a Shape", () => {
    let shpCopy = new Shape.Animation();

    expect(() => shpCopy.copy("string")).toThrowError(/Shape/);
  });
});

describe("getCopy()", () => {
  test("returns a matching copy", () => {
    let shp = new Shape();
      shp._transformable._position = new Vec2(1, 2);
      shp._verts = [new Vec2(0, 1), new Vec2(1, 2), new Vec2(2, 3)];

      shp.animating = true;
      
      shp._indices = [0, 1, 2];
      shp._colors = [new Vec3(0, 127, 255)];

      shp._frames = [new Shape.Frame({layer: 2})];
      shp._currentFrame = 1;
      shp._animation._loopCount = 2;
      shp._timer = 4;

      shp._renderable._depth = 10;
    
    let expected = {
      transformablePosition: new Vec2(1, 2),
      verts: [new Vec2(0, 1), new Vec2(1, 2), new Vec2(2, 3)],

      animating: true,

      indices: [0, 1, 2],
      colors: [new Vec3(0, 127, 255)],

      frames: [new Shape.Frame({layer: 2})],
      currentFrame: 1,
      animationLoopCount: 2,
      timer: 4,

      renderableDepth: 10,
    }

    let shpCopy = shp.getCopy();

    expect(shpCopy).not.toBe(shp);
      
    expect(shpCopy._transformable._position.x).
      toEqual(expected.transformablePosition.x);
    expect(shpCopy._transformable._position.y).
      toEqual(expected.transformablePosition.y);

    expect(shpCopy._verts).not.toBe(expected.verts);
    expect(shpCopy._verts.length).toEqual(expected.verts.length);
      shpCopy._verts.forEach((e, i) => {
        expect(e.x).toEqual(expected.verts[i].x);
        expect(e.y).toEqual(expected.verts[i].y);
      });

    expect(shpCopy.animating).toEqual(expected.animating);
    
    expect(shpCopy._indices).not.toBe(expected.indices);
    expect(shpCopy._indices.length).toEqual(expected.indices.length);
      shpCopy._indices.forEach((e, i) => {
        expect(e).toEqual(expected.indices[i]);
      });
    
    expect(shpCopy._colors).not.toBe(expected.colors);
    expect(shpCopy._colors.length).toEqual(expected.colors.length);
      shpCopy._colors.forEach((e, i) => {
        expect(e.x).toEqual(expected.colors[i].x);
        expect(e.y).toEqual(expected.colors[i].y);
        expect(e.z).toEqual(expected.colors[i].z);
      });
    
    expect(shpCopy._frames).not.toBe(expected.frames);
    expect(shpCopy._frames.length).toEqual(expected.frames.length);
      shpCopy._frames.forEach((e, i) => {
        expect(e._layer).toEqual(expected.frames[i]._layer);
      });
    
    expect(shpCopy._currentFrame).toEqual(expected.currentFrame);
    expect(shpCopy._animation._loopCount).
      toEqual(expected.animationLoopCount);
    expect(shpCopy._timer).toEqual(expected.timer);

    expect(shpCopy._renderable._depth).
      toEqual(expected.renderableDepth);
  });
});

describe("equals(other)", () => {
let compare = (modFunc, expected) => {
  
  
  let shp = new Shape();
    shp._indices = [1, 2];
    shp._colors = [new Vec3(0, 127, 255)];
    shp._frames = [(() => {
      let frame = new Shape.Frame();
      frame._layer = 10;
      return frame;
    })()];
  
  let frame = new Shape.Frame();
    frame._layer = 10;
  let shpMatch = new Shape();
    shpMatch._indices = [1, 2];
    shpMatch._colors = [new Vec3(0, 127, 255)];
    shpMatch._frames = [(() => {
      let frame = new Shape.Frame();
      frame._layer = 10;
      return frame;
    })()];

  expect(shp.equals(shpMatch)).toEqual(true);
  modFunc(shpMatch);
  expect(shp.equals(shpMatch)).toEqual(expected);
}

describe("is not considered equal if any property is a " +
"mismatch", () => {
  test("verts", () => {
    compare((shp) => { shp._verts = [new Vec2(1, 2)]; }, false);
  });

  test("transformable", () => {
    compare((shp) => {
      shp._transformable._position = new Vec2(1, 2);
    }, false);
  });

  test("indices", () => {
    compare((shp) => { shp._indices = [1, 2, 3]; }, false);
  });

  test("colors", () => {
    compare((shp) => { shp._colors = [new Vec3(0, 0, 0)]; }, false);
  });

  test("frames", () => {
    compare((shp) => { shp._frames = [new Shape.Frame()]; }, false);
  });

  test("animation", () => {
    compare((shp) => { shp._animation._loopMax = 2; }, false);
  });

  test("renderable", () => {
    compare((shp) => { shp._renderable._depth = 10; }, false);
  });
});

describe("disregards the current state of the animation", () => {
  test("animating", () => {
    compare((shp) => { shp.animating = true; }, true);
  });

  test("currentFrame", () => {
    compare((shp) => { shp._currentFrame = 1; }, true);
  });

  test("timer", () => {
    compare((shp) => { shp._timer = 10; }, true);
  });
});
});

describe("process(dt)", () => {
  test("increments timer by supplied dt value", () => {
    let shp = new Shape();
      shp.animating = true;
      shp._animation._frames = [{_index: 0, _time: 1},
        {_index: 1, _time: 2}, {_index: 2, _time: 3}];
      
    let expected = { timer: 2 };

    shp.process(2);

    expect(shp._timer).toEqual(expected.timer);
  });

  test("advances animation frame when timer breaches limit", () => {
    let shp = new Shape();
      shp.animating = true;
      shp._animation._frames = [{_index: 0, _time: 1},
        {_index: 1, _time: 2}, {_index: 2, _time: 3}];
      shp._timer = 2;
      
    let expected = { currentFrame: 1 };

    shp.process(1);

    expect(shp._currentFrame).toEqual(expected.currentFrame);
  });

  test("advances animation frame multiple times when timer " +
  "breaches multiple consecutive limits", () => {

    let shp = new Shape();
      shp.animating = true;
      shp._animation._frames = [{_index: 0, _time: 1},
        {_index: 1, _time: 2}, {_index: 2, _time: 3}];
      shp._timer = 4;
      
    let expected = { currentFrame: 2 };

    shp.process(1);

    expect(shp._currentFrame).toEqual(expected.currentFrame);
  });

  test("sets animating status to false when complete", () => {
    let shp = new Shape();
      shp.animating = true;
      shp._animation._frames = [{_index: 0, _time: 1}];
      shp._animation._loopCount = 0;
      shp._timer = 2;
      
    let expected = { animating: false };

    shp.process(1);

    expect(shp.animating).toEqual(expected.animating);
  });

  test("does nothing if animating is set to false", () => {
    let shp = new Shape();
      shp.animating = false;
      
    let expected = { timer: 0 };

    shp.process(2);

    expect(shp._timer).toEqual(expected.timer);
  });

  test("throws an error if dt is not a number", () => {
    let shp = new Shape();
    
    expect(() => { shp.process("string"); }).toThrowError(/Number/);
  });
});

describe("pushFrame(textureIn, layerIn, sIn, tIn)", () => {
  test("creates and adds a frame to the shape's frame array", () => {
    let shp = new Shape();
    let tex = new Texture();

    let expected = {
      frames: [{
        s: new Vec2(1, 2),
        t: new Vec2(3, 4),
        layer: 1
      }]
    };
    
    shp.pushFrame(tex, 1, new Vec2(1, 2), new Vec2(3, 4));

    expect(shp._frames.length).toEqual(expected.frames.length);
    expect(shp._frames[0]._texture).toEqual(tex);
    expect(shp._frames[0]._s.x).toEqual(expected.frames[0].s.x);
      expect(shp._frames[0]._s.y).toEqual(expected.frames[0].s.y);
    expect(shp._frames[0]._t.x).toEqual(expected.frames[0].t.x);
      expect(shp._frames[0]._t.y).toEqual(expected.frames[0].t.y);
    expect(shp._frames[0]._layer).toEqual(expected.frames[0].layer);
  });

describe("throws errors when argument type mismatches", () => {
  test("textureIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrame("string"); }).toThrowError(/Texture/);
  });

  test("layerIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrame(null, "string"); }).
      toThrowError(/Number/);
  });

  test("sIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrame(null, 0, "string"); }).
      toThrowError(/Vec2/);
  });

  test("tIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrame(null, 0, Vec2(0, 0), "string"); }).
      toThrowError(/Vec2/);
  });
});
});

describe("pushFrameStrip(textureIn, layerIn, count, ...)", () => {
  // set up a fake context with dummy methods

  let GL = {
    createTexture() { return {}; },
    bindTexture() {},
    texStorage3D() {},
    texSubImage3D() {},
    texParameteri() {}
  };

  glSetContext(GL);

  let arr = new Array();
  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 12; ++x) {
      arr.push(255, 255, 255, 255);
    }
  }

  let tex = new Texture();
  tex.create([{
    data: arr,
    width: 12,
    height: 8
  }]);

  // function to compare frames in terms of texture coordinates

  let compare = (shape, expected) => {
    expect(shape._frames.length).toEqual(expected.frames.length);

    shape._frames.forEach((e, i) => {
      expect(e._texture).toBe(expected.texture);
      expect(e._layer).toEqual(expected.layer);

      expect(e._s.x).toBeCloseTo(expected.frames[i].s.x, 2);
      expect(e._t.x).toBeCloseTo(expected.frames[i].t.x, 2);
      expect(e._s.y).toBeCloseTo(expected.frames[i].s.y, 2);
      expect(e._t.y).toBeCloseTo(expected.frames[i].t.y, 2);
    });
  }

describe("applies suitable defaults for optional parameters", () => {
  test("pushFrameStrip(textureIn, layerIn, count)", () => {
    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 1,
      frames: [
        { s: new Vec2(0.0, 0.5), t: new Vec2(0.0, 1.0) },
        { s: new Vec2(0.5, 1.0), t: new Vec2(0.0, 1.0) }
      ]
    };

    shp.pushFrameStrip(tex, 1, 2);
    
    compare(shp, expected);
  });

  test("pushFrameStrip(textureIn, layerIn, count, columns)", () => {
    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 1,
      frames: [
        { s: new Vec2(0.0, 0.25), t: new Vec2(0.0, 1.0) },
        { s: new Vec2(0.25, 0.5), t: new Vec2(0.0, 1.0) }
      ]
    };

    shp.pushFrameStrip(tex, 1, 2, 4);
    
    compare(shp, expected);
  });

  test("pushFrameStrip(textureIn, layerIn, count, columns, " + 
  "rows)", () => {

    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 1,
      frames: [
        { s: new Vec2(0.0, 1.0), t: new Vec2(0.0, 0.5) },
        { s: new Vec2(0.0, 1.0), t: new Vec2(0.5, 1.0) }
      ]
    };

    shp.pushFrameStrip(tex, 1, 2, 1, 2);
    
    compare(shp, expected);
  });

  test("pushFrameStrip(textureIn, layerIn, count, columns, " + 
  "rows, start)", () => {

    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 1,
      frames: [
        { s: new Vec2(0.5, 1.0), t: new Vec2(0.0, 0.5) },
        { s: new Vec2(0.0, 0.5), t: new Vec2(0.5, 1.0) }
      ]
    };

    shp.pushFrameStrip(tex, 1, 2, 2, 2, 1);
    
    compare(shp, expected);
  });

  test("pushFrameStrip(textureIn, layerIn, count, columns, " + 
  "rows, start, offset)", () => {

    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 1,
      frames: [
        { s: new Vec2(0.0, 0.333), t: new Vec2(0.0, 0.5) },
        { s: new Vec2(0.666, 1.0), t: new Vec2(0.0, 0.5) }
      ]
    };

    shp.pushFrameStrip(tex, 1, 2, 2, 2, 0, new Vec2(4, 0));
    
    compare(shp, expected);
  });
});

describe("handles erroneous argument values", () => {
  describe("countIn", () => {
    test("sets countIn to 1 if it is less than", () => {
      let shp = new Shape();

      let expected = {
        texture: tex,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 0.5), t: new Vec2(0.0, 0.5) }
        ]
      };

      shp.pushFrameStrip(tex, 0, -1, 2, 2);

      compare(shp, expected);
    });

    test("sets countIn to (columns * rows) if it is greater than", () => {
      let shp = new Shape();

      let expected = {
        texture: tex,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 0.5), t: new Vec2(0.0, 0.5) },
          { s: new Vec2(0.5, 1.0), t: new Vec2(0.0, 0.5) },
          { s: new Vec2(0.0, 0.5), t: new Vec2(0.5, 1.0) },
          { s: new Vec2(0.5, 1.0), t: new Vec2(0.5, 1.0) }
        ]
      };

      shp.pushFrameStrip(tex, 0, 10, 2, 2);

      compare(shp, expected);
    });

    test("respects maximum count when start offset is applied", () => {
      let shp = new Shape();

      let expected = {
        texture: tex,
        layer: 0,
        frames: [
          { s: new Vec2(0.5, 1.0), t: new Vec2(0.0, 0.5) },
          { s: new Vec2(0.0, 0.5), t: new Vec2(0.5, 1.0) },
          { s: new Vec2(0.5, 1.0), t: new Vec2(0.5, 1.0) }
        ]
      };

      shp.pushFrameStrip(tex, 0, 10, 2, 2, 1);

      compare(shp, expected);
    });
  });

  describe("columnsIn", () => {
    test("sets columnsIn to 1 if it is less than", () => {
      let shp = new Shape();

      let expected = {
        texture: tex,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.0, 1.0) }
        ]
      };

      shp.pushFrameStrip(tex, 0, 1, -1);

      compare(shp, expected);
    });

    test("sets columnsIn to the texture's width if it is " +
    "greater than", () => {

      let shp = new Shape();

      let texSmall = new Texture();
      texSmall.create([{
        data: [
          255, 255, 255, 255,  255, 255, 255, 255,
          255, 255, 255, 255,  255, 255, 255, 255
        ],
        width: 4,
        height: 1
      }]);

      let expected = {
        texture: texSmall,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 0.25), t: new Vec2(0.0, 1.0) },
          { s: new Vec2(0.25, 0.5), t: new Vec2(0.0, 1.0) },
          { s: new Vec2(0.5, 0.75), t: new Vec2(0.0, 1.0) },
          { s: new Vec2(0.75, 1.0), t: new Vec2(0.0, 1.0) }
        ]
      };

      shp.pushFrameStrip(texSmall, 0, 4, 8);

      compare(shp, expected);
    });
  });

  describe("rowsIn", () => {
    test("sets rowsIn to 1 if it is less than", () => {
      let shp = new Shape();

      let expected = {
        texture: tex,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.0, 1.0) }
        ]
      };

      shp.pushFrameStrip(tex, 0, 1, 1, -1);

      compare(shp, expected);
    });

    test("sets rowsIn to the texture's height if it is " +
    "greater than", () => {

      let shp = new Shape();

      let texSmall = new Texture();
      texSmall.create([{
        data: [
          255, 255, 255, 255,  255, 255, 255, 255,
          255, 255, 255, 255,  255, 255, 255, 255
        ],
        width: 1,
        height: 4
      }]);

      let expected = {
        texture: texSmall,
        layer: 0,
        frames: [
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.0, 0.25) },
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.25, 0.5) },
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.5, 0.75) },
          { s: new Vec2(0.0, 1.0), t: new Vec2(0.75, 1.0) }
        ]
      };

      shp.pushFrameStrip(texSmall, 0, 4, 1, 8);

      compare(shp, expected);
    });
  });
});

describe("throws errors when argument type mismatches", () => {
  test("textureIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip("string"); }).
      toThrowError(/Texture/);
  });

  test("layerIn", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), "string"); }).
      toThrowError(/Number/);
  });

  test("count", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), 0, "string"); }).
      toThrowError(/Number/);
  });

  test("columns", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), 0, 2,
      "string"); }).toThrowError(/Number/);
  });

  test("rows", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), 0, 2, 1,
      "string"); }).toThrowError(/Number/);
  });

  test("start", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), 0, 2, 2, 1,
      "string"); }).toThrowError(/Number/);
  });

  test("offset", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushFrameStrip(new Texture(), 0, 2, 2, 1, 0,
      "string"); }).toThrowError(/Vec2/);
  });
});

describe("misc", () => {
  test("negative offset allows overlapping", () => {
    let shp = new Shape();

    let expected = {
      texture: tex,
      layer: 0,
      frames: [
        { s: new Vec2(0.0, 0.666), t: new Vec2(0.0, 1.0) },
        { s: new Vec2(0.333, 1.0), t: new Vec2(0.0, 1.0) }
      ]
    };

    shp.pushFrameStrip(tex, 0, 2, 2, 1, 0, new Vec2(-4,  0));

    compare(shp, expected);
  });
});
});

describe("setAnimation(...)", () => {
describe("applies suitable defaults for optional parameters", () => {
  let compare = (shape, expected) => {
    // compare shape's animation's state with the
    // supplied expected values

    expect(shape._animation._frames.length).
      toEqual(expected.frames.length);

    for (let i = 0; i < shape._animation._frames.length; ++i) {
      expect(shape._animation._frames[i]._index).
        toEqual(expected.frames[i].index);
      expect(shape._animation._frames[i]._time).
        toBeCloseTo(expected.frames[i].time, 5);
    }

    expect(shape._animation._dirInit).toEqual(expected.dirInit);
    expect(shape._animation._loopMax).toEqual(expected.loopMax);
    expect(shape._animation._loopDir).toEqual(expected.loopDir);
  }

describe("setAnimation()", () => {
  test("shape._frames is empty", () => {
    let shp = new Shape();

    let expected = {
      frames: [],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimation();

    compare(shp, expected);
  });

  test("shape._frames is not empty", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 0, time: Sol.minFrameTime},
        {index: 1, time: Sol.minFrameTime},
        {index: 2, time: Sol.minFrameTime}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimation();

    compare(shp, expected);
  });
});

  test("setAnimation(timingsIn)", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2},
        {index: 2, time: 2}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimation([1, 2]);

    compare(shp, expected);
  });

  test("setAnimation(timingsIn, startIn)", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 1, time: 1},
        {index: 2, time: 2}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimation([1, 2], 1);

    compare(shp, expected);
  });

  test("setAnimation(timingsIn, startIn, endIn)", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimation([1, 2], 0, 1);

    compare(shp, expected);
  });

  test("setAnimation(timingsIn, startIn, endIn, directionIn)", () => {
    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 2, time: 1},
        {index: 1, time: 2},
        {index: 0, time: 2}],
      dirInit: -1,
      loopMax: -1,
      loopDir: -1
    }

    shp.setAnimation([1, 2], 2, 0, "reverse-bounce");

    compare(shp, expected);
  });

  test("setAnimation(timingsIn, startIn, endIn, directionIn, " +
  "loopsIn)", () => {

    let shp = new Shape();
      shp._frames = [new Shape.Frame(),
        new Shape.Frame(), new Shape.Frame()];

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2},
        {index: 2, time: 2}],
      dirInit: 1,
      loopMax: 4,
      loopDir: 1
    }

    shp.setAnimation([1, 2], 0, 2, "forward", 4);

    compare(shp, expected);
  });
});

describe("throws errors when argument type mismatches", () => {
  test("timingsIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimation("string")).
      toThrowError(/Array/);
  });

  test("startIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimation([], "string")).
      toThrowError(/Number/);
  });

  test("endIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimation([], 0, "string")).
      toThrowError(/Number/);
  });

  test("directionIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimation([], 0, 0, 0)).
      toThrowError(/String/);
  });

  test("loopsIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimation([], 0, 0, "forward", "string")).
      toThrowError(/Number/);
  });
});
});

describe("setAnimationArray(indices, ...)", () => {
describe("applies suitable defaults for optional parameters", () => {
  let compare = (shape, expected) => {
    expect(shape._animation._frames.length).
      toEqual(expected.frames.length);

    for (let i = 0; i < shape._animation._frames.length; ++i) {
      expect(shape._animation._frames[i]._index).
        toEqual(expected.frames[i].index);
      expect(shape._animation._frames[i]._time).
        toBeCloseTo(expected.frames[i].time, 5);
    }

    expect(shape._animation._dirInit).toEqual(expected.dirInit);
    expect(shape._animation._loopMax).toEqual(expected.loopMax);
    expect(shape._animation._loopDir).toEqual(expected.loopDir);
  }

  test("setAnimationArray(indices)", () => {
    let shp = new Shape();

    let expected = {
      frames: [{index: 0, time: Sol.minFrameTime},
        {index: 1, time: Sol.minFrameTime},
        {index: 2, time: Sol.minFrameTime}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimationArray([0, 1, 2]);

    compare(shp, expected);
  });

  test("setAnimationArray(indices, timingsIn)", () => {
    let shp = new Shape();

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2},
        {index: 2, time: 2}],
      dirInit: 1,
      loopMax: -1,
      loopDir: 1
    }

    shp.setAnimationArray([0, 1, 2], [1, 2]);

    compare(shp, expected);
  });

  test("setAnimationArray(indices, timingsIn, directionIn)", () => {
    let shp = new Shape();

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2},
        {index: 2, time: 2}],
      dirInit: -1,
      loopMax: -1,
      loopDir: -1
    }

    shp.setAnimationArray([0, 1, 2], [1, 2], "reverse-bounce");

    compare(shp, expected);
  });

  test("setAnimationArray(indices, timingsIn, directionIn, " +
  "loopsIn)", () => {
    let shp = new Shape();

    let expected = {
      frames: [{index: 0, time: 1},
        {index: 1, time: 2},
        {index: 2, time: 2}],
      dirInit: -1,
      loopMax: 2,
      loopDir: -1
    }

    shp.setAnimationArray([0, 1, 2], [1, 2], "reverse-bounce", 2);

    compare(shp, expected);
  });
});

describe("throws errors when argument type mismatches", () => {
  test("indices", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimationArray("string")).
      toThrowError(/Array/);
  });

  test("timingsIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimationArray([], "string")).
      toThrowError(/Array/);
  });

  test("directionIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimationArray([], [], 0)).
      toThrowError(/String/);
  });

  test("loopsIn", () => {
    let shp = new Shape();
    
    expect(() => shp.setAnimationArray([], [], "forward", "string")).
      toThrowError(/Number/);
  });
});
});

describe("resetAnimation()", () => {
describe("resets relevant properties back to initial values", () => {
  test("animation exists", () => {
    let anim = new Shape.Animation();
      anim._index = 2;
      anim._frames = [{_index: 2, _time: 1},
        {_index: 1, _time: 1}, {_index: 0, _time: 1}];

    let shp = new Shape();
      shp._animation = anim;
      shp._timer = 4;
      shp.animating = false;
      shp._currentFrame = 0;

    let expected = {
      timer: 0,
      animating: true,
      currentFrame: 2,
    };

    shp.resetAnimation();

    expect(shp._timer).toEqual(expected.timer);
    expect(shp.animating).toEqual(expected.animating);
    expect(shp._currentFrame).toEqual(expected.currentFrame);
  });

  test("animation doesn't exist", () => {
    let shp = new Shape();
      shp._timer = 4;
      shp.animating = true;
      shp._currentFrame = 2;

    let expected = {
      timer: 0,
      animating: false,
      currentFrame: 0,
    };

    shp.resetAnimation();

    expect(shp._timer).toEqual(expected.timer);
    expect(shp.animating).toEqual(expected.animating);
    expect(shp._currentFrame).toEqual(expected.currentFrame);
  });
});
});

describe.todo("triangulate()", () => {
  
});

describe.todo("asData()", () => {
  
});

describe("pushVert(vert)", () => {
  test("adds vert to the vertices, updates the bounding box and " +
  "resets the indices", () => {

    let shp = new Shape();
      shp._indices = [0, 1, 2];
    
    let expected = {
      verts: [new Vec2(-10, 5)],
      indices: [],
      boundingBox: {
        lower: new Vec2(-10, 5),
        upper: new Vec2(-10, 5)
      }
    }

    shp.pushVert(new Vec2(-10, 5));
    
    expect(shp._verts.length).toEqual(expected.verts.length);
      expect(shp._verts[0].x).toEqual(expected.verts[0].x);
      expect(shp._verts[0].y).toEqual(expected.verts[0].y);
    expect(shp._indices.length).toEqual(expected.indices.length);

    expect(shp._transformable._boundingBox.lower.x).
      toEqual(expected.boundingBox.lower.x);
    expect(shp._transformable._boundingBox.lower.y).
      toEqual(expected.boundingBox.lower.y);

    expect(shp._transformable._boundingBox.upper.x).
      toEqual(expected.boundingBox.upper.x);
    expect(shp._transformable._boundingBox.upper.y).
      toEqual(expected.boundingBox.upper.y);
  });

  test("throws an error if vert is the wrong type", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushVert("string"); }).toThrowError(/Vec2/);
  });
});

describe("pushVerts(verts)", () => {
  test("adds verts to the vertices, updates the bounding box and " +
  "resets the indices", () => {

    let shp = new Shape();
      shp._indices = [0, 1, 2];
    
    let expected = {
      verts: [new Vec2(-10, 5), new Vec2(10, -5)],
      indices: [],
      boundingBox: {
        lower: new Vec2(-10, -5),
        upper: new Vec2( 10,  5)
      }
    }

    shp.pushVerts([new Vec2(-10, 5), new Vec2(10, -5)]);
    
    expect(shp._verts.length).toEqual(expected.verts.length);
    shp._verts.forEach((e, i) => {
      expect(e.x).toEqual(expected.verts[i].x);
      expect(e.y).toEqual(expected.verts[i].y);
    });
    
    expect(shp._indices.length).toEqual(expected.indices.length);

    expect(shp._transformable._boundingBox.lower.x).
      toEqual(expected.boundingBox.lower.x);
    expect(shp._transformable._boundingBox.lower.y).
      toEqual(expected.boundingBox.lower.y);

    expect(shp._transformable._boundingBox.upper.x).
      toEqual(expected.boundingBox.upper.x);
    expect(shp._transformable._boundingBox.upper.y).
      toEqual(expected.boundingBox.upper.y);
  });

  test("throws an error if verts is the wrong type", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushVerts("string"); }).toThrowError(/Array/);
  });

  test("throws an error if verts contains the wrong type", () => {
    let shp = new Shape();
    
    expect(() => { shp.pushVerts(["string"]); }).toThrowError(/Vec2/);
  });
});

describe.todo("_generateOutline(mode)", () => {
  
});
});
