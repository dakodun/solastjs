import { describe, test, expect } from 'vitest';

import SizeEvent from '../../../src/events/sizeevent.js';

import Vec2 from '../../../src/vec2.js';

//> SizeEvent //
describe("SizeEvent", () => {
  //> constructor(prevDimensions, newDimensions) //
  describe("constructor", () => {
    test("uses a default value of (1, 1) when none supplied", () => {
      let event = new SizeEvent();

      let expected = {
        prev: { x: 1, y: 1 },
        new: { x: 1, y: 1 }
      }

      expect(event._prevDimensions._x).toEqual(expected.prev.x);
      expect(event._prevDimensions._y).toEqual(expected.prev.y);

      expect(event._newDimensions._x).toEqual(expected.new.x);
      expect(event._newDimensions._y).toEqual(expected.new.y);
    });
    
    test("assigns the arguments passed", () => {
      let event = new SizeEvent(new Vec2(2, 3), new Vec2(4, 5));

      let expected = {
        prev: { x: 2, y: 3 },
        new: { x: 4, y: 5 }
      }

      expect(event._prevDimensions._x).toEqual(expected.prev.x);
      expect(event._prevDimensions._y).toEqual(expected.prev.y);

      expect(event._newDimensions._x).toEqual(expected.new.x);
      expect(event._newDimensions._y).toEqual(expected.new.y);
    });

    test("throws an error if prevDimensions is not a Vec2", () => {
      expect(() => { new SizeEvent("str", new Vec2()) })
        .toThrowError(/Vec2/);
    });

    test("throws an error if newDimensions is not a Vec2", () => {
      expect(() => { new SizeEvent(new Vec2(), "str") })
        .toThrowError(/Vec2/);
    });
  });

  //> type //
  describe("type", () => {
    describe("get", () => {
      test("returns the static type property associated with " +
          "SizeEvent", () => {
        
        let event = new SizeEvent();

        expect(event.type).toEqual(SizeEvent.type);
      });
    });
  });

  //> prevDimensions //
  describe("prevDimensions", () => {
    describe("get", () => {
      test("returns the old canvas dimensions", () => {
        let event = new SizeEvent();
          event._prevDimensions._x = 2;
          event._prevDimensions._y = 3;
        
        let vec = event.prevDimensions;
        
        expect(vec._x).toEqual(event._prevDimensions._x);
        expect(vec._y).toEqual(event._prevDimensions._y);
      });
    });

    describe("set", () => {
      test("sets the value (x, y) of the previous canvas" +
          "dimensions", () => {
        
        let event = new SizeEvent();
          event._prevDimensions._x = 2;
          event._prevDimensions._y = 3;
        
        let expected = { x: 6, y: 7 }

        event.prevDimensions = new Vec2(6, 7);

        expect(event._prevDimensions._x).toEqual(expected.x);
        expect(event._prevDimensions._y).toEqual(expected.y);
      });

      test("throws an error on a type mismatch", () => {
        let event = new SizeEvent();
        
        expect(() => { event.prevDimensions = "str"; })
          .toThrowError(/Vec2/);
      });
    });
  });

  //> newDimensions //
  describe("newDimensions", () => {
    describe("get", () => {
      test("returns the new canvas dimensions", () => {
        let event = new SizeEvent();
          event._newDimensions._x = 4;
          event._newDimensions._y = 5;
        
        let vec = event.newDimensions;
        
        expect(vec._x).toEqual(event._newDimensions._x);
        expect(vec._y).toEqual(event._newDimensions._y);
      });
    });

    describe("set", () => {
      test("sets the value (x, y) of the new canvas" +
          "dimensions", () => {
        
        let event = new SizeEvent();
          event._newDimensions._x = 4;
          event._newDimensions._y = 5;
        
        let expected = { x: 6, y: 7 }

        event.newDimensions = new Vec2(6, 7);

        expect(event._newDimensions._x).toEqual(expected.x);
        expect(event._newDimensions._y).toEqual(expected.y);
      });

      test("throws an error on a type mismatch", () => {
        let event = new SizeEvent();
        
        expect(() => { event.newDimensions = "str"; })
          .toThrowError(/Vec2/);
      });
    });
  });

  //> copy(other) //
  describe("copy()", () => {
    test("copies all properties from other to this", () => {
      let event = new SizeEvent();
        event._prevDimensions = new Vec2(1);
        event._newDimensions = new Vec2(1);

      let other = new SizeEvent();
        other._prevDimensions = new Vec2(2, 3);
        other._newDimensions = new Vec2(4, 5);
      
      event.copy(other);

      expect(event._prevDimensions._x)
        .toEqual(other._prevDimensions._x);
      expect(event._prevDimensions._y)
        .toEqual(other._prevDimensions._y);

      expect(event._newDimensions._x)
        .toEqual(other._newDimensions._x);
      expect(event._newDimensions._y)
        .toEqual(other._newDimensions._y);
    });

    test("throws an error if other is not a SizeEvent", () => {
      let event = new SizeEvent();

      expect(() => { event.copy("string"); })
        .toThrowError(/SizeEvent/);
    });
  });

  //> getCopy() //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let other = new SizeEvent();
        other._prevDimensions = new Vec2(2, 3);
        other._newDimensions = new Vec2(4, 5);
      
      let event = other.getCopy();

      expect(event._prevDimensions._x)
        .toEqual(other._prevDimensions._x);
      expect(event._prevDimensions._y)
        .toEqual(other._prevDimensions._y);

      expect(event._newDimensions._x)
        .toEqual(other._newDimensions._x);
      expect(event._newDimensions._y)
        .toEqual(other._newDimensions._y);
    });
  });

  //> equals(other) //
  describe("equals()", () => {
    let compare = (modFunc, expected) => {
      let event = new SizeEvent();
        event._prevDimensions = new Vec2(2, 3);
        event._newDimensions = new Vec2(4, 5);
      let other = new SizeEvent();
        other._prevDimensions = new Vec2(2, 3);
        other._newDimensions = new Vec2(4, 5);

      expect(event.equals(other)).toEqual(true);
      modFunc(other);
      expect(event.equals(other)).toEqual(expected);
    }

    test("returns true if all components match", () => {
      compare(() => { }, true);
    });

    test("returns false on a mismatch", () => {
      compare((other) => {
        other._prevDimensions = new Vec2(4, 5);
      }, false);

      compare((other) => {
        other._newDimensions = new Vec2(2, 3);
      }, false);
    });

    test("throws an error if 'other' is not a SizeEvent", () => {
      let event = new SizeEvent();

      expect(() => { event.equals("str"); })
        .toThrowError(/SizeEvent/);
    });
  });

  //> getType() //
  describe.todo("getType()", () => {
    // [!] deprecated
  });
});
