import Transformable from './transformable.js';
import Vec2 from './vec2.js';

class Polygon extends Transformable(Object) {
  constructor() {
    super();

    this.verts = new Array();
  }

  copy(other) {
    super.copy(other);

    this.verts.splice(0, this.verts.length);
    for (let v of other.verts) {
      this.verts.push(v.getCopy());
    }
  }

  getCopy() {
    let copy = new Polygon(); copy.copy(this);
    return copy;
  }

  pushVert(vert) {
    this.verts.push(vert.getCopy());
    
    this.localBox[0].x = Math.min(vert.x, this.localBox[0].x);
    this.localBox[0].y = Math.min(vert.y, this.localBox[0].y);

    this.localBox[1].x = Math.max(vert.x, this.localBox[1].x);
    this.localBox[1].y = Math.max(vert.y, this.localBox[1].y);
  }

  getWinding() {
    let area = 0.0;
    for (let i = 0; i < this.verts.length; ++i) {
      let ii = (i + 1) % this.verts.length;
      area += (this.verts[ii].x - this.verts[i].x) *
          (this.verts[ii].y + this.verts[i].y);
    }
    
    if (area >= 0.0) {
      return -1;
    }
    
    return 1;
  }

  reverseWinding() {
    let result = 1;
    if (this.getWinding() == result) {
      result = -1;
    }
    
    if (this.verts.length != 0) {
      this.verts.reverse();
    }
    
    return result;
  }

  updateGlobalBox() {
    if (this.verts.length > 0) {
      this.globalBox = new Array(
          new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
          new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
      );

      let transMat = this.transMat.getCopy();

      let offsetPos = new Vec2(this.position.x - this.origin.x,
          this.position.y - this.origin.y);
      transMat.translate(offsetPos);
      
      transMat.translate(this.origin);
      transMat.rotate(this.rotation);
      transMat.scale(this.scale);
      transMat.translate(this.origin.negate());

      for (const v of this.verts) {
        let vert = new Vec2();
        vert.x = (transMat.arr[0] * v.x) + (transMat.arr[3] * v.y) +
            (transMat.arr[6] * 1.0);
        vert.y = (transMat.arr[1] * v.x) + (transMat.arr[4] * v.y) +
            (transMat.arr[7] * 1.0);

        this.globalBox[0].x = Math.min(vert.x, this.globalBox[0].x);
        this.globalBox[0].y = Math.min(vert.y, this.globalBox[0].y);

        this.globalBox[1].x = Math.max(vert.x, this.globalBox[1].x);
        this.globalBox[1].y = Math.max(vert.y, this.globalBox[1].y);
      }
    }
  }

  updateGlobalMask() {
    this.globalMask.splice(0, this.globalMask.length);

    if (this.verts.length > 0) {
      let transMat = this.transMat.getCopy();

      let offsetPos = new Vec2(this.position.x - this.origin.x,
          this.position.y - this.origin.y);
      transMat.translate(offsetPos);
      
      transMat.translate(this.origin);
      transMat.rotate(this.rotation);
      transMat.scale(this.scale);
      transMat.translate(this.origin.negate());
      
      for (const v of this.verts) {
        let vert = new Vec2();
        vert.x = (transMat.arr[0] * v.x) + (transMat.arr[3] * v.y) +
            (transMat.arr[6] * 1.0);
        vert.y = (transMat.arr[1] * v.x) + (transMat.arr[4] * v.y) +
            (transMat.arr[7] * 1.0);
        
        this.globalMask.push(vert);
      }
    }
  }

  createLocalMask() {
    this.localMask.splice(0, this.localMask.length);

    for (const v of this.verts) {
      this.localMask.push(v.getCopy());
    }
  }

  makeCircle(diameter, resolution) {
    this.verts.splice(0, this.verts.length);

    this.localBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );

    this.globalBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );

    this.localMask.splice(0, this.localMask.length);
    this.globalMask.splice(0, this.globalMask.length);

    let res = 18;
    if (resolution != undefined) {
      res = resolution;
    }

    let pi180 = Math.PI / 180;
    let iter = 0;
    let inc = 360 / res;
    while (iter < 360) {
      let angle = iter * pi180;
      this.pushVert(new Vec2(Math.cos(angle) * diameter,
          Math.sin(angle) * diameter));
      iter += inc;
    }
  }

  makePolyLine(verts, halfWidth) {
    // clean up any exisiting vertices
    this.verts.splice(0, this.verts.length);

    this.localBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );

    this.globalBox = new Array(
        new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
        new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    );

    this.localMask.splice(0, this.localMask.length);
    this.globalMask.splice(0, this.globalMask.length);
    //

    let rectangles = new Array();

    if (verts.length > 1) {
      // create rectangles around line segments
      for (let i = 0; i < verts.length - 1; ++i) {
        let vAB = new Vec2(verts[i + 1].x - verts[i].x,
            verts[i + 1].y - verts[i].y);
        
        let vRot = new Vec2(-vAB.y, vAB.x);
        let vNorm = vRot.normalise();
        let vOffset = new Vec2(vNorm.x * halfWidth,
            vNorm.y * halfWidth);
        
        rectangles.push([
            new Vec2(verts[i].x + vOffset.x,
              verts[i].y + vOffset.y),
            new Vec2(verts[i + 1].x + vOffset.x,
              verts[i + 1].y + vOffset.y),
            new Vec2(verts[i + 1].x - vOffset.x,
              verts[i + 1].y - vOffset.y),
            new Vec2(verts[i].x - vOffset.x,
              verts[i].y - vOffset.y)
        ]);
      }

      if (rectangles.length > 0) {
        // find the point that sits on the outline
        let findOutline = (ptA, ptB, ptC, ptD) => {
          if (!ptB.equals(ptC)) {
            // linear equation for first line
            let A1 = ptB.y - ptA.y;
            let B1 = ptA.x - ptB.x;
            let C1 = (A1 * ptA.x) + (B1 * ptA.y);

            // linear equation for second line
            let A2 = ptD.y - ptC.y;
            let B2 = ptC.x - ptD.x;
            let C2 = (A2 * ptC.x) + (B2 * ptC.y);

            // get determinant (2d cross product)
            let det = (A1 * B2) - (A2 * B1);

            if (det != 0) {
              let invDet = 1 / det;
              let x = ((B2 * C1) - (B1 * C2)) * invDet;
              let y = ((A1 * C2) - (A2 * C1)) * invDet;

              if (Math.min(ptA.x, ptB.x) + 0.005 < x &&
                  Math.max(ptA.x, ptB.x) - 0.005 > x) {
                  
                  return [new Vec2(x, y)];
              }
              else {
                return [ptB.getCopy(), ptC.getCopy()];
              }
            }
            else {
              // we only get here if points are too close so
              // just return the point
              return [ptB.getCopy()];
            }
          }
          else {
            return [ptB.getCopy()];
          }
        }
        
        // construct left and right side of outline
        let left = new Array(rectangles[0][0].getCopy());
        let right = new Array(
            rectangles[rectangles.length - 1][2].getCopy()
        );
        
        for (let i = 0, j = rectangles.length - 1;
            i < rectangles.length - 1; ++i, --j) {
          
          let rectA = rectangles[i];
          let rectB = rectangles[i + 1];
          let result = findOutline(rectA[0], rectA[1], rectB[0], rectB[1]);
          for (let r of result) {
            left.push(r);
          }

          let rectC = rectangles[j];
          let rectD = rectangles[j - 1];
          result = findOutline(rectC[2], rectC[3], rectD[2], rectD[3]);
          for (let r of result) {
            right.push(r);
          }
        }

        left.push(rectangles[rectangles.length - 1][1].getCopy());
        right.push(rectangles[0][3].getCopy());

        for (let v of left) {
          this.pushVert(v.getCopy());
        }
        
        for (let v of right) {
          this.pushVert(v.getCopy());
        }
      }
    }
  }
};

export default Polygon;
