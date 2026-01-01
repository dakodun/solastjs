import { describe, test, expect } from 'vitest';

import SolEvent from '../../src/solevent.js';

//> SolEvent //
describe("SolEvent", () => {
  //> type //
  describe("type", () => {
    describe("get", () => {
      test("returns the static type property associated with " +
          "SolEvent", () => {
        
        let event = new SolEvent();

        expect(event.type).toEqual(SolEvent.type);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("throws an error if other is not a SolEvent", () => {
      let event = new SolEvent();

      expect(() => { event.copy("string"); })
        .toThrowError(/SolEvent/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new SolEvent();
      
      let event = other.getCopy();

      expect(event instanceof SolEvent).toEqual(true);
    });
  });

  //> equals(other) //
  describe("equals()", () => {
    test("returns true", () => {
      let event = new SolEvent();
      let other = new SolEvent();
      
      expect(event.equals(other)).toEqual(true);
    });

    test("throws an error if 'other' is not a SolEvent", () => {
      let event = new SolEvent();

      expect(() => { event.equals("str"); })
        .toThrowError(/SolEvent/);
    });
  });

  //> getType() //
  describe.todo("getType()", () => {
    // [!] deprecated
  });
});
