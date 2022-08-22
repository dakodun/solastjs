import EngineError from './error.js';
import Resource from './resource.js';

function resourceSort(first, second) {
	let result = 0;
	if (second.name < first.name) {
		result = 1;
	}
	else if (first.name < second.name) {
		result = -1;
	}
	
	return result;
};

class ResourceStore {
	constructor() {
		this.store = new Array();
	}

  addResource(resource, name) {
    for (let res of this.store) {
      if (res.name == name) {
        throw new EngineError("ee: resource with name '" + name + 
            "' already exists");
      }
    }
    
    this.store.push(new Resource(resource, name));
    this.store.sort(resourceSort);
    
    return this.getResource(name);
  }

  removeResource(name) {
    for (var i = 0; i < this.store.length; ++i) {
      if (this.store[i].name == name) {
        this.store.splice(i, i + 1);
      }
    }
    
    throw new EngineError("ee: resource with name '" + name + 
        "' not found");
  };

  getResource(name) {
    for (let res of this.store) {
      if (res.name == name) {
        return res;
      }
    }
    
    throw new EngineError("ee: resource with name '" + name + 
        "' not found");
  }

  resourceExists(name) {
    for (let res of this.store) {
      if (res.name == name) {
        return true;
      }
    }

    return false;
  }
};

export default ResourceStore;
