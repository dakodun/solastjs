import APP, {sol, GL} from './init.js';

import UIButton from './uibutton.js';
import UIOverlay from './uioverlay.js';

class UI {
  // private fields
    #renderDebug = false;

    // for switching between ortho and perspective projections
    #ortho = true;

    #overlay = new UIOverlay();
    #projButton  = { ele: undefined, but: undefined, };
    #debugButton = { ele: undefined, but: undefined, };

    #layout = {
      base      : undefined,
      buttonBar : undefined,
      base3x3   : undefined,
    };

    #batch = new sol.RenderBatch();
  // ...

	constructor() {
    this.showOverlay = true;

    // button - switch projections...
    this.#projButton.but = new UIButton("projButton", 2)

    // element is slightly larger than shape to add
    // padding between buttons
    this.#projButton.ele = new sol.LayoutElement(60, 50),
    this.#projButton.ele.posCallback = () => {
      // origin aligns shape to the right of the element
      // because of padding
      this.#projButton.but.shape.origin =
        new sol.Vec2(-10, 0);

      this.#projButton.but.shape.position =
        this.#projButton.ele.position.getCopy();
    };
    // ...

    // button - enable/disable debugging...
    this.#debugButton.but = new UIButton("debugButton", 2)

    this.#debugButton.ele = new sol.LayoutElement(60, 50),
    this.#debugButton.ele.posCallback = () => {
      this.#debugButton.but.shape.origin =
        new sol.Vec2(-10, 0);

      this.#debugButton.but.shape.position =
        this.#debugButton.ele.position.getCopy();
    };
    // ...

    // ui layout...
    this.#layout.base = new sol.LayoutContainer(
      new sol.Vec2(8, 8),
      GL.canvas.clientWidth - 16,
      GL.canvas.clientHeight - 16
    );
    

    this.#layout.buttonBar = this.#layout.base.addContainer(
      new sol.LayoutContainer(new sol.Vec2(), 100, 50)
    );

    this.#layout.buttonBar.hsizing = sol.enums.Sizing.RELATIVE;
    this.#layout.buttonBar.halignElems = sol.enums.Align.RIGHT;
    

    this.#layout.base3x3 = this.#layout.base.addDivision(
      new sol.LayoutDivision(new sol.Vec2(3, 3))
    );

    { let cell = this.#layout.base3x3.getCell(new sol.Vec2(1, 1));
    cell.halignElems = sol.enums.Align.CENTER;
    cell.valignElems = sol.enums.Align.MIDDLE; }

    /* { let cell = this.#layout.base3x3.getCell(new sol.Vec2(2, 0));
    cell.halignElems =  sol.enums.Align.RIGHT;
    cell.valignElems = sol.enums.Align.MIDDLE; } */

    this.#updateLayout(new sol.Vec2(
      GL.canvas.clientWidth, GL.canvas.clientHeight
    ));
    // ...

    this.#batch = new sol.RenderBatch();
    this.#updateBatch();
	}

  // getters/setters
  get ortho() { return this.#ortho }
  // ...

  render(pass) {
    this.#batch.draw(pass);
  }

  input() {
    this.#projButton.but.input(this.touch);
    this.#debugButton.but.input(this.touch);
  }

  process(dt) {
    if (this.showOverlay) {
      this.#overlay.process(dt);
    }

    this.#projButton.but.process();
    if (this.#projButton.but.pressed) {
      this.#ortho = !this.#ortho;
      this.#projButton.but.cycleMode();
    }

    this.#debugButton.but.process();
    if (this.#debugButton.but.pressed) {
      this.#renderDebug = !this.#renderDebug;
      this.#debugButton.but.cycleMode();
    }
  }

  postProcess(dt, count) {
    this.#updateBatch();
  }

  handleEventQueue(event) {
    switch(event.getType()) {
      case sol.enums.Event.SIZE :
        this.#updateLayout(event.newDimensions);

        break;
      default :
    }
  }

  #updateBatch() {
    if (this.showOverlay) {
      this.#batch.add(this.#overlay.grabPrompt.shp, 1);
      this.#batch.add(this.#overlay.switchProjTxt.shp, 1);
    }

    this.#batch.add(this.#projButton.but.shape, 1);
    this.#batch.add(this.#debugButton.but.shape, 1);

    if (this.#renderDebug) {
      // list of colours to cycle through for each successive
      // layout component being rendered
      let col = 0;
      let colors = [
        new sol.Vec3(255,   0,   0),
        new sol.Vec3(255, 255,   0),
        new sol.Vec3(  0, 255,   0),
        new sol.Vec3(  0, 255, 255),
        new sol.Vec3(  0,   0, 255),
        new sol.Vec3(255,   0, 255),
      ];

      // render layout components (containers and divisions)
      let verts = this.#layout.base.getVertices();
      for (let v of verts) {
        let s = new sol.Shape();
        
        s.renderMode = GL.LINES;
        s.depth = -5;
        v.forEach((e) => { s.pushVert(e); });

        s.color = colors[col];
        col = ((col + 1) % colors.length);

        this.#batch.add(s, 1);
      }
      // ...

      { // render layout elements
      let elems = [
        this.#overlay.grabPrompt.ele,
        this.#overlay.switchProjTxt.ele,

        this.#projButton.ele,
        this.#debugButton.ele,
      ];

      for (const e of elems) {
        let s = new sol.Shape();
        s.pushVert(new sol.Vec2(    0.0,      0.0));
        s.pushVert(new sol.Vec2(e.width,      0.0));
        s.pushVert(new sol.Vec2(e.width, e.height));
        s.pushVert(new sol.Vec2(    0.0, e.height));

        s.depth = -3;
        s.color = new sol.Vec3(255, 0, 255);

        s.position = e.position.getCopy();
        s.renderMode = GL.LINE_LOOP;
        
        this.#batch.add(s, 1);
      }
      } // ...
    }

    this.#batch.upload();
  }

  #updateLayout(dimensions) {
    this.#layout.base.width  = Math.max(dimensions.x - 16, 0);
    this.#layout.base.height = Math.max(dimensions.y - 16, 0);
    this.#layout.base.resize();

    this.#layout.base3x3.getCell(new sol.Vec2(1, 1)).
      positionElements(new sol.List([this.#overlay.grabPrompt.ele]));
    
    /* this.#layout.base3x3.getCell(new sol.Vec2(2, 0)).
      positionElements(new sol.List([this.#overlay.switchProjTxt.ele])); */
    
    this.#layout.buttonBar.positionElements(
      new sol.List([this.#debugButton.ele, this.#projButton.ele,
        this.#overlay.switchProjTxt.ele])
    );
  }
};

export default UI;
