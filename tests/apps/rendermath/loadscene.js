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
      let imgStore = APP.resourceManager.getImageStore();
      let texStore = APP.resourceManager.getTextureStore();

      for (const img of LoadScene.images) {
        let tex = texStore.addResource(img.id, new sol.Texture());
        tex.createImage(imgStore.getResource(img.id));
        imgStore.removeResource(img.id);
      }

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

    let imgStore = APP.resourceManager.getImageStore();
    let loader = APP.resourceLoader;

    for (const img of LoadScene.images) {
      let res = loader.loadImage(img.src, img.width, img.height);
      imgStore.addResource(img.id, res);
    }
  }

  onLeave(saved) {

  }
};

export default LoadScene;
