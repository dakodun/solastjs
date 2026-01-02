import APP, { sol, GL } from './init.js';

import Background from './background.js';
import EntityMegaBatman from './entitymegabatman.js';
import EntitySuperBatman from './entitysuperbatman.js';
import ModelBuilding from './modelbuilding.js';
import ConvoScene from './convoscene.js';
import UIButton from './uibutton.js';
import UIText from './uitext.js';

class LoadScene extends sol.Scene {
  static fonts = [
    { family: "jersey",
      src: "url(res/Jersey10-Regular.ttf)" },
  ];

	constructor(name) {
		super(name);

    this.resLoaded = false;
	}

  delete() {
    
  }

  render(pass) {
    
	}
	
	input() {
    if (this.resLoaded) {
      APP.sceneManager.requestChange(ConvoScene, "test");
    }
	}
	
	process(dt) {
    if (!APP.resourceLoader.isWorking() && !this.resLoaded) {
      this.resLoaded = true;
    }
	}
	
	postProcess(dt, count) {
		
	}

  handleEventQueue(e) {
    
  }

  onEnter(loaded) {
    APP.renderPasses = 2;
    
    let loader = APP.resourceLoader;

    // add a new method to the resource loader to
    // allow us to load scripts from text files
    
    loader.loadScript = async function(src) {
      let text = "";
      ++this.status;

      try {
        let response = await fetch(src);
        text = await response.text();
        --this.status;
      } catch(e) {
        --this.status;
      }

      return text;
    }

    // get the stores if they already exist (otherwise
    // create them first)

    let fntStore = APP.resourceManager.getStore("font");
    if (fntStore === undefined) {
      fntStore = APP.resourceManager.addStore("font");
    }

    let texStore = APP.resourceManager.getStore("texture");
    if (texStore === undefined) {
      texStore = APP.resourceManager.addStore("texture");
    }

    let scrStore = APP.resourceManager.getStore("script");
    if (scrStore === undefined) {
      scrStore = APP.resourceManager.addStore("script");
    }

    // load fonts
    
    for (const fnt of LoadScene.fonts) {
      loader.loadFontFace(fnt.src, fnt.family)
        .then((response) => {
          let afnt = new sol.AtlasFont(128);
          afnt.generateGlyphs(response.family, 40,
            ["AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.,?! -;()'"]);
          fntStore.addResource(fnt.family, afnt);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // call static load methods to load resources required by
    // each class

    Background.loadResources();
    EntitySuperBatman.loadResources();
    EntityMegaBatman.loadResources();
    ModelBuilding.loadResources();
    UIText.loadResources();
    UIButton.loadResources();

    // load scripts

    loader.loadScript("res/batman_script.txt")
      .then((response) => {
        scrStore.addResource("scrSuperBatman", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onLeave(saved) {
    
  }
};

export default LoadScene;
