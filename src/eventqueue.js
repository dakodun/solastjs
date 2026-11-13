class EventQueue {
  // an event queue is actually 3 separate queues of varying
  // priorities, each of which are accessed in ascending order
  // as necessary
  
  // 0: critical, always processed even during pauses
  // 1: deferred, not processed but stored until resumption
  // 2: discarded, ignored completely during a pause
  
  _queues = [[], [], []];
  
  constructor() {
    
  }
  
  peek() {
    // return the next event to be processed regardless of
    // priority -- return undefined if queue is empty
    
    return this._queues[0][0] ||
      this._queues[1][0] || this._queues[2][0];
  }
  
  push(event, priority = 1) {
    // add an event to the end of the appropriate priority
    // queue (between 0 and 2, default: 1)
    
    const index = Math.min(Math.max(0, priority), 2);
    this._queues[index].push({ event, priority });
  }
  
  shift() {
    // remove the next event and return it regardless of
    // priority -- return undefined if queue is empty
    
    return this._queues[0].shift() ||
      this._queues[1].shift() || this._queues[2].shift();
  }
  
  isEmpty() {
    return (this._queues[0].length === 0 &&
      this._queues[1].length === 0 && this._queues[2].length === 0);
  }
}

export default EventQueue;
