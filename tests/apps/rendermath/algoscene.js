import APP, {sol, GLStates, GL} from './init.js';

class AlgoScene extends sol.Scene {
  // private fields...
    #algogo = false;
    #timer = new sol.Timer();

    // time (in ms) for stepping through the algorithm
    #algopause = 600;
    #algostep  = 100;
    #algospeed = this.#algostep;
  // ...

	constructor(name) {
		super(name);

    this.vertices = [];

    this.batch = new sol.RenderBatch();

    this.sweepLine = new sol.Shape(); {
      let w =  GL.canvas.clientWidth;
      let h = GL.canvas.clientHeight;

      this.sweepLine.pushVerts([
        new sol.Vec2(0, 0),
        new sol.Vec2(w, 0),
      ]);

      this.sweepLine.renderMode = GL.LINES;
      this.sweepLine.position = new sol.Vec2(0, h + 1);
    }

    this.centerLine = new sol.Shape(); {
      this.centerLine.colors = [
        new sol.Vec3(220,  60,  30),
        new sol.Vec3( 20, 140, 220),
      ];

      this.centerLine.renderMode = GL.LINES;
    }

    // the left and right polygons that combine to make our
    // final mask: left = 0, right = 1
    this.poly = [new sol.Shape(), new sol.Shape()];
    this.poly[0].renderMode = GL.LINE_LOOP;
    this.poly[1].renderMode = GL.LINE_LOOP;

    // track progress of algorithm for stepping through
    this.progress = {
      step  : 0,
      currv : 1,
      flipv : 0,
      pid   : 0,
      procv : 0,
    };

    // this.#generateVertices();

    this.mask = new sol.Shape();
    this.temp = [];
	}

  delete() {
    
  }

  render(pass) {
    GL.viewport(0, 0, APP.canvas.width, APP.canvas.height);
    
    switch (pass) {
      case 0 : {
        GL.clearColor(0.25, 0.26, 0.3, 1.0);
        GL.clearDepth(1.0);
        GL.enable(GL.DEPTH_TEST);
        GL.depthFunc(GL.LEQUAL);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0, w, 0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();
        
        this.batch.draw();

        break;
      }
      default : {
        let w =  GL.canvas.clientWidth;
        let h = GL.canvas.clientHeight;

        GLStates.projectionMatrix.ortho(0.0, w, 0.0, h, 1.0, 1000.0);
        GLStates.viewMatrix.identity();

        break;
      }
    }
	}
	
	input() {
    if (APP.inputManager.getKeyPressed(sol.enums.Key.SPACE)) {
      /* this.#algogo = !this.#algogo;
      this.#timer.reset(); */

      this.vertices = [];
      let verts = [];
      this.#generateVertices();

      for (let vert of this.vertices) {
        verts.push(vert.v.x, vert.v.y);
      }
      
      this.mask = new sol.Shape();
      this.mask.renderMode = GL.LINE_LOOP;
      this.temp = [];

      let r = this.#soless(verts);
      // verts = [];

      for (let i = 0; i < r.length; i += 2) {
        // verts.push(new sol.Vec2(r[i], r[i + 1]));
        this.mask.pushVert(new sol.Vec2(r[i], r[i + 1]));
      }

      let rect = this.mask.f(4);
      for (let r of rect) {
        let s = new sol.Shape([
          r[0], r[1], r[2], r[3]
        ]);

        // let s = new sol.Shape([
        //   r[0], r[1],
        //   r[1], r[2],
        //   r[2], r[3],
        //   r[3], r[0]
        // ]);

        // s.colors = [
        //   new sol.Vec3(255, 0, 0), new sol.Vec3(255, 0, 0),
        //   new sol.Vec3(0, 255, 0), new sol.Vec3(0, 255, 0),
        //   new sol.Vec3(0, 0, 255), new sol.Vec3(0, 0, 255),
        //   new sol.Vec3(255, 255, 0), new sol.Vec3(255, 255, 0)
        // ]

        // s.renderMode = GL.LINES;
        this.temp.push(s);
      }

      this.#updateBatch();
    }
	}
	
	process(dt) {
    if (this.#algogo && this.#timer.getElapsed() >= this.#algospeed) {
      this.#findOutlineStep(this.progress.step);
      this.#timer.reset();
    }
	}
	
	postProcess(dt, count) {
    
	}

  handleEventQueue(event) {
    
  }

  onEnter(loaded) {
    
  }

  onLeave(saved) {

  }

  #generateVertices(size = 4, amount = undefined) {
    let w =  GL.canvas.clientWidth;
    let h = GL.canvas.clientHeight;

    { // vertices
      let amt = 0;
      if (amount === undefined) {
        const amtNums = new Uint32Array(1);
        self.crypto.getRandomValues(amtNums);
        amt = (amtNums[0] % 30) + 7;
      } else {
        amt = amount;
      }

      let count = Math.max(3, amt) * 2;
      const randNums = new Uint32Array(count);
      self.crypto.getRandomValues(randNums);

      for (let i = 0; i < randNums.length; i += 2) {
        this.vertices.push({
          v : new sol.Vec2((randNums[    i] % (w - 20)) + 10,
              (randNums[i + 1] % (h - 40)) + 20),
          s : new sol.Shape()
        });
      }
    }

    { // shapes
      for (let vert of this.vertices) {
        let shp = new sol.Shape();

        shp.pushVerts([
          new sol.Vec2(       vert.v.x, vert.v.y + size),
          new sol.Vec2(vert.v.x - size,        vert.v.y),
          new sol.Vec2(       vert.v.x, vert.v.y - size),
          new sol.Vec2(vert.v.x + size,        vert.v.y)
        ]);

        vert.s = shp;
      }
    }

    this.#updateBatch();
  }

  #findOutlineStep(step) {
    // sort vertices by height

    switch(step) {
      case 0 : {
        console.log(`step: ${this.progress.step}`);
        console.log(`  sort vertices from top to bottom`);

        // insertion sort by y - descending
        for (let i = 1; i < this.vertices.length; ++i) {
          let key = this.vertices[i];
          let j = i - 1;

          while (j >= 0 && this.vertices[j].v.y < key.v.y) {
            this.vertices[j + 1] = this.vertices[j];

            --j;
          }

          this.vertices[j + 1] = key;
        }

        ++this.progress.step;

        break;
      }
      case 1 : {
        console.log(`step: ${this.progress.step}`);
        console.log(`  identify the top-most vertex`);

        this.poly[0].pushVert(this.vertices[0].v.getCopy());
        this.poly[1].pushVert(this.vertices[0].v.getCopy());
        this.vertices[0].s.color = new sol.Vec3(220, 60, 30);
        
        this.sweepLine.position.y = this.vertices[0].v.y;
        
        this.#updateBatch();
        ++this.progress.step;
        
        break;
      }
      case 2 : {
        console.log(`step: ${this.progress.step}`);
        console.log(`  identify the bottom-most vertex`);

        this.poly[0].pushVert(this.vertices
          [this.vertices.length - 1].v.getCopy());
        this.poly[1].pushVert(this.vertices
          [this.vertices.length - 1].v.getCopy());
        this.vertices[this.vertices.length - 1].s.color =
          new sol.Vec3(20, 140, 220);
        
        let t = this.vertices[0].v;
        let b = this.vertices[this.vertices.length - 1].v;

        this.centerLine.pushVerts([
          new sol.Vec2(t.x, t.y),
          new sol.Vec2(b.x, b.y),
        ]);
        
        this.#updateBatch();
        ++this.progress.step;
        
        break;
      }
      case 3 : {
        if (this.progress.flipv === 0) {
          console.log(`step: ${this.progress.step}`);
          console.log(`  identify the next vertex to check`);

          // update the vertex visually to show it's
          // currently being checked
          this.vertices[this.progress.currv].s.color =
              new sol.Vec3(60, 200, 60);
          this.sweepLine.position.y =
            this.vertices[this.progress.currv].v.y;

          this.progress.flipv = 1;
        } else {
          let pid = this.progress.pid;
          const top = this.vertices[0].v;
          const bot = this.vertices[this.vertices.length - 1].v;
          const cur = this.vertices[this.progress.currv].v;
          
          if (this.progress.procv === 0) {
            console.log(`      determine side...`);

            // using the determinant find out what side of
            // the centre line the current point is...
            const tb = new sol.Vec2(bot.x - top.x, bot.y - top.y);
            const tc = new sol.Vec2(cur.x - top.x, cur.y - top.y);
            const det = tb.getDeterminant(tc);

            if (det > 0) {
              console.log(`      ...right side`);
              this.progress.pid = 1;

              this.vertices[this.progress.currv].s.color =
                new sol.Vec3(210, 200, 20);
            } else {
              console.log(`      ...left side`);
              this.progress.pid = 0;

              this.vertices[this.progress.currv].s.color =
                new sol.Vec3(10, 220, 200);
            }
            // ...

            this.progress.procv = 1;
          } else if (this.progress.procv === 1) {
            //
            let outVerts = [];
            let outPoly = new sol.Shape();
            outPoly.renderMode = GL.LINE_LOOP;
            // ...

            console.log(`      check if would be first point ` +
              `added to poly...`);
            
            if (this.poly[pid].verts.length > 2) {
              console.log(`      ...would not be first point added`);
              console.log(`      check if outside current poly...`);
              if (!this.poly[pid].isPointInside(cur)) {
                console.log(`      ...outside current poly`);

                if (pid === 0) {
                  outVerts = [top.getCopy(), cur.getCopy(), bot.getCopy()];
                  
                  for (let i = 1; i < this.poly[pid].verts.length - 1; ++i) {
                    let polyCheck = new sol.Polygon();
                    polyCheck.verts = outVerts;

                    if (!polyCheck.isPointInside(this.poly[pid].verts[i])) {
                      outVerts.splice(outVerts.length - 2, 0,
                        this.poly[pid].verts[i].getCopy());
                    }
                  }
                } else {
                  outVerts = [top.getCopy(), bot.getCopy(), cur.getCopy()];
                  
                  for (let i = this.poly[pid].verts.length - 1; i > 1; --i) {
                    // need to check in reverse order due to winding

                    let polyCheck = new sol.Polygon();
                    polyCheck.verts = outVerts;
                    
                    if (!polyCheck.isPointInside(this.poly[pid].verts[i])) {
                      outVerts.splice(3, 0,
                        this.poly[pid].verts[i].getCopy());
                    }
                  }
                }

                this.poly[pid].verts = outVerts;
              } else {
                console.log(`      ...not outside current poly so skip`);
              }
            } else {
              console.log(`      ...would be first point added so add`);

              // current poly doesn't have enough points so current
              // point is automatically added
              if (pid === 0) {
                outVerts = [top.getCopy(), cur.getCopy(), bot.getCopy()];
              } else {
                outVerts = [top.getCopy(), bot.getCopy(), cur.getCopy()];
              }

              this.poly[pid].verts = outVerts;
            }

            // update the vertex visually to show it's
            // been checked
            this.vertices[this.progress.currv].s.color =
              new sol.Vec3(140, 140, 140);

            ++this.progress.currv;
            this.progress.flipv = 0;
            this.progress.procv = 0;

            if (this.progress.currv === this.vertices.length - 1) {
              ++this.progress.step;
            }
          }
        }

        this.#updateBatch();

        break;
      }
      case 4 : {
        console.log(`step: ${this.progress.step}`);
        this.sweepLine.position.y =
          this.vertices[this.vertices.length - 1].v.y;
        
        ++this.progress.step;
        this.#algospeed = this.#algopause;

        // [!] create final polygon mask and display

        this.#updateBatch();
        
        break;
      }
      case 5 : {
        // [!] reset and hide final polygon mask

        this.vertices = [];
        this.sweepLine.position =
          new sol.Vec2(0, GL.canvas.clientHeight + 1);
        this.centerLine = new sol.Shape();
        this.centerLine.renderMode = GL.LINES;

        this.poly = [new sol.Shape(), new sol.Shape()];
        this.poly[0].renderMode = GL.LINE_LOOP;
        this.poly[1].renderMode = GL.LINE_LOOP;

        this.progress = {
          step  : 0,
          currv : 1,
          flipv : 0,
          pid   : 0,
          procv : 0,
        };

        this.#algospeed = this.#algostep;

        this.#generateVertices();
        this.#updateBatch();

        break;
      }
      default :
        break;
    }
  }

  #updateBatch() {
    for (let vert of this.vertices) {
      // this.batch.add(vert.s);
    }

    for (let poly of this.poly) {
      this.batch.add(poly);
    }

    this.batch.add(this.sweepLine);
    this.batch.add(this.centerLine);

    // this.batch.add(this.mask);

    for (let t of this.temp) {
      this.batch.add(t);
    }

    this.batch.upload();
  }


  // inVerts - a flat array of 2d coordinates
  //   [x1, y1, x2, y2, ... xn, yn]
  #soless(inVerts) {
    // [!] need to deal with coincident (or reaaaaly close) points
    // maybe use a tolerance

    // make a copy of vertices for sorting...
    let verts = [];
    for (let i = 0; i < inVerts.length; i += 2) {
      verts.push({ x: inVerts[i], y: inVerts[i + 1] });
    }
    // ...

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

    // helper function to deduce which side of a line a point
    // lies using the determinant...
      let isLeft = (top, bot, cur) => {
        const tb = { x: bot.x - top.x, y: bot.y - top.y };
        const tc = { x: cur.x - top.x, y: cur.y - top.y };
        const det = (tb.x * tc.y) - (tc.x * tb.y);
        
        return (det <= 0) ? true : false;
      }
    // ...

    // helper function to deduce if a point lies within a
    // polygon...
      let isPointInside = (poly, pt) => {
        let wNum = 0;

        for (let i = 0; i < poly.length; ++i) { 
          let cur = poly[i];
          let nxt = poly[(i + 1) % poly.length];
          let left = isLeft(cur, nxt, pt);

          if (cur.y <= pt.y) {
            if (nxt.y > pt.y && !left) {
              ++wNum;
            }
          } else {
            if (nxt.y <= pt.y && left) {
              --wNum;
            }
          }
        }

        return (wNum !== 0) ? true : false;
      }
    // ...

    // find the centre line (highest to lowest point) and then
    // construct two polygons: one left of the centre line and
    // one to the right ensuring the correct (ccw) winding...
    let sides = [[], []];

    // the highest and lowest points; this forms our centre line
    const top = verts[0];
    const bot = verts[verts.length - 1];

    for (let i = 1; i < verts.length - 1; ++i) {
      const cur = verts[i];

      // assume left side (0) unless found to be otherwise (1)
      let curSide = 0;
      if (!isLeft(top, bot, cur)) {
        curSide = 1;
      }

      if (sides[curSide].length > 2) {
        if (!isPointInside(sides[curSide], cur)) {
          let newSide = [];

          if (curSide === 0) {
            // create a new side (initially a triangle) using the
            // centre line and the current vertex
            newSide = [top, cur, bot];
            
            for (let i = 1; i < sides[curSide].length - 1; ++i) {
              // for all points (other than highest and lowest)
              // in the current side check if it lies inside
              // the new side

              if (!isPointInside(newSide, sides[curSide][i])) {
                // if so then add it to the new side making sure
                // to preserve the winding
                
                newSide.splice(newSide.length - 2, 0, sides[curSide][i]);
              }
            }
          } else {
            // same process as for the left side above, but care is
            // needed in both preserving the winding and the order
            // in which we traverse the points of the current side

            newSide = [top, bot, cur];
            
            for (let i = sides[curSide].length - 1; i > 1; --i) {
              if (!isPointInside(newSide, sides[curSide][i])) {
                newSide.splice(3, 0, sides[curSide][i]);
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
          sides[curSide] = [top, cur, bot];
        } else {
          sides[curSide] = [top, bot, cur];
        }
      }
    }

    // create the mask by stitching both sides together and then
    // collapse into a flat 2d array (same as input) and return...
    let result = [];

    sides[0].forEach((ele) => {
      result.push(ele.x, ele.y);
    });

    // first 2 elements in right side are top and bottom which
    // already exist in result array
    (sides[1].slice(2)).forEach((ele) => {
      result.push(ele.x, ele.y);
    });

    return result;
    // ...
  }
};

export default AlgoScene;
