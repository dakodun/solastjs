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
  // ...callback functions end
};

export default InputManager;
