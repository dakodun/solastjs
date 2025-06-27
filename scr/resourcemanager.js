import ResourceStore from './resourcestore.js';

class ResourceManager {
	constructor() {
    this.stores = new Map();
	}

  addStore(name) {
    this.stores.set(name, new ResourceStore());
    return this.getStore(name);
  }

  removeStore(name) {
    return this.stores.delete(name);
  }

  getStore(name) {
    return this.stores.get(name);
  }
};

export default ResourceManager;
