import { describe, test, expect } from 'vitest';

import OrientationEvent from '../../../src/events/orientationevent.js';

//> OrientationEvent //
describe("OrientationEvent", () => {
  //> type //
  describe("type", () => {
    describe("get", () => {
      test("returns the static type property associated with " +
          "OrientationEvent", () => {
        
        let event = new OrientationEvent();

        expect(event.type).toEqual(OrientationEvent.type);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("throws an error if other is not a OrientationEvent", () => {
      let event = new OrientationEvent();

      expect(() => { event.copy("string"); })
        .toThrowError(/OrientationEvent/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new OrientationEvent();
      
      let event = other.getCopy();

      expect(event instanceof OrientationEvent).toEqual(true);
    });
  });

  //> equals(other) //
  describe("equals()", () => {
    test("returns true", () => {
      let event = new OrientationEvent();
      let other = new OrientationEvent();
      
      expect(event.equals(other)).toEqual(true);
    });

    test("throws an error if 'other' is not a OrientationEvent", () => {
      let event = new OrientationEvent();

      expect(() => { event.equals("str"); })
        .toThrowError(/OrientationEvent/);
    });
  });

  //> getType() //
  describe.todo("getType()", () => {
    // [!] deprecated
  });
});
