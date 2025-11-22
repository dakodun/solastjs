+++
title = "An Example Scene "
date = 2025-11-15
summary = """Building a basic initial scene for our app."""

type = 'docs'
weight = 3
+++

# An Example Scene

Our App requires a Scene to properly function. There is nothing
special about this initial Scene but you could use it to load
resources and initialise objects for use in later scenes.
We'll look at what a Scene is and how to use them in more detail later.

{{< codebox "javascript" >}}
import APP, {eng, GLStates, GL} from './init.js';

class InitialScene extends sol.Scene {
  // our scene inherits from the base scene class
  // and our constructor takes a name (string)
  // and forwards it to the base class constructor

  constructor(name) {
    super(name);
  }

  delete() {

  }

  render(pass) {
    GL.viewport(0, 0, APP.canvas.width, APP.canvas.height);
    
    switch (pass) {
      case 0 : {
        // for the first pass:
        // clear the screen to black and the depth buffer
        // reset the context
        // reset the matrices

        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        GL.clearDepth(1.0);
        GL.enable(GL.DEPTH_TEST);
        GL.depthFunc(GL.LEQUAL);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0.0, w, 0.0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();

        break;
      } default : {
        break;
      }
    }
  }

  input() {

  }

  process(dt) {

  }

  postProcess(dt, count) {

  }

  handleEventQueue(e) {

  }

  onEnter(loaded) {

  }

  onLeave(saved) {

  }
};

export default InitialScene;
{{< /codebox >}}

We import the engine files and our APP instance from our
initialisation file, and then create our InitialScene class which
inherits from the base Scene class (sol.Scene). This allows our
Scene to work with the SceneManager which handles loading, saving
and switching of Scenes as well as allowing them to interact with
each other.

Most of the class is empty with two exceptions: our constructor
calls the parent class' constructor, passing in the name string.
We've also defined a basic render function that merely clears the
context every frame and sets it up to be rendered to later.
