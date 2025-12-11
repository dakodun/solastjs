class Scene {
  // an empty scene class to act as a base for
  // derived objects, to be used mainly by a
  // SceneManager

  //> public properties //
  name = "";

  //> constructor //
	constructor(name) {
		this.name = name;
	}

  //> public methods //
  delete() {

  }

  render(pass) {
		
	}
	
	input() {
		
	}
	
	process(dt) {
		
	}
	
	postProcess(dt, count) {
		
	}

  handleEventQueue(e) {
    
  }

  onEnter(loaded) {
    
  }

  onLeave(saved) {

  }
};

export default Scene;
