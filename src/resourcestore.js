class ResourceStore {
	constructor() {
		this.store = new Map();
	}

  addResource(name, resource) {
    this.store.set(name, resource);
    return resource;
  }

  removeResource(name) {
    return this.store.delete(name);
  };

  getResource(name) {
    return this.store.get(name);
  }
};

export default ResourceStore;
