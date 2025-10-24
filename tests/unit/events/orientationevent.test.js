import { describe, test, expect } from 'vitest';

import OrientationEvent from '../../../src/events/orientationevent.js';

import * as enums from '../../../src/exportenums.js';

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let event = new OrientationEvent();
    let eventOther = new OrientationEvent();

    event.copy(eventOther);
    
    expect(event).toEqual(eventOther);
    expect(event).not.toBe(eventOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'OrientationEvent'", () => {
    let event = new OrientationEvent();
    let eventStr = "eventStr";

    expect(() => event.copy(eventStr)).toThrowError(/OrientationEvent/);
  });


  test("this.getCopy() should return a 'OrientationEvent'", () => {
    let eventOther = new OrientationEvent();
    let event = eventOther.getCopy();

    expect(event).toBeInstanceOf(OrientationEvent);
  });

  test("this.getCopy() should return a 'OrientationEvent' which is " +
  "a deep copy of 'this'", () => {
    let eventOther = new OrientationEvent();
    let event = eventOther.getCopy();

    expect(eventOther).toEqual(event);
    expect(eventOther).not.toBe(event);
  });
});

describe("typing", () => {
  test("this.getType() should return a 'Number'", () => {
    let event = new OrientationEvent();

    let type = event.getType();

    expect(type).toBeTypeOf('number');
  });

  test("this.getType() should return a 'Number' which matches " +
  "the enum associated with this type", () => {
    let event = new OrientationEvent();
    let expected = enums.Event.ORIENTATION;

    let type = event.getType();

    expect(type).toEqual(expected);
  });
});
