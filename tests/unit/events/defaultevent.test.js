import { describe, test, expect } from 'vitest';

import DefaultEvent from '../../../src/events/defaultevent.js';

//> DefaultEvent //
describe("DefaultEvent", () => {
  //> type //
  describe("type", () => {
    describe("get", () => {
      test("returns the static type property associated with " +
          "DefaultEvent", () => {
        
        let event = new DefaultEvent();

        expect(event.type).toEqual(DefaultEvent.type);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("throws an error if other is not a DefaultEvent", () => {
      let event = new DefaultEvent();

      expect(() => { event.copy("string"); })
        .toThrowError(/DefaultEvent/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new DefaultEvent();
      
      let event = other.getCopy();

      expect(event instanceof DefaultEvent).toEqual(true);
    });
  });

  //> equals(other) //
  describe("equals()", () => {
    test("returns true", () => {
      let event = new DefaultEvent();
      let other = new DefaultEvent();
      
      expect(event.equals(other)).toEqual(true);
    });

    test("throws an error if 'other' is not a DefaultEvent", () => {
      let event = new DefaultEvent();

      expect(() => { event.equals("str"); })
        .toThrowError(/DefaultEvent/);
    });
  });

  //> getType() //
  describe.todo("getType()", () => {
    // [!] deprecated
  });
});
