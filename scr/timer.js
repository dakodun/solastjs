class Timer {
	constructor() {
		this.startTime = 0;
  	this.reset();
	}

  copy(other) {
    this.startTime = other.startTime;
  }

  getCopy() {
    let copy = new Timer(); copy.copy(this);
    return copy;
  }

  reset() {
    let d = new Date();
    this.startTime = d.getTime();
  }

  getElapsed() {
    let d = new Date();
    return d.getTime() - this.startTime;
  }
};

export default Timer;
