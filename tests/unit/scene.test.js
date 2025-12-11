import { describe, test, expect } from 'vitest';

import Scene from '../../src/scene.js';

//> Scene //
describe("Scene", () => {
  class SceneDerived extends Scene {
    constructor(name) {
      super(name);
    }
  };

  describe("new SceneDerived", () => {
    test("assigns first argument to 'name' property", () => {
      let scene = new SceneDerived("name");

      let expected = {
        name: "name"
      }

      expect(scene.name).toEqual(expected.name);
    });
  });

  test("properly inherits base methods", () => {
    let scene = new SceneDerived();

    expect(() => { scene.delete(); }).not.toThrowError();
    expect(() => { scene.render(); }).not.toThrowError();
    expect(() => { scene.input(); }).not.toThrowError();
    expect(() => { scene.process(); }).not.toThrowError();
    expect(() => { scene.postProcess(); }).not.toThrowError();
    expect(() => { scene.handleEventQueue(); }).not.toThrowError();
    expect(() => { scene.onEnter(); }).not.toThrowError();
    expect(() => { scene.onLeave(); }).not.toThrowError();
  });
});
