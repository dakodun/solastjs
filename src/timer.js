import Sol from './sol.js';

class Timer {
  //> private properties //
  _startTime = 0;
  _isPaused = false;
  _pauseTime = 0;
  
  //> constructor //
	constructor() {
  	this.reset();
	}
  
  //> getters/setters //
  get startTime() { return this._startTime; }
  get isPaused()  { return this._isPaused;  }
  
  //> public methods //
  copy(other) {
    Sol.checkTypes(this, "copy", [{ other }, [Timer]]);
    
    this._startTime = other._startTime;
    this._isPaused = other._isPaused;
    this._pauseTime = other._pauseTime;
  }
  
  getCopy() {
    const copy = new Timer();
    copy.copy(this);
    
    return copy;
  }
  
  equals(other) {
    Sol.checkTypes(this, "equals", [{other}, [Timer]]);
    
    return (
      this._startTime === other._startTime &&
      this._isPaused === other._isPaused &&
      this._pauseTime === other._pauseTime
    );
  }
  
  reset() {
    const d = new Date();
    this._startTime = d.getTime();
    
    this._isPaused = false;
    this._pauseTime = 0;
  }
  
  getElapsed() {
    const d = new Date();
    
    return d.getTime() - this._startTime;
  }
  
  pause() {
    // pause an active timer by storing the current time (the
    // moment of pause)
    
    if (this._isPaused === false) {
      const d = new Date();
      
      this._isPaused = true;
      this._pauseTime = d.getTime();
    }
  }
  
  resume() {
    // unpause a halted timer by finding the difference between the
    // current time and the time at the moment it was paused, and
    // compensate by adding it to the start time
    
    if (this._isPaused === true) {
      const d = new Date();
      
      const dt = d.getTime() - this._pauseTime;
      this._startTime += dt;
      
      this._isPaused = false;
      this._pauseTime = 0;
    }
  }
};

export default Timer;
