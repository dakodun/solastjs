import Scene from './scene.js'

class SceneManager {
	constructor() {
		this.store = new Array();
		
		this.current = null;
		this.next = null;
	}
  
  // queue up a scene change to a scene of type 'scene'
  //   optionally indicate the current scene should be stored on change
  //   optionally supply the name of a previously stored scene
	requestChange(scene, save, name) {
    let newScene = scene;

    if (name) {
      for (let i = 0; i < this.store.length; ++i) {
        if (this.store[i].name == name) {
          newScene = this.store[i];
          this.store.splice(i, i + 1);
          break;
        }
      }
    }

    this.next = newScene;
    
    if (this.current) {
      this.current.saved = save;
    }
	}
  
  // perform a previously queued scene change
	change() {
		if (this.next) {
      if (this.current && this.current.saved) {
        this.store.push(this.current);
      }

      this.current = this.next;
      this.next = null;

      if (this.current.saved) {
        this.current.saved = false;
      }

      return true;
		}

    return false;
	}
	
	currentExists() {
		return (this.current != null);
  }
  
  getCurrent() {
		return this.current;
	}
	
	nextExists() {
		return (this.next != null);
	}
	
	getNext() {
		return this.next;
	}
};

export default SceneManager;
