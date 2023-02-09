import InputTouch from './inputtouch.js';
import Vec2 from './vec2.js';

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

    this.keyStates = new Array();
    for (let i = 0; i < 255; ++i) {
      this.keyStates[i] = 0;
    }

    this.disableBackspace = true;

    this.touches = new Map();
    this.touchTolerance = 1.0;
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

    for (let i = 0; i < 255; ++i) {
      if (this.keyStates[i] == 2) { // if pressed...
        this.keyStates[i] = 1; // now down
      }
      else if (this.keyStates[i] == 3) { // if released...
        this.keyStates[i] = 0; // now up
      }
    }

    for (let t of this.touches.values()) {
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

  getGlobalMouse() {
    return this.globalMouse;
  }

  getMouseWheel() {
    return this.wheelDelta;
  }

  getKeyDown(key) {
    if (key >= 0 && key <= 255) {
      if (this.keyStates[key] == 1 || this.keyStates[key] == 2) {
        return true;
      }
    }
    
    return false;
  }

  getKeyPressed(key) {
    if (key >= 0 && key <= 255) {
      if (this.keyStates[key] == 2) {
        return true;
      }
    }
    
    return false;
  }

  getKeyReleased(key) {
    if (key >= 0 && key <= 255) {
      if (this.keyStates[key] == 3) {
        return true;
      }
    }
    
    return false;
  }

  getTouches() {
    return this.touches;
  }

  getTouchStart(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined && it.state == 2) {
      return true;
    }

    return false;
  }

  getTouchEnd(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined && it.state == 3) {
      return true;
    }

    return false;
  }

  getTouchCancel(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined && it.state == 4) {
      return true;
    }

    return false;
  }

  getLocalTouch(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined) {
      return it.local;
    }

    return new Vec2(0.0, 0.0);
  }

  getGlobalTouch(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined) {
      return it.global;
    }

    return new Vec2(0.0, 0.0);
  }

  getTouchMoved(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined) {
      return it.moved;
    }

    return true;
  }

  cancelTouch(touch) {
    let it = this.touches.get(touch.id);
    if (it != undefined) {
      const t = new Touch({
          identifier: touch.id,
          target: document
      });

      const e = new TouchEvent("touchcancel", {
          changedTouches: [t]
      });

      document.dispatchEvent(e);
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
    this.localMouse.x = e.clientX - this.app.canvasPos.x;
    this.localMouse.y = window.innerHeight -
        (e.clientY - this.app.canvasPos.y);

    this.globalMouse.x = e.clientX;
    this.globalMouse.y = window.innerHeight - e.clientY;
  }

  handleKeyDown(e) {
    if (this.keyStates[e.keyCode] == 0) {
      this.keyStates[e.keyCode] = 2;
    }
    
    if (e.keyCode == 8) {
      if (this.disableBackspace == true) {
        e.preventDefault();
      }
    }
  }

  handleKeyUp(e) {
    if (this.keyStates[e.keyCode] == 1) {
      this.keyStates[e.keyCode] = 3;
    }
  }

  handleTouchStart(e) {
    e.preventDefault();

    let touches = e.changedTouches;
    for (let t of touches) {
      let it = new InputTouch(); {
        it.id = t.identifier;

        it.localStart.x = t.clientX - this.app.canvasPos.x;
        it.localStart.y = window.innerHeight -
            (t.clientY - this.app.canvasPos.y);
          
        it.globalStart.x = t.clientX;
        it.globalStart.y = window.innerHeight - t.clientY;

        it.local.copy(it.localStart);
        it.global.copy(it.globalStart);

        it.state = 2; // state is started
      }

      this.touches.set(it.id, it);
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
        it.local.x = t.clientX - this.app.canvasPos.x;
        it.local.y = window.innerHeight -
            (t.clientY - this.app.canvasPos.y);
          
        it.global.x = t.clientX;
        it.global.y = window.innerHeight - t.clientY;

        it.moved = true;
      }
    }
  }
  // ...callback functions end
};

export default InputManager;
