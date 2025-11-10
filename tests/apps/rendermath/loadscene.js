import APP, {sol, GLStates, GL} from './init.js';
import PyramidScene from './pyramidscene.js';
import Magic from './magic.js';

import AlgoScene from './algoscene.js';

class LoadScene extends sol.Scene {
  static images = [
    { id: "continuePrompt",
      src: "res/continuePrompt.png",
      width: 400, height: 80 },
    { id: "switchProj",
      src: "res/switchProj.png",
      width: 240, height: 100 },
    { id: "projButton",
      src: "res/projButton.png",
      width: 150, height: 100 },
    { id: "debugButton",
      src: "res/debugButton.png",
      width: 150, height: 100 },
  ];

	constructor(name) {
		super(name);

    this.loaded = false;
	}

  delete() {
    
  }

  render(pass) {
    
	}
	
	input() {
    if (this.loaded) {
      // APP.sceneManager.requestChange(new AlgoScene("algo"));
      APP.sceneManager.requestChange(new PyramidScene("thepyramid"));
    }
	}
	
	process(dt) {
    if (!APP.resourceLoader.isWorking() && !this.loaded) {
      this.loaded = true;
    }
	}
	
	postProcess(dt, count) {
		
	}

  handleEventQueue(e) {
    switch(e.type) {
      default :
    }
  }

  onEnter(loaded) {
    APP.renderPasses = 2;

    let texStore = APP.resourceManager.addStore("texture");
    
    let loader = APP.resourceLoader;

    for (const img of LoadScene.images) {
      loader.loadImage(img.src, img.width, img.height)
        .then((response) => {
          let tex = texStore.addResource(img.id, new sol.Texture());
          tex.create([response]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  onLeave(saved) {

  }
};

export default LoadScene;
