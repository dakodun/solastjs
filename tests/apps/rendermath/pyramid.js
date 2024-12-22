import APP, {sol, GLStates, GL} from './init.js';
import Magic from './magic.js';

class Pyramid {
  // private fields
    #vertBatch = new sol.VertexBatch();

    // limit the rotation on the x-axis
    #rotLim = new sol.Vec2(45.0 * Magic.PI180,
      -35.0 * Magic.PI180);

    // for pyramid jiggle animation
    #scaleLim = new sol.Vec3( 1.05,  1.08,  1.05);
    #scaleDir = new sol.Vec3(    1,     1,     1);
    #scaleSpd = new sol.Vec3(0.075, 0.100, 0.050);

    // mouse or touch based rotation on XY axes that
    // continues after release (for amount decay) depending
    // on speed of rotation
    #dragging = false;
    #rotation = new sol.Vec2();
    #rotationDecay = 10.0;

    // only interested in the first touch
    #touch = null;

    // frame delay for mouse/touch position change to allow smooth
    // rotation on release (based on average over previous frames)
    #diffDelay = 3;
    #diffDelayInv = 1 / this.#diffDelay;
    #diff = new Array(this.#diffDelay);
  // ...

	constructor() {
    // [array stream of vert.xyz vert.xyz vert.xyz color.xyz]
    let dataArr = [
      [ // front triangle
            0.0,    0.0,    0.0,
          100.0,  172.0, -100.0,
          200.0,    0.0,    0.0,
          200.0,    0.0,    0.0
      ],

      [ // right triangle
          200.0,    0.0,    0.0,
          100.0,  172.0, -100.0,
          200.0,    0.0, -200.0,
            0.0,  200.0,    0.0
      ],
      
      [ // back triangle
          200.0,    0.0, -200.0,
          100.0,  172.0, -100.0,
            0.0,    0.0, -200.0,
            0.0,    0.0,  200.0
      ],

      [ // left triangle
            0.0,    0.0, -200.0,
          100.0,  172.0, -100.0,
            0.0,    0.0,    0.0,
          200.0,  200.0,    0.0
      ],

      [ // base quad
            0.0,    0.0,    0.0,
          200.0,    0.0,    0.0,
          200.0,    0.0, -200.0,
            0.0,  200.0,  200.0
      ],[
            0.0,    0.0,    0.0,
          200.0,    0.0, -200.0,
            0.0,    0.0, -200.0,
            0.0,  200.0,  200.0
      ]
    ];
    
    // pass the vertices. colors and indices to the vertex batch
    // (can't share vertices due to differing normals)
    for (let i = 0; i < dataArr.length; ++i) {
      const f = dataArr[i];

      for (let j = 0; j < 3; ++j) {
        this.#vertBatch.verts.push(new sol.Vec3(
          f[(j * 3)], f[1 + (j * 3)], f[2 + (j * 3)]
        ));
      }

      for (let j = 0; j < 3; ++j) {
        this.#vertBatch.colors.push(new sol.Vec3(f[ 9], f[10], f[11]));
      }

      this.#vertBatch.indices.push(    (i * 3));
      this.#vertBatch.indices.push(2 + (i * 3));
      this.#vertBatch.indices.push(1 + (i * 3));
    }

    // calculate normals from vertex and index data -
    // better to precalculate and pass to vertex batch
    this.#vertBatch.calculateNormals();

    // position the centre of the pyramid to the centre of screen
    this.#vertBatch.depth = -300.0;
    this.#vertBatch.origin = new sol.Vec3(100.0, 57.5, -100.0);
    this.#vertBatch.position = new sol.Vec3(0.0,  0.0, -200.0);
    
    this.#vertBatch.lighting = true;

    this.#diff.fill(new sol.Vec2());

    this.mask = {
      shape: new sol.Shape(),
      matrix: new sol.Mat4()
    }
	}

  // getters/setters
  get vertBatch() { return this.#vertBatch; }
  get dragging()  { return this.#dragging;  }
  // ...

  input() {
    // shift all frame delayed movement by one and a new one to
    // the back (which will later be populated if necessary)
    this.#diff.shift();
    this.#diff.push(new sol.Vec2());


    // mouse controls
    if (APP.inputManager.getMousePressed(sol.enums.Mouse.LEFT)) {
      this.#updateMask();
      const mouse = APP.inputManager.getLocalMouse();

      if (this.mask.shape.isPointInside(mouse)) {
        this.#dragging = true;
      }
    }

    if (APP.inputManager.getMouseReleased(sol.enums.Mouse.LEFT)) {
      this.#dragging = false;

      let rotation = this.#rotationOnRelease();
      this.#rotation = rotation;
      this.#diff.fill(new sol.Vec2());
    }

    if (APP.inputManager.getMouseMoved()) {
      if (this.#dragging) {
        const diff = APP.inputManager.getLocalMouseChange();
        
        this.#diff[this.#diff.length - 1] = diff.getCopy();
        this.#rotation = diff.getCopy();
      }
    }
    // ...


    // touch controls
    if (this.#touch === null) { // if we don't have any touches...
      const newTouches = APP.inputManager.getNewTouches();
      if (newTouches.length > 0) {
        // the first touch is what we track
        this.#touch = newTouches[0];

        this.#updateMask();
        const finger = APP.inputManager.getLocalTouch(this.#touch);

        if (this.mask.shape.isPointInside(finger)) {
          this.#dragging = true;
        }
      }
    }

    if (APP.inputManager.getTouchEnd(this.#touch) ||
        APP.inputManager.getTouchCancel(this.#touch)) {

      this.#dragging = false;

    let rotation = this.#rotationOnRelease();
      this.#rotation = rotation;
      this.#diff.fill(new sol.Vec2());

      this.#touch = null;
    }

    if (APP.inputManager.getTouchMoved(this.#touch)) {
      if (this.#dragging) {
        const diff = APP.inputManager.getLocalTouchChange(this.#touch);

        this.#diff[this.#diffDelay - 1] = diff.getCopy();
        this.#rotation = diff.getCopy();
      }
    }
    // ...
  }
	
	process(dt) {
    // if the pyramid is rotating...
    if (this.#rotation.x != 0 || this.#rotation.y != 0) {
      let newRotation = new sol.Vec3();
      newRotation.x = this.#vertBatch.rotation.x -
          (this.#rotation.y * 40 * Magic.PI180) * dt;
      newRotation.y = this.#vertBatch.rotation.y -
          (this.#rotation.x * 40 * Magic.PI180) * dt;
      
      // limit the rotation on the x-axis
      if (newRotation.x > this.#rotLim.x) {
        newRotation.x = this.#rotLim.x;
      } else if (newRotation.x < this.#rotLim.y) {
        newRotation.x = this.#rotLim.y;
      }

      // normalise the rotation on the y-axis (0 > 2PI)
      if (newRotation.y > Magic.PI2) {
        newRotation.y -= Magic.PI2;
      } else if (newRotation.y < 0.0) {
        newRotation.y += Magic.PI2;
      }

      this.#vertBatch.rotation = newRotation;

      if (this.#dragging) {
        // if pyramid is being actively manipulated then
        // reset the rotation amounts (dead stop)
        this.#rotation.x = 0;
        this.#rotation.y = 0;
      } else {
        // otherwise pyramid is rotating freely so
        // slowly decay the current rotation so it slowly comes to rest
        this.#rotation.x -=
          (this.#rotation.x * this.#rotationDecay) * dt;
        this.#rotation.y -=
          (this.#rotation.y * this.#rotationDecay) * dt;

        if (Math.abs(this.#rotation.x) < 0.1) {
          this.#rotation.x = 0;
        }

        if (Math.abs(this.#rotation.y) < 0.1) {
          this.#rotation.y = 0;
        }
      }
    }

    { // jiggly pyramid...
      const s = this.#vertBatch.scale.getCopy();

      if ((s.x > this.#scaleLim.x && this.#scaleDir.x == 1) || 
          (s.x < 1.0 && this.#scaleDir.x == -1)) {
        this.#scaleDir.x = -this.#scaleDir.x;
      }

      if ((s.y > this.#scaleLim.y && this.#scaleDir.y == 1) || 
          (s.y < 1.0 && this.#scaleDir.y == -1)) {
        this.#scaleDir.y = -this.#scaleDir.y;
      }

      if ((s.z > this.#scaleLim.z && this.#scaleDir.z == 1) || 
          (s.z < 1.0 && this.#scaleDir.z == -1)) {
        this.#scaleDir.z = -this.#scaleDir.z;
      }

      let ns = new sol.Vec3(
        s.x + (this.#scaleSpd.x * dt * this.#scaleDir.x),
        s.y + (this.#scaleSpd.y * dt * this.#scaleDir.y),
        s.z + (this.#scaleSpd.z * dt * this.#scaleDir.z)
      );

      this.#vertBatch.scale = ns;
    } // ...
	}

  postProcess(dt, count) {
    this.#updateMask();
  }

  // calculate the rotation on mouse/touch release based
  // on the average over the previous frames rotation amounts
  #rotationOnRelease() {
    let result = new sol.Vec2();

    this.#diff.forEach((element) => {
      result.x += element.x;
      result.y += element.y;
    });

    result.x *= this.#diffDelayInv;
    result.y *= this.#diffDelayInv;

    return result;
  }

  #updateMask() {
    this.mask.shape = new sol.Shape();
    this.mask.shape.renderMode = sol.enums.Rendering.LINE_LOOP;
    this.mask.shape.lineWidth = 4;

    let vb = this.#vertBatch;
    let verts = [];

    for (const vert of vb.verts) {
      let trans = vb.transformable.asMat4();
      let pVert = trans.getMultVec4(
        new sol.Vec4(vert.x, vert.y, vert.z, 1.0)
      );

      const p = this.mask.matrix;
      pVert = p.getMultVec4(
        new sol.Vec4(pVert.x, pVert.y, pVert.z, 1.0)
      );

      // transform into ndc space using a perspective divide - necessary
      // when using a perspective projection (an orthographic projection
      // always has a w of 1)
      let invw = 1 / pVert.w;
      pVert.x *= invw;
      pVert.y *= invw;

      // viewport transform:
      // (v.x * w/2) + (left + w/2), (v.y * h/2) + (bottom + h/2)
      let w =  GL.canvas.clientWidth * 0.5;
      let h = GL.canvas.clientHeight * 0.5;

      pVert.x = (pVert.x * w) + (0 + w);
      pVert.y = (pVert.y * h) + (0 + h);

      verts.push(new sol.Vec2(pVert.x, pVert.y));
    }

    let maskVerts = this.#findOutline(verts);
    this.mask.shape.pushVerts(maskVerts);
  }

  #findOutline(inVerts) {
    let verts = [];
    inVerts.forEach((ele) => {
      verts.push(ele.getCopy());
    });

    // insertion sort the vertices from top to bottom...
    for (let i = 1; i < verts.length; ++i) {
      let key = verts[i];
      let j = i - 1;

      while (j >= 0 && verts[j].y < key.y) {
        verts[j + 1] = verts[j];
        --j;
      }

      verts[j + 1] = key;
    }
    // ...

    // find the centre line (highest to lowest point) and then
    // construct two polygons: one left of the centre line and
    // one to the right ensuring the correct (ccw) winding...
    let sides = [new sol.Polygon(), new sol.Polygon()];

    // the highest and lowest points; this forms our centre line
    const top = verts[0];
    const bot = verts[verts.length - 1];

    for (let i = 1; i < verts.length - 1; ++i) {
      const cur = verts[i];

      // assume left side (0) unless found to be otherwise (1)
      let curSide = 0;
      if (!sol.Polygon.isLeft(top, bot, cur)) {
        curSide = 1;
      }
      
      let side = sides[curSide];
      let sVerts = side.verts;
      if (sVerts.length > 2) {
        if (!side.isPointInside(cur)) {
          let newSide = new sol.Polygon();

          if (curSide === 0) {
            // create a new side (initially a triangle) using the
            // centre line and the current vertex
            newSide.pushVerts([top, cur, bot]);
            
            for (let i = 1; i < sVerts.length - 1; ++i) {
              // for all points (other than highest and lowest)
              // in the current side check if it lies inside
              // the new side

              if (!newSide.isPointInside(sVerts[i])) {
                // if so then add it to the new side making sure
                // to preserve the winding
                
                newSide.verts.splice(
                  newSide.verts.length - 2, 0, sVerts[i]
                );
              }
            }
          } else {
            // same process as for the left side above, but care is
            // needed in both preserving the winding and the order
            // in which we traverse the points of the current side

            newSide.pushVerts([top, bot, cur]);
            
            for (let i = sVerts.length - 1; i > 1; --i) {
              if (!newSide.isPointInside(sVerts[i])) {
                newSide.verts.splice(3, 0, sVerts[i]);
              }
            }
          }

          sides[curSide] = newSide;
        }
      } else {
        // when this is the first point we can simply add it to
        // the current side but must take care to preserve the
        // winding

        if (curSide === 0) {
          sides[curSide].pushVerts([top, cur, bot]);
        } else {
          sides[curSide].pushVerts([top, bot, cur]);
        }
      }
    }

    // create the mask by stitching both sides together
    // and then return...
    let result = sides[0];

    // first 2 elements in right side are top and bottom which
    // already exist in result array
    result.pushVerts(sides[1].verts.slice(2));

    return result.verts;
    // ...
  }
};

export default Pyramid;
