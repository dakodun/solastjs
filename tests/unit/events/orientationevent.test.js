import { describe, test, expect } from 'vitest';

import OrientationEvent from '../../../scr/events/orientationevent.js';

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
