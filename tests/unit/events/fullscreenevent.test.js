import { describe, test, expect } from 'vitest';

import FullscreenEvent from '../../../src/events/fullscreenevent.js';

//> FullscreenEvent //
describe("FullscreenEvent", () => {
  //> constructor(success, status) //
  describe("constructor", () => {
    test("uses a default value of (1, 1) when none supplied", () => {
      let event = new FullscreenEvent();

      let expected = { success: false, status: 0 }

      expect(event.success).toEqual(expected.success);
      expect(event._status).toEqual(expected.status);
    });

    test("assigns the arguments passed", () => {
      let event = new FullscreenEvent(true, 1);

      let expected = { success: true, status: 1 }

      expect(event.success).toEqual(expected.success);
      expect(event._status).toEqual(expected.status);
    });

    test("throws an error if status is not a Number", () => {
      expect(() => { new FullscreenEvent(false, "str") })
        .toThrowError(/Number/);
    });
  });

  //> type //
  describe("type", () => {
    describe("get", () => {
      test("returns the static type property associated with " +
          "FullscreenEvent", () => {
        
        let event = new FullscreenEvent();

        expect(event.type).toEqual(FullscreenEvent.type);
      });
    });
  });

  //> status //
  describe("status", () => {
    describe("get", () => {
      test("returns the status of the fullscreen operation", () => {
        let event = new FullscreenEvent();
          event._status = 1;
        
        let status = event.status;
        
        expect(status).toEqual(event._status);
      });
    });

    describe("set", () => {
      test("sets the status of the fullscreen operation", () => {
        let event = new FullscreenEvent();
          event._status = 1;
        
        let expected = { status: 0 }

        event.status = 0;

        expect(event._status).toEqual(expected.status);
      });

      test("throws an error on a type mismatch", () => {
        let event = new FullscreenEvent();
        
        expect(() => { event.status = "str"; })
          .toThrowError(/Number/);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("copies all properties from other to this", () => {
      let event = new FullscreenEvent();
        event.success = false;
        event._status = 0;

      let other = new FullscreenEvent();
        other.success = true;
        other._status = 1;
      
      event.copy(other);

      expect(event.success).toEqual(other.success);
      expect(event._status).toEqual(other._status);
    });

    test("throws an error if other is not a FullscreenEvent", () => {
      let event = new FullscreenEvent();

      expect(() => { event.copy("string"); })
        .toThrowError(/FullscreenEvent/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new FullscreenEvent();
        other.success = true;
        other._status = 1;
      
      let event = other.getCopy();

      expect(event.success).toEqual(other.success);
      expect(event._status).toEqual(other._status);
    });
  });

  //> equals(other) //
  describe("equals()", () => {
    let compare = (modFunc, expected) => {
      let event = new FullscreenEvent();
        event.success = true;
        event._status = 1;
      let other = new FullscreenEvent();
        other.success = true;
        other._status = 1;

      expect(event.equals(other)).toEqual(true);
      modFunc(other);
      expect(event.equals(other)).toEqual(expected);
    }

    test("returns true if all components match", () => {
      compare(() => { }, true);
    });

    test("returns false on a mismatch", () => {
      compare((other) => {
        other.success = false;
      }, false);

      compare((other) => {
        other._status = 0;
      }, false);
    });

    test("throws an error if 'other' is not a FullscreenEvent", () => {
      let event = new FullscreenEvent();

      expect(() => { event.equals("str"); })
        .toThrowError(/FullscreenEvent/);
    });
  });

  //> getType() //
  describe.todo("getType()", () => {
    // [!] deprecated
  });
});
