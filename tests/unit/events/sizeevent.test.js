import { describe, test, expect } from 'vitest';

import SizeEvent from '../../../scr/events/sizeevent.js';

import Vec2 from '../../../scr/vec2.js';
import * as enums from '../../../scr/exportenums.js';

describe("construction", () => {
  test("new SizeEvent(prev, new, ...) should assign the first " +
  "2 parameters supplied to 'this.prevDimensions' and " +
  "'this.newDimensions'", () => {
    let event = new SizeEvent(
      new Vec2(100, 200),
      new Vec2(300, 400),
      new Vec2(  0,   0)
    );

    let expected = [100, 200, 300, 400];

    expect(event.prevDimensions.x).toEqual(expected[0]);
    expect(event.prevDimensions.y).toEqual(expected[1]);
    expect( event.newDimensions.x).toEqual(expected[2]);
    expect( event.newDimensions.y).toEqual(expected[3]);
  });

  test("new SizeEvent(prev) should assign assign the value " +
  "supplied to 'this.prevDimensions' and assign 'this.newDimensions' " +
  "a default value", () => {
    let event = new SizeEvent(
      new Vec2(100, 200)
    );

    let expected = [100, 200, 1, 1];

    expect(event.prevDimensions.x).toEqual(expected[0]);
    expect(event.prevDimensions.y).toEqual(expected[1]);
    expect( event.newDimensions.x).toEqual(expected[2]);
    expect( event.newDimensions.y).toEqual(expected[3]);
  });

  test("new SizeEvent() should assign a default value of Vec2(1, 1) " +
  "to both 'this.prevDimensions' and 'this.newDimensions'", () => {
    let event = new SizeEvent();
    let expected = 1;

    expect(event.prevDimensions.x).toEqual(expected);
    expect(event.prevDimensions.y).toEqual(expected);
    expect( event.newDimensions.x).toEqual(expected);
    expect( event.newDimensions.y).toEqual(expected);
  });

  test("new SizeEvent(...) should throw an error if a parameter " + 
  "supplied is not a 'Vec2'", () => {
    let vectorStr = "vectorStr";

    expect(() => new SizeEvent(vectorStr, new Vec2(0, 0))).
      toThrowError(/Vec2/);
    expect(() => new SizeEvent(new Vec2(0, 0), vectorStr)).
      toThrowError(/Vec2/);
  });
});

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let event = new SizeEvent();
    let eventOther = new SizeEvent();

    event.copy(eventOther);
    
    expect(event).toEqual(eventOther);
    expect(event).not.toBe(eventOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'SizeEvent'", () => {
    let event = new SizeEvent();
    let eventStr = "eventStr";

    expect(() => event.copy(eventStr)).toThrowError(/SizeEvent/);
  });


  test("this.getCopy() should return a 'SizeEvent'", () => {
    let eventOther = new SizeEvent();
    let event = eventOther.getCopy();

    expect(event).toBeInstanceOf(SizeEvent);
  });

  test("this.getCopy() should return a 'SizeEvent' which is " +
  "a deep copy of 'this'", () => {
    let eventOther = new SizeEvent();
    let event = eventOther.getCopy();

    expect(eventOther).toEqual(event);
    expect(eventOther).not.toBe(event);
  });
});

describe("typing", () => {
  test("this.getType() should return a 'Number'", () => {
    let event = new SizeEvent();

    let type = event.getType();

    expect(type).toBeTypeOf('number');
  });

  test("this.getType() should return a 'Number' which matches " +
  "the enum associated with this type", () => {
    let event = new SizeEvent();
    let expected = enums.Event.SIZE;

    let type = event.getType();

    expect(type).toEqual(expected);
  });
});
