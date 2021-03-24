import Scene from './scene.js'

class SceneManager {
	constructor() {
		this.store = new Array();
		
		this.current = null;
		this.next = null;
	}

  delete() {
    if (this.current) {
      this.current.delete();
    }
    
    if (this.next) {
      this.next.delete();
    }
    
    for (let s of this.store) {
			s.delete();
		}
  }
  
  // queue up a scene change to a scene of type 'scene'
  //   optionally indicate the current scene should be stored on change
  //   optionally supply the name of a previously stored scene
	requestChange(scene, save, name) {
    let newScene = scene;

    if (name != undefined) {
      for (let i = 0; i < this.store.length; ++i) {
        if (this.store[i].name == name) {
          newScene = this.store[i];
          newScene.loaded = true;
          this.store.splice(i, i + 1);
          break;
        }
      }
    }

    this.next = newScene;
    
    if (this.current && save != undefined) {
      this.current.saved = save;
    }
	}
  
  // perform a previously queued scene change
	change() {
		if (this.next) {
      if (this.current) {
        this.current.onLeave(this.current.saved);

        if (this.current.saved) {
          this.store.push(this.current);
        }
        else {
          this.current.delete();
        }
      }

      this.current = this.next;
      this.next = null;

      this.current.onEnter(this.current.loaded);
      this.current.loaded = false;

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
