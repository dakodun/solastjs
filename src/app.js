import AC, { acSetContext } from "./ac.js"
import GL, { glSetContext } from "./gl.js"
import GLStates from "./glstates.js"
import SolError from "./solerror.js";
import EventQueue from "./eventqueue.js";
import InputManager from "./inputmanager.js";
import ResourceManager from "./resourcemanager.js";
import ResourceLoader from "./resourceloader.js";
import SceneManager from "./scenemanager.js";
import Timer from "./timer.js";
import VBOVertex from "./vbovertex.js";
import Vec2 from "./vec2.js";

import ExternalEvent from "./events/externalevent.js";
import FullscreenEvent from "./events/fullscreenevent.js";
import OrientationEvent from "./events/orientationevent.js";
import SizeEvent from "./events/sizeevent.js";

import * as enums from "./exportenums.js";

class App {
  //> public properties //
  canvas = null;
  context = null;

  canvasPos = new Vec2(0.0, 0.0);

  resourceManager = new ResourceManager();
  inputManager = new InputManager();
  sceneManager = new SceneManager();

  resourceLoader = new ResourceLoader();

  frameTimer = new Timer();
  frameLimit = 0.02;
  frameSkip = true;
  frameMax = 15;

  renderPasses = 1;

  eventQueue = new EventQueue();
  eventQueueDeferred = new EventQueue();

  fillParent = true;
  
  _isPaused = false;

  //> constructor //
  constructor() {
    
  }
  
  //> getters //
  get isFullscreen() {
    return (document.fullscreenElement !== null &&
      document.fullscreenElement === this.canvas);
  }
  
  //> public methods //
  init(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("webgl2", {alpha: false});
    if (!this.context) {
      throw new SolError("unable to create webGL context");
    }
    
    glSetContext(this.context);
    GL.viewport(0, 0, this.canvas.width, this.canvas.height);
    this._createDefaultShader();
    
    // flip texture source data to bring it in line
    // with framebuffer texture rendering (so texture
    // coordinates are consistent)
    
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    
    this.inputManager.register(this);
    
    if (screen.orientation) {
      screen.orientation.addEventListener("change", (e) => {
        this.eventQueue.push(new OrientationEvent(), 0);
      }, true);
    }
    
    // add event listeners that dispatch a fullscreen event
    // when an attempt to alter the fullscreen state has
    // been made
    
    document.addEventListener("fullscreenchange", (e) => {
      this.eventQueue.push(new FullscreenEvent(true,
        (this.isFullscreen === true) ? FullscreenEvent.Status.ENTER :
        FullscreenEvent.Status.EXIT), 0);
    }, true);
    
    document.addEventListener("fullscreenerror", (e) => {
      this.eventQueue.push(new FullscreenEvent(false,
        (this.isFullscreen === true) ? FullscreenEvent.Status.ENTER :
        FullscreenEvent.Status.EXIT), 0);
    }, true);
    
    // 
    
    this.emitMessage("SOL_INITIALISED");
    this.updateCanvas();
    this.frameTimer.reset();
  }
  
  initAudio() {
    // needs to be called seperately from other init
    // upon a user input (transient user activation)

    acSetContext(new AudioContext());
  }

  delete() {
    GLStates.defaultShader.delete();
    this.sceneManager.delete();
  }
  
  run() {
    // canvas size management and event handling should
    // always be run regardless of pause state
    
    let updateCanvas = this.updateCanvas();
    if (updateCanvas[0]) {
      let sizeEvent = new SizeEvent(
        new Vec2(this.canvas.width, this.canvas.height),
        new Vec2(  updateCanvas[1],    updateCanvas[2])
      );
      
      this.canvas.width  = updateCanvas[1];
      this.canvas.height = updateCanvas[2];
      
      this.eventQueue.push(sizeEvent, 0);
    }
    
    this._processEvents();
    
    // how a frame is processed depends on whether the app
    // is currently paused or not
    
    if (this._isPaused === false) {
      this._runActive();
    } else {
      this._runPaused();
    }
    
    // always restart the main "run" loop by requesting
    // another frame regardless of pause status
    
    requestAnimationFrame(() => { this.run(); });
  }

  render(pass) {
    if (this.sceneManager.current !== null) {
      this.sceneManager.current.render(pass);
    }

    GL.flush();
  }

  input() {
    if (this.sceneManager.current !== null) {
      this.sceneManager.current.input();
    }
  }

  process(dt) {
    if (this.sceneManager.current !== null) {
      this.sceneManager.current.process(dt);
    }
  }

  postProcess(dt, count) {
    if (this.sceneManager.current !== null) {
      this.sceneManager.current.postProcess(dt, count);
    }
  }

  updateCanvas() {
    let element = this.canvas;
    let offset = new Vec2(0.0, 0.0);
    if (element.offsetParent) {
      do {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
      } while (element = element.offsetParent);
      
      this.canvasPos.x = offset.x; this.canvasPos.y = offset.y;
    }

    if (this.fillParent && this.canvas.parentNode) {
      let rect = this.canvas.parentNode.getBoundingClientRect();
      let width = Math.trunc(rect.width);
      let height = Math.trunc(rect.height);

      if (width != this.canvas.width || height != this.canvas.height) {
        return [true, width, height];
      }
    }

    return [false];
  }

  requestFullscreen(options = {}) {
    // if app is not in fullscreen state then attempt
    // to enter it - must be in response to user input
    // (transient user activation)

    canvas.requestFullscreen(options)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  exitFullscreen() {
    // if app is currently in fuillscreen state then
    // attempt to leave it

    if (this.isFullscreen === true) {
      document.exitFullscreen()
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }

  toggleFullscreen(options = {}) {
    // helper function to more easily toggle
    // between fullscreen states

    if (this.isFullscreen === false) {
      this.requestFullscreen(options);
    } else {
      this.exitFullscreen();
    }
  }
  
  
  emitMessage(command, data = null) {
    if (window.solBridge !== undefined) {
      window.solBridge.app = this;
      window.solBridge.push({ command, data })
    }
  }
  
  //> internal methods //
  _processEvents() {
    // logic to handle event processing, dealing with priorities,
    // pausing and the deferred queue
    
    while (!this.eventQueue.isEmpty()) {
      const { event, priority } = this.eventQueue.peek();
      
      // if the app is paused then either push the event onto
      // the deferred queue or jsut ignore it completely
      // and move to the next event
      
      if (this._isPaused === true && priority === 1) {
        const event = this.eventQueue.shift();
        this.eventQueueDeferred.push(event);
        
        continue;
      } else if (this._isPaused === true && priority === 2) {
        this.eventQueue.shift();
        
        continue;
      }
      
      // if the app is NOT paused or the event is a priority 0
      // (important -- processed even during pauses) then
      // continue processing
      
      this._handleEvents(event);

      if (this.sceneManager.current !== null) {
        this.sceneManager.current.handleEventQueue(event);
      }
      
      this.eventQueue.shift();
    }
    
    if (this._isPaused === false) {
      // when the app is NOT paused we want to process any events
      // that were deferred during a pause (i.e., priority 1)
      
      while (!this.eventQueueDeferred.isEmpty()) {
        const { event } = this.eventQueueDeferred.peek();
        
        this._handleEvents(event);

        if (this.sceneManager.current !== null) {
          this.sceneManager.current.handleEventQueue(event);
        }
        
        this.eventQueueDeferred.shift();
      }
    }
  }
  
  _handleEvents(event) {
    switch(event.getType()) {
      case enums.Event.EXTERNAL : {
        this._handleExternal(event.command, event.data);
        break;
      } default : {
        break;
      }
    }
  }
  
  _handleExternal(command, data) {
    switch(command) {
      case "SOL_PAUSEAPP" : {
        if (this._isPaused === false) {
          this.frameTimer.pause();
        } else {
          this.frameTimer.resume();
        }
        
        this._isPaused = !this._isPaused;
        this.emitMessage("SOL_PAUSESTATUS", { state: this._isPaused });
        break;
      } default : {
        break;
      }
    }
  }
  
  _runActive() {
    // an active frame (i.e., when the app is NOT paused) performs
    // a full logic loop
    
    for (let i = 0; i < this.renderPasses; ++i) {
			this.render(i);
		}
    
    this.input();
    this.inputManager.process();
    
    let frameTime = this.frameTimer.getElapsed() / 1000;
    this.frameTimer.reset();
    
    if (frameTime > this.frameLimit) {
      let framesProcessed = 0;
      let frameAccum = frameTime;
      
      while (frameAccum >= this.frameLimit) {
        this.process(this.frameLimit);
        ++framesProcessed;
        frameAccum -= this.frameLimit;
        
        const stopProcessing = (this.frameSkip ||
          (framesProcessed >= this.frameMax && this.frameMax > 0)) ||
          (this.sceneManager.next !== null)
        
        if (stopProcessing === true) {
          break;
        }
      }
      
      this.postProcess(frameTime, framesProcessed);
    } else {
      this.process(frameTime);
      this.postProcess(frameTime, 1);
    }
    
    if (this.sceneManager.change()) {
      this.frameTimer.reset();
    }
  }
  
  _runPaused() {
    // [!] decide if we want to render when paused
    // [!] we definitely need to render in response to
    // certain events (such as a resize)
    // [!] perhaps that is best decided in the current
    // scene's handleEventQueue function
    // [!] scene can choose to explicitly re-render
    
    for (let i = 0; i < this.renderPasses; ++i) {
			this.render(i);
		}
  }
  
  _createDefaultShader() {
    let shader = GLStates.defaultShader;

    shader.vertSrc =
      `#version 300 es
      
      uniform mat4 vertView;
      uniform mat4 vertProj;

      layout(location = 0) in vec3 vertXYZ;
      layout(location = 1) in vec4 vertRGBA;
      layout(location = 2) in vec2 vertST;
      layout(location = 3) in vec4 vertFlags;
      layout(location = 4) in vec4 vertNormal;

      out mediump vec4 fragRGBA;
      out mediump vec3 fragSTL;
      out mediump float fragTextured;
      out mediump float fragLighting;
      out mediump vec3 fragNormal;

      void main() {
        mat4 vp = vertProj * vertView;
        gl_Position = vp * vec4(vertXYZ, 1.0);
        
        fragRGBA = vertRGBA;
        fragSTL = vec3(vertST, vertFlags.y);

        fragTextured = vertFlags.x;
        fragLighting = vertFlags.z;

        fragNormal = vertNormal.xyz;
      }`;
    
    shader.fragSrc =
      `#version 300 es
      
      precision mediump float;

      uniform mediump sampler2DArray fragBaseTex;

      in mediump vec4 fragRGBA;
      in mediump vec3 fragSTL;
      in mediump float fragTextured;
      in mediump float fragLighting;
      in mediump vec3 fragNormal;

      layout(location = 0) out mediump vec4 fragColor;

      void main() {
        vec4 texColor = clamp(texture(fragBaseTex, fragSTL) +
          (1.0 - fragTextured), 0.0, 1.0);
        fragColor = texColor * vec4(fragRGBA.r, fragRGBA.g,
          fragRGBA.b, fragRGBA.a);
        
        if (fragColor.a < 0.01)
          discard;

        float light = max(1.0 - fragLighting,
          dot(fragNormal, vec3(0.0, 0.0, 1.0)));
        fragColor.rgb *= max(0.1, light);
      }`;

    shader.uniformLocations = {
      projectionMatrix : null,
      viewMatrix       : null,
      texture          : null,
    };

    shader.attributeLocations = {
      vertexPosition : -1, // (3 4-byte)
      vertexColor    : -1, // (4 1-byte)
      vertexTexture  : -1, // (2 4-byte)
      vertexFlags    : -1, // (4 1-byte)
      vertexNormal   : -1, // (1 4-byte)
    };

    shader.renderCallback = function() {
      let byteSize = VBOVertex.byteSize;
      let offset = 0;

      if (this.attributeLocations.vertexPosition !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexPosition);
        GL.vertexAttribPointer(this.attributeLocations.vertexPosition,
            3, GL.FLOAT, false, byteSize, offset);
      }
      
      offset += 12;
      if (this.attributeLocations.vertexColor !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexColor);
        GL.vertexAttribPointer(this.attributeLocations.vertexColor,
            4, GL.UNSIGNED_BYTE, true, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexTexture !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexTexture);
        GL.vertexAttribPointer(this.attributeLocations.vertexTexture,
            2, GL.FLOAT, false, byteSize, offset);
      }
      
      offset += 8;
      if (this.attributeLocations.vertexFlags !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexFlags);
        GL.vertexAttribPointer(this.attributeLocations.vertexFlags,
            4, GL.UNSIGNED_BYTE, false, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexNormal !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexNormal);
        GL.vertexAttribPointer(this.attributeLocations.vertexNormal,
            4, GL.UNSIGNED_INT_2_10_10_10_REV, true, byteSize, offset);
      }
      
      offset += 4;

      GL.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false,
        Float32Array.from(GLStates.projectionMatrix.arr));
      GL.uniformMatrix4fv(this.uniformLocations.viewMatrix, false,
        Float32Array.from(GLStates.viewMatrix.arr));
    }

    shader.compileAndLink();
    shader.useProgram();

    shader.uniformLocations.projectionMatrix =
      GL.getUniformLocation(shader.program, "vertProj");
    shader.uniformLocations.viewMatrix =
      GL.getUniformLocation(shader.program, "vertView");

    shader.uniformLocations.texture =
      GL.getUniformLocation(shader.program, "fragBaseTex");
    GL.uniform1i(shader.textureLocation, 0);
    
    shader.attributeLocations.vertexPosition =
      GL.getAttribLocation(shader.program, "vertXYZ");
    shader.attributeLocations.vertexColor =
      GL.getAttribLocation(shader.program, "vertRGBA");
    shader.attributeLocations.vertexTexture =
      GL.getAttribLocation(shader.program, "vertST");
    shader.attributeLocations.vertexFlags =
      GL.getAttribLocation(shader.program, "vertFlags");
    shader.attributeLocations.vertexNormal =
      GL.getAttribLocation(shader.program, "vertNormal");
  }
  
  //> static methods //
  static initComms() {
    // 
    
    if (window.solBridge?.initialised === true) {
      // if the messaging bridge has already been set up then
      // nothing needs done
      
      return;
    }
    
    const hostWindow = window.opener ||
      (window.parent !== window ? window.parent : null)
    
    if (hostWindow !== null) {
      // if we have a host window then our app is running
      // in an iframe or a child window/tab
      
      try {
        const parentBridge = hostWindow.solBridge || (hostWindow.solBridge = {});
        App._bindDirectBridge(parentBridge);
      } catch (error) {
        // probably cross-origin
      }
    }
    
    // [!] handle cross-origin here if required --
    // [!] via MessageChannel & MessagePort --
    // [!] and return
    
    const localBridge = window.solBridge || (window.solBridge = {});
    App._bindDirectBridge(localBridge);
  }
  
  static _bindDirectBridge(targetBridge) {
    // 
    
    const existingCallback = targetBridge.onMessage || null;
    
    targetBridge.initialised = true;
    targetBridge._app = null;
    targetBridge._callback = null;
    targetBridge._backlogHost = [];
    targetBridge._backlogApp = [];
    
    targetBridge.send = function (command, data = null) {
      if (this._app === null) {
        this._backlogApp.push({ command, data });
      } else {
        this._app.eventQueue.push(new ExternalEvent(command, data), 0);
      }
    };
    
    targetBridge.push = function (command, data = null) {
      if (typeof this._callback === 'function') {
        this._callback(command, data);
      } else {
        this._backlogHost.push({ command, data });
      }
    };
    
    Object.defineProperty(targetBridge, "onMessage", {
      configurable: true,
      enumerable: true,
      
      set(callback) {
        this._callback = callback;
        
        while (this._backlogHost.length > 0) {
          const { command, data } = this._backlogHost.shift();
          this._callback(command, data);
        }
      },

      get() {
        return this._callback;
      },
    });
    
    Object.defineProperty(targetBridge, "app", {
      configurable: true,
      enumerable: true,
      
      set(app) {
        this._app = app;
        
        while (this._backlogApp.length > 0) {
          const { command, data } = this._backlogApp.shift();
          this._app.eventQueue.push(new ExternalEvent(command, data), 0);
        }
      },

      get() {
        return this._app;
      },
    });
    
    // 
    
    window.solBridge = targetBridge;
    
    if (existingCallback) {
      targetBridge.onMessage = existingCallback;
    }
  }
};

export default App;
