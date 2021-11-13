import DefaultEvent from './events/defaultevent.js';

class EventQueue {
  constructor() {
    this.queue = new Array();
  }

  get() {
    if (!this.empty()) {
      return this.queue[0].getCopy();
    }

    return new DefaultEvent();
  }

  push(e) {
    this.queue.push(e.getCopy());
  }

  pop() {
    if (!this.empty()) {
      this.queue.pop();
    }
  }

  empty() {
    if (this.queue.length != 0) {
      return false;
    }

    return true;
  }
}

export default EventQueue;
