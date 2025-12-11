import { describe, test, expect } from 'vitest';

import SceneManager from '../../src/scenemanager.js';

import Scene from '../../src/scene.js';

//> SceneManager //
describe("SceneManager", () => {
  // create a class derived from base scene class
  class SceneDerived extends Scene {
    constructor(name) {
      super(name);
    }
  };
  
  //> current getter //
  describe("current", () => {
    describe("get", () => {
      test("returns the scenemanager's current scene (shallow)", () => {
        let sceneManager = new SceneManager();
          sceneManager._current = new SceneDerived("derived");

        let current = sceneManager.current;

        expect(current).toBe(sceneManager._current);
      });
    });
  });

  //> next getter //
  describe("next", () => {
    describe("get", () => {
      test("returns the scenemanager's next scene (shallow)", () => {
        let sceneManager = new SceneManager();
          sceneManager._next = new SceneDerived("derived");

        let next = sceneManager.next;

        expect(next).toBe(sceneManager._next);
      });
    });
  });

  //> copy(other) method //
  describe("copy()", () => {
    test("throws an error as deep copy is not available " + 
    "by default", () => {
      let sceneManager = new SceneManager();
      let other = new SceneManager();

      expect(() => { sceneManager.copy(other); })
        .toThrowError(/SceneManager/);
    });
  });

  //> getCopy(other) method //
  describe("getCopy()", () => {
    test("throws an error as deep copy is not available " + 
    "by default", () => {
      let sceneManager = new SceneManager();

      expect(() => { let other = sceneManager.getCopy(); })
        .toThrowError(/SceneManager/);
    });
  });

  //> equals(other) method //
  describe("equals()", () => {
    test("throws an error as comparison is not available " + 
    "by default", () => {
      let sceneManager = new SceneManager();
      let other = new SceneManager();

      expect(() => { sceneManager.equals(other); })
        .toThrowError(/SceneManager/);
    });
  });

  //> delete() method //
  describe("delete()", () => {
    test("unsets current and next when present", () => {
      let sceneCurr = new SceneDerived("curr");
      let sceneNext = new SceneDerived("next");

      let sceneManager = new SceneManager();
        sceneManager._current = sceneCurr;
        sceneManager._next = sceneNext;

      let expected = {
        current: null,
        next: null,
      }

      sceneManager.delete();
      
      expect(sceneManager._current).toBe(expected.current);
      expect(sceneManager._next).toBe(expected.next);
    });

    test("clears all scenes saved in store", () => {
      let sceneStored = new SceneDerived("stored");

      let sceneManager = new SceneManager();
        sceneManager._store.set("stored", sceneStored);

      sceneManager.delete();
      
      expect(sceneManager._store.has("stored")).toEqual(false);
    });
  });

  //> requestChange(sceneType, name, save) method //
  describe("requestChange()", () => {
    test("throws an error if sceneType is not (ultimately) derived " +
    "from Scene", () => {
      class SceneError {
        
      };

      let sceneManager = new SceneManager();

      expect(() => { sceneManager.requestChange(SceneError); })
        .toThrowError(/Scene/);
    });

    // [!]
    // defaults to non-save
    // handles a saved scene of name existing
      // restores it
      // sets loaded
      // deletes it
    // handles a saved scene of name NOT existing
      // creates new
      // sets loaded
    // updates saved when indicated
  });

  //> change() method //
  describe("change()", () => {
    test("returns false if NO change queued", () => {
      let sceneManager = new SceneManager();

      let result = sceneManager.change();

      expect(result).toEqual(false);
    });

    test("returns true if a change IS queued, updates" + 
    "current and resets loaded/saved state to false", () => {
      let scene = new SceneDerived("derived");

      let sceneManager = new SceneManager();
        sceneManager._next = scene;
        sceneManager._loaded = true;
        sceneManager._saved = true;

      let expected = {
        current: scene,
        loaded: false,
        saved: false
      }

      let result = sceneManager.change();

      expect(result).toEqual(true);

      expect(sceneManager._current).toBe(expected.current);
      expect(sceneManager._loaded).toBe(expected.loaded);
      expect(sceneManager._saved).toBe(expected.saved);
    });

    test("doesn't store the current scene if saved is false", () => {
      let sceneCurr = new SceneDerived("curr");
      let sceneNext = new SceneDerived("next");

      let sceneManager = new SceneManager();
        sceneManager._current = sceneCurr;
        sceneManager._next = sceneNext;
      
      sceneManager.change();

      expect(sceneManager._store.has("curr")).toEqual(false);
    });

    test("stores the current scene if saved is true", () => {
      let sceneCurr = new SceneDerived("curr");
      let sceneNext = new SceneDerived("next");

      let sceneManager = new SceneManager();
        sceneManager._current = sceneCurr;
        sceneManager._next = sceneNext;
        sceneManager._saved = true;
      
      sceneManager.change();

      expect(sceneManager._store.has("curr")).toEqual(true);
    });
  });
});
