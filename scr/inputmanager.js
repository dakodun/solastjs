import InputTouch from './inputtouch.js';
import Vec2 from './vec2.js';
import * as enums from './inputenums.js';

class InputManager {
	constructor() {
    this.app = null;

		this.mouseStates = new Array();
    for (let i = 0; i < 3; ++i) {
      this.mouseStates[i] = 0;
    }

    this.localMouse = new Vec2(0.0, 0.0);
    this.globalMouse = new Vec2(0.0, 0.0);
    this.wheelDelta = 0
    this.disableMouseWheel = false;
    this.localMousePrev = null;
    this.globalMousePrev = null;

    this.keyStates = new Map();
    for (const [key, value] of Object.entries(enums.Key)) {
      this.keyStates.set(value, 0);
    }

    this.disableBackspace = true;

    this.touches = new Map();
    this.newTouches = new Array();
	}

  register(app) {
    this.app = app;

    document.addEventListener("mousedown",
        this.handleMouseDown.bind(this), true);
    document.addEventListener("mouseup",
        this.handleMouseUp.bind(this), true);
    document.addEventListener("wheel",
        this.handleMouseWheel.bind(this), true);
    document.addEventListener("mousemove",
        this.handleMouseMove.bind(this), true);
    
    document.addEventListener("keydown",
        this.handleKeyDown.bind(this), true);
    document.addEventListener("keyup",
        this.handleKeyUp.bind(this), true);
    
    document.addEventListener("touchstart",
        this.handleTouchStart.bind(this), {capture: true, passive: false});
    document.addEventListener("touchend",
        this.handleTouchEnd.bind(this), true);
    document.addEventListener("touchcancel",
        this.handleTouchCancel.bind(this), true);
    document.addEventListener("touchmove",
        this.handleTouchMove.bind(this), true);
  }

  process() {
    for (let i = 0; i < 3; ++i) {
      if (this.mouseStates[i] == 2) { // if pressed...
        this.mouseStates[i] = 1; // now down
      }
      else if (this.mouseStates[i] == 3) { // if released...
        this.mouseStates[i] = 0; // now up
      }
    }

    this.wheelDelta = 0;

    // if mouse has moved since last frame reset it
    if (this.localMousePrev != null && 
        !this.localMouse.equals(this.localMousePrev)) {

      this.localMousePrev = this.localMouse.getCopy();
      this.globalMousePrev = this.globalMouse.getCopy();
    }

    for (const [key, value] of this.keyStates) {
      if (value == 2) { // if pressed...
        this.keyStates.set(key, 1); // now down
      }
      else if (value == 3) { // if released...
        this.keyStates.set(key, 0); // now up
      }
    }

    this.newTouches.splice(0, this.newTouches.length);
    for (let t of this.touches.values()) {
      // if touch has moved since last frame reset it
      if (!t.local.equals(t.localPrev)) {
        t.localPrev = t.local.getCopy();
        t.globalPrev = t.global.getCopy();
      }
      
      if (t.state == 2) { // if started...
        t.state = 1; // now in progress
      }
      else if (t.state == 3 || t.state == 4) { // if ended or cancelled...
        this.touches.delete(t.id);
      }
    }
  }

  // ...
  getMouseDown(button) {
    if (button >= 0 && button <= 2) {
      if (this.mouseStates[button] == 1 || this.mouseStates[button] == 2) {
        return true;
      }
    }
    
    return false;
  }

  getMousePressed(button) {
    if (button >= 0 && button <= 2) {
      if (this.mouseStates[button] == 2) {
        return true;
      }
    }
    
    return false;
  }

  getMouseReleased(button) {
    if (button >= 0 && button <= 2) {
      if (this.mouseStates[button] == 3) {
        return true;
      }
    }
    
    return false;
  }

  getLocalMouse() {
    return this.localMouse;
  }

  getLocalMouseChange() {
    let result = new Vec2();
    
    if (this.localMousePrev != null) { 
      result.x = this.localMouse.x - this.localMousePrev.x;
      result.y = this.localMouse.y - this.localMousePrev.y;
    }

    return result;
  }

  getGlobalMouse() {
    return this.globalMouse;
  }

  getGlobalMouseChange() {
    let result = new Vec2();

    if (this.globalMousePrev != null) { 
      result.x = this.globalMouse.x - this.globalMousePrev.x;
      result.y = this.globalMouse.y - this.globalMousePrev.y;
    }

    return result;
  }

  getMouseMoved() {
    if (this.localMousePrev != null && 
        !this.localMouse.equals(this.localMousePrev)) {

      return true;
    }

    return false;
  }

  getMouseWheel() {
    return this.wheelDelta;
  }
  

  getKeyDown(key) {
    if (this.keyStates.has(key)) {
      if (this.keyStates.get(key) == 1 ||
          this.keyStates.get(key) == 2) {
        
        return true;
      }
    }
    
    return false;
  }

  getKeyPressed(key) {
    if (this.keyStates.has(key)) {
      if (this.keyStates.get(key) == 2) {
        return true;
      }
    }
    
    return false;
  }

  getKeyReleased(key) {
    if (this.keyStates.has(key)) {
      if (this.keyStates.get(key) == 3) {
        return true;
      }
    }
    
    return false;
  }


  getTouches() {
    return this.touches;
  }

  getNewTouches() {
    return this.newTouches;
  }

  getTouchEnd(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined && it.state == 3) {
        return true;
      }
    }

    return false;
  }

  getTouchCancel(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined && it.state == 4) {
        return true;
      }
    }

    return false;
  }

  getLocalTouch(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined) {
        return it.local;
      }
    }

    return new Vec2(0.0, 0.0);
  }

  getLocalTouchChange(touchID) {
    let result = new Vec2();

    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined) {
        if (it.localPrev != null) { 
          result.x = it.local.x - it.localPrev.x;
          result.y = it.local.y - it.localPrev.y;
        }
      }
    }

    return result;
  }

  getGlobalTouch(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined) {
        return it.global;
      }
    }

    return new Vec2(0.0, 0.0);
  }

  getGlobalTouchChange(touchID) {
    let result = new Vec2();

    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined) {
        if (it.globalPrev != null) { 
          result.x = it.global.x - it.globalPrev.x;
          result.y = it.global.y - it.globalPrev.y;
        }
      }
    }

    return result;
  }

  getTouchMoved(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);

      if (it != undefined) {
        if (!it.local.equals(it.localPrev)) {
          return true;
        }
      }
    }

    return false;
  }

  cancelTouch(touchID) {
    if (touchID != undefined && touchID != null) {
      let it = this.touches.get(touchID);
      if (it != undefined) {
        const t = new Touch({
            identifier: touchID,
            target: document
        });

        const e = new TouchEvent("touchcancel", {
            changedTouches: [t]
        });

        document.dispatchEvent(e);
      }
    }
  }
  // ...


  // callback functions begin...
  handleMouseDown(e) {
    if (this.mouseStates[e.button] == 0) {
      this.mouseStates[e.button] = 2;
    }
  }

  handleMouseUp(e) {
    if (this.mouseStates[e.button] == 1) {
      this.mouseStates[e.button] = 3;
    }
  }

  handleMouseWheel(e) {
    if (e.deltaY > 0) {
      ++this.wheelDelta;
    }
    else if (e.deltaY < 0) {
      --this.wheelDelta;
    }
    
    if (this.disableMouseWheel == true) {
      e.preventDefault();
    }
  }

  handleMouseMove(e) {
    this.localMousePrev = this.localMouse.getCopy();
    this.localMouse.x = e.clientX - this.app.canvasPos.x;
	  this.localMouse.y = window.innerHeight -
        (e.clientY - this.app.canvasPos.y);

    this.globalMousePrev = this.globalMouse.getCopy();
    this.globalMouse.x = e.clientX;
	  this.globalMouse.y = window.innerHeight - e.clientY;
  }

  handleKeyDown(e) {
    if (this.keyStates.get(e.code) == 0) {
      this.keyStates.set(e.code, 2);
    }

    if (e.code == "Backspace") {
      if (this.disableBackspace == true) {
        e.preventDefault();
      }
    }
  }

  handleKeyUp(e) {
    if (this.keyStates.get(e.code) == 1) {
      this.keyStates.set(e.code, 3);
    }
  }

  handleTouchStart(e) {
    e.preventDefault();

    let touches = e.changedTouches;
    for (let t of touches) {
      let it = new InputTouch(); {
        it.id = t.identifier;

        it.local.x = t.clientX - this.app.canvasPos.x;
        it.local.y = window.innerHeight -
            (t.clientY - this.app.canvasPos.y);
          
        it.global.x = t.clientX;
        it.global.y = window.innerHeight - t.clientY;

        it.localPrev = it.local.getCopy();
        it.globalPrev = it.global.getCopy();

        it.state = 2; // state is started
      }

      this.touches.set(it.id, it);
      this.newTouches.push(it.id);
    }
  }

  handleTouchEnd(e) {
    let touches = e.changedTouches;
    for (let t of touches) {
      let it = this.touches.get(t.identifier);
      if (it != undefined) {
        it.state = 3; // state is ended
      }
    }
  }

  handleTouchCancel(e) {
    let touches = e.changedTouches;
    for (let t of touches) {
      let it = this.touches.get(t.identifier);
      if (it != undefined) {
        it.state = 4; // state is ended
      }
    }
  }

  handleTouchMove(e) {
    let touches = e.changedTouches;
    for (let t of touches) {
      let it = this.touches.get(t.identifier);

      if (it != undefined) {
        it.localPrev = it.local.getCopy();
        it.local.x = t.clientX - this.app.canvasPos.x;
        it.local.y = window.innerHeight -
            (t.clientY - this.app.canvasPos.y);
        
        it.globalPrev = it.global.getCopy();
        it.global.x = t.clientX;
        it.global.y = window.innerHeight - t.clientY;
      }
    }
  }
  // ...callback functions end
};

export default InputManager;
