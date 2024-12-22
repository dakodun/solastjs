class Timer {
  // private fields...
    #startTime = 0;
  // ...

	constructor() {
  	this.reset();
	}

  // getters/setters...
  get startTime() { return this.#startTime; }
  // ...

  copy(other) {
    if (!(other instanceof Timer)) {
      throw new TypeError("Timer (copy): other should be a Timer");
    }

    this.#startTime = other.#startTime;
  }

  getCopy() {
    let copy = new Timer();
    copy.copy(this);

    return copy;
  }

  reset() {
    let d = new Date();
    this.#startTime = d.getTime();
  }

  getElapsed() {
    let d = new Date();

    return d.getTime() - this.#startTime;
  }
};

export default Timer;
