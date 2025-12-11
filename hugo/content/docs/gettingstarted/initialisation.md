+++
title = "Initialisation and Entry Point "
date = 2025-11-15
summary = """Initialising SolastJS and creating an entry point into our app."""

type = 'docs'
weight = 2
+++

# Initialisation and Entry Point

To help us out and make things easier to work with we'll create an
initialisation .js file (init.js) which will collect all of the engine
files in one place and wrap them in a namespace (in this case 'sol').
We also declare and initialise our main App instance ('APP') in this
file and then export everything together.

{{< codebox "javascript" >}}
import AC, {acSetContext} from './engine/ac.js';
import GL, {glSetContext} from './engine/gl.js'
import GLStates from './engine/glstates.js'
import * as sol from './engine/exports.js';

var APP = new sol.App();

export {AC, acSetContext, glSetContext, GL, GLStates, eng, APP as default};
{{< /codebox >}}
            
By doing it this way we can import and access our App instance
in any of our project files (also true of the WebGL Context 'GL'). Next
we need to create the entry point for our app which will be run when the
page loads.
            
{{< codebox "javascript" >}}
import APP from './init.js';
import InitialScene from './initialscene.js';

function main() {
  try {
    // initialise the app instance, passing in
    // the canvas id (from index.html), and then
    // request a change to our initial scene;
    // perform the scene change immediately and
    // finally enter the main loop of our app

    APP.init("canvas");
    APP.sceneManager.requestChange(InitialScene, "init");
    APP.sceneManager.change();
    APP.run();
  } catch (e) {
    console.error(e.message);
  }
}

window.onload = function() {
  // run our entry function immediately when
  // the page loads

  main();
}
{{< /codebox >}}

We import our APP instance that we defined during initialisation, as
well as our InitialScene class which we'll look at in detail later.
Next, we declare a function (called 'main()' here, but the name is
irrelevant) and initialise our app. This is where we pass in the id of
our canvas element ('canvas'). Next we request and immediately change
to an instance of our InitialScene (more on Scenes later). Finally,
we enter the main loop of our App which runs until it is terminated
(usually by the page closing).

The entry function can be called whenever and however you like but
in this case we call it as soon as the page loads.
