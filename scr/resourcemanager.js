import ResourceStore from './resourcestore.js';

class ResourceManager {
	constructor() {
    this.stores = new Map();

    this.addStore("image");
    this.addStore("texture");
	}

  addStore(name) {
    let s = this.stores.set(name, new ResourceStore());
    return this.getStore(name);
  }

  removeStore(name) {
    if (name != "image" && name != "texture") {
      return this.stores.delete(name);
    }
    else {
      return false
    }
  }

  getStore(name) {
    return this.stores.get(name);
  }

  getImageStore() {
    return this.stores.get("image");
  }

  getTextureStore() {
    return this.stores.get("texture");
  }
};

export default ResourceManager;
