import Sol from './sol.js';

import Scene from './scene.js';

class SceneManager {
  // manages the loading, saving and changing of scenes

  //> internal properties //
  _store = new Map();

  _current = null;
	_next = null;

  _loaded = false;
  _saved = false;

  //> constructor //
	constructor() {
		
	}

  //> getters/setters //
  get current() { return this._current; }
  get next() { return this._next; }

  //> public methods //
  copy(other) {
    throw new Error("SceneManager (copy): can't perform a deep " +
    "copy of a SceneManager (you can but it requires extra work)");
  }

  getCopy() {
    throw new Error("SceneManager (getCopy): can't perform a deep " +
    "copy of a SceneManager (you can but it requires extra work)");
  }

  equals(other) {
    throw new Error("SceneManager (equals): can't compare " +
    "SceneManager objects (you can but it requires extra work)");
  }

  delete() {
    if (this._current !== null) {
      this._current.delete();
      this._current = null;
    }
    
    if (this._next !== null) {
      this._next.delete();
      this._next = null;
    }
    
    for (let [n, s] of this._store) {
			s.delete();
		}

    this._store = new Map();
  }
  
	requestChange(sceneType, name, save = false) {
    // retrieve the scene with a matching 'name' from
    // the store if possible, otherwise create a new
    // scene of type 'sceneType' with name 'name'

    Sol.CheckPrototypes(this, "requestChange",
      [sceneType, [Scene]]);
    
    let newScene = this._store.get(name);
    if (newScene !== undefined) {
      this._loaded = true;
      this._store.delete(name);
    } else {
      newScene = new sceneType(name);
      this._loaded = false;
    }

    // queue up the scene change and signal if the
    // current scene is to be stored

    this._next = newScene;
    this._saved = save;
	}
  
	change() {
    // perform a previously queued scene change

		if (this._next !== null) {
      if (this._current !== null) {
        // if a current scene exists then call its 'onLeave'
        // method before storing it if requested, otherwise
        // destroying it

        this._current.onLeave(this._saved);

        if (this._saved) {
          this._store.set(this._current.name, this._current);
        } else {
          this._current.delete();
        }
      }

      // update the current scene to the queued scene
      // and call its 'onEnter' method

      this._current = this._next;
      this._next = null;

      this._current.onEnter(this._loaded);

      this._loaded = false;
      this._saved = false;

      return true;
		}

    return false;
	}
};

export default SceneManager;
