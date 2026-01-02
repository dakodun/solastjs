class Script {
  static Scene = class Scene {
    static Line = class Line {
      speaker = "";
      text = "";
      actions = new Array();

      constructor(speakerIn, textIn) {
        this.speaker = (speakerIn !== undefined) ? speakerIn : "";
        this.text = (textIn !== undefined) ? textIn : "";
      }
    };

    _id = "";
    _idNext = "";

    _lines = new Array();
    _currLine = 0;

    getNextLine() {
      let result = {
        success: false,

        speaker: "",
        text: "",
        actions: new Array(),

        sceneDone: false,
        idNext: "",
      };

      if (this._lines.length > this._currLine) {
        const line = this._lines[this._currLine++];
        
        result.success = true;
        result.text = line.text;
        result.speaker = line.speaker;
        result.actions = line.actions.slice();

        if (this._currLine === this._lines.length) {
          result.sceneDone = true;
          result.idNext = (this._idNext === "") ?
            this._id : this._idNext;
          this._currLine = 0;
        }
      }

      return result;
    }
  };

  //

  _scenes = new Map();
  _currScene = "";
  _sceneActive = false;

  constructor() {

  }

  fromString(string) {
    let scenes = new Map();

    let scene = null;
    let line = null;

    let txtLines = string.split("\n");
    for (let txtLine of txtLines) {
      if (txtLine.substring(0, 1) === ":") {
        // a line beginning with a colon denotes firstly a
        // a new scene and then an optional following scene
        // in the form ":scene/scene"

        if (scene !== null) {
          if (line !== null) {
            scene._lines.push(line);
            line = null;
          }

          scenes.set(scene._id, scene);
        }

        scene = new Script.Scene();
        let sceneNames = txtLine.substring(1).split("/");

        scene._id = (sceneNames.length > 0) ? sceneNames[0] : "";
        scene._idNext = (sceneNames.length > 1) ? sceneNames[1] : "";
      } else if (txtLine.substring(0, 1) === ">") {
        // a line beginning with a greater than denotes firstly
        // a speaker and then a list of optional actions (which are
        // defined by the script object) in the form
        // ">speaker/[action][action]"

        if (scene !== null && line !== null) {
          scene._lines.push(line);
        }

        let spkrActs = txtLine.substring(1).split("/");
        let spkr = (spkrActs.length > 0) ? spkrActs[0] : "";
        let acts = (spkrActs.length > 1) ? spkrActs[1] : "";
        
        let actsArr = new Array();
        let currAct = "";

        for (let char of acts) {
          if (char === "[" ) {
            currAct = "";
          } else if (char === "]" ) {
            actsArr.push(currAct);
            currAct = "";
          } else {
            currAct += char;
          }
        }

        if (currAct !== "") {
          actsArr.push(currAct);
        }
        
        line = new Script.Scene.Line(spkr, "");
        line.actions = actsArr;
      } else if (txtLine !== "") {
        // anything else that isn't a blank line should be
        // treated as another line of dialogue in the current
        // scene for the current speaker

        line.text += txtLine;
      }
    }

    // handle any leftover lines and scenes and then update
    // the scene store

    if (scene !== null) {
      if (line !== null) {
        scene._lines.push(line);
        line = null;
      }

      scenes.set(scene._id, scene);
    }

    this._scenes = scenes;
  }

  getMessage() {
    // return an object containing the speaker and text
    // that form the next line in the current scene of
    // the script

    let currScene = this._scenes.get(this._currScene);
    if (currScene !== undefined) {
      let line = currScene.getNextLine();
      
      if (line.success === true) {
        this._sceneActive = true;

        if (line.sceneDone === true) {
          // if current scene is done, move on to the next
          // scene as indicated by the current scene and
          // set scene as done

          this._currScene = line.idNext;
          this._sceneActive = false;
        }

        return {
          speaker: line.speaker,
          text: line.text,
          actions: line.actions,
        };
      }
    }

    return {
      speaker: "null",
      text: "I am error!",
      actions: new Array(),
    };
  }

  getCurrScene() {
    return this._scenes.get(this._currScene);
  }
}

export default Script;
