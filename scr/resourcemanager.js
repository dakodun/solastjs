import ResourceStore from './resourcestore.js';

class ResourceManager {
  static defaults = [
    "image",
    "texture",
    "soundBuffer",
    "font",
  ];

	constructor() {
    this.stores = new Map();

    for (let def of ResourceManager.defaults) {
      this.addStore(def);
    }
	}

  addStore(name) {
    let s = this.stores.set(name, new ResourceStore());
    return s;
  }

  removeStore(name) {
    if (!ResourceManager.defaults.find((e) => { return e === name; })) {
      return this.stores.delete(name);
    } else {
      return false;
    }
  }

  getStore(name) {
    return this.stores.get(name);
  }

  // default helpers...
  getImageStore() {
    return this.stores.get("image");
  }

  getTextureStore() {
    return this.stores.get("texture");
  }

  getSoundBufferStore() {
    return this.stores.get("soundBuffer");
  }

  getFontStore() {
    return this.stores.get("font");
  }
  // ...
};

export default ResourceManager;
