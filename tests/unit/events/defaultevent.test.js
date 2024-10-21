import { describe, test, expect } from 'vitest';

import DefaultEvent from '../../../scr/events/defaultevent.js';

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let event = new DefaultEvent();
    let eventOther = new DefaultEvent();

    event.copy(eventOther);
    
    expect(event).toEqual(eventOther);
    expect(event).not.toBe(eventOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'DefaultEvent'", () => {
    let event = new DefaultEvent();
    let eventStr = "eventStr";

    expect(() => event.copy(eventStr)).toThrowError(/DefaultEvent/);
  });


  test("this.getCopy() should return a 'DefaultEvent'", () => {
    let eventOther = new DefaultEvent();
    let event = eventOther.getCopy();

    expect(event).toBeInstanceOf(DefaultEvent);
  });

  test("this.getCopy() should return a 'DefaultEvent' which is " +
  "a deep copy of 'this'", () => {
    let eventOther = new DefaultEvent();
    let event = eventOther.getCopy();

    expect(eventOther).toEqual(event);
    expect(eventOther).not.toBe(event);
  });
});
