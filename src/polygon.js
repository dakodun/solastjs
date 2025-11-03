import Sol from './sol.js';

import Transformable2D from './transformable2d.js';
import Vec2 from './vec2.js';

class Polygon {
  //> internal properties //
  _transformable = new Transformable2D();

  _verts = new Array();

  //> constructor //
  constructor(verts = undefined) {
    // checking for undefined here lets us call this
    // constructor from a derived class (namely shape)
    // by passing nothing, which prevents calling the
    // derived setter for verts
    if (verts !== undefined) {
      this.verts = verts;
    }
  }

  //> getters/setters //
  get verts() { return this._verts; }

  set verts(verts) {
    Sol.CheckTypes(this, "set verts",
    [{verts}, [Array]]);

    let bbox = {
      lower: new Vec2(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY),
      upper: new Vec2(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY)
    };

    for (const vert of verts) {
      if (!(vert instanceof Vec2)) {
        throw new TypeError("Polygon (set verts): verts should " +
          "be an Array of Vec2");
      }

      bbox.lower.x = Math.min(vert.x, bbox.lower.x);
      bbox.lower.y = Math.min(vert.y, bbox.lower.y);

      bbox.upper.x = Math.max(vert.x, bbox.upper.x);
      bbox.upper.y = Math.max(vert.y, bbox.upper.y);
    }
    
    this.boundingBox = bbox;
    this._verts = verts;
  }

  //> getters (transformable) //
  get transformable() { return this._transformable; }
  
  get position() { return this._transformable.position; }
  get origin()   { return this._transformable.origin;   }
  get transMat() { return this._transformable.transMat; }
  get scale()    { return this._transformable.scale;    }
  get rotation() { return this._transformable.rotation; }
  get boundingBox() { return this._transformable.boundingBox; }

  get width()  { return this._transformable.width;  }
  get height() { return this._transformable.height; }

  //> setters (transformable) //
  set position(position) { this._transformable.position = position; }
  set origin(origin)     { this._transformable.origin = origin;     }
  set transMat(transMat) { this._transformable.transMat = transMat; }
  set scale(scale)       { this._transformable.scale = scale;       }
  set rotation(rotation) { this._transformable.rotation = rotation; }

  set boundingBox(boundingBox) {
    this._transformable.boundingBox = boundingBox;
  }

  //> public methods //
  copy(other) {
    Sol.CheckTypes("Polygon", "copy",
    [{other}, [Polygon]]);

    this._transformable = other._transformable.getCopy();

    this._verts.splice(0, this._verts.length);
    for (let v of other._verts) {
      this._verts.push(v.getCopy());
    }
  }

  getCopy() {
    let copy = new Polygon();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.CheckTypes("Polygon", "equals",
    [{other}, [Polygon]]);
    
    return (
      this._verts.length === other._verts.length &&
      this._verts.every((e, i) => {
         return e.equals(other._verts[i]);
      }) &&

      this._transformable.equals(other._transformable)
    );
  }

  pushVert(vert) {
    Sol.CheckTypes("Polygon", "pushVert",
    [{vert}, [Vec2]]);
    
    this._verts.push(vert.getCopy());
    
    this.boundingBox.lower.x =
      Math.min(vert.x, this.boundingBox.lower.x);
    this.boundingBox.lower.y =
      Math.min(vert.y, this.boundingBox.lower.y);

    this.boundingBox.upper.x =
      Math.max(vert.x, this.boundingBox.upper.x);
    this.boundingBox.upper.y =
      Math.max(vert.y, this.boundingBox.upper.y);
  }

  pushVerts(verts) {
    Sol.CheckTypes("Polygon", "pushVerts",
    [{verts}, [Array]]);
    
    for (const vert of verts) {
      this.pushVert(vert);
    }
  }

  getWinding() {
    // if area is positive then polygon is clockwise
    let area = 0.0;

    for (let i = 0; i < this._verts.length; ++i) {
      // next vertex; wrap around
      let ii = (i + 1) % this._verts.length;

      area += (this._verts[ii].x - this._verts[i].x) *
        (this._verts[ii].y + this._verts[i].y);
    }
    
    return (area >= 0) ? 1 : -1;
  }

  isCW() {
    return (this.getWinding() > 0) ? true : false;
  }

  isCCW() {
    return !this.isCW();
  }

  reverseWinding() {
    this.verts.reverse();

    return this.getWinding();
  }

  makeCircle(diameter, resolution = 18) {
    this._verts.splice(0, this._verts.length);

    this.boundingBox = {
      lower: new Vec2(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY),
      upper: new Vec2(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY)
    };

    let pi180 = Math.PI / 180;
    let iter = 0;
    let inc = 360 / resolution;

    while (iter < 360) {
			let angle = iter * pi180;

			this.pushVert(new Vec2(Math.cos(angle) * diameter,
        Math.sin(angle) * diameter));
      
      iter += inc;
		}
  }

  makePolyLine(verts, halfWidth) {
    this._verts.splice(0, this._verts.length);

    this.boundingBox = {
      lower: new Vec2(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY),
      upper: new Vec2(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY)
    };

    let rectangles = new Array();

    for (let i = 0; i < verts.length - 1; ++i) {
      // create rectangles around all line segments
      let j = (i + 1) % verts.length;
      let vAB = new Vec2(verts[j].x - verts[i].x,
          verts[j].y - verts[i].y);
      
      let vNorm = (new Vec2(-vAB.y, vAB.x)).getNormalized();
      let vOffset = new Vec2(vNorm.x * halfWidth,
          vNorm.y * halfWidth);
      
      rectangles.push([
        new Vec2(verts[i].x + vOffset.x,
          verts[i].y + vOffset.y),
        new Vec2(verts[j].x + vOffset.x,
          verts[j].y + vOffset.y),
        new Vec2(verts[j].x - vOffset.x,
          verts[j].y - vOffset.y),
        new Vec2(verts[i].x - vOffset.x,
          verts[i].y - vOffset.y)
      ]);
    }

    if (rectangles.length > 0) {
      // construct left and right side of outline
      let left = new Array(rectangles[0][0].getCopy());
      let right = new Array(
          rectangles[rectangles.length - 1][2].getCopy()
      );
      
      for (let i = 0, j = rectangles.length - 1;
          i < rectangles.length - 1; ++i, --j) {
        
        let rectA = rectangles[i];
        let rectB = rectangles[i + 1];
        let result = this._findOutline(rectA[0],
          rectA[1], rectB[0], rectB[1]);

        for (let r of result) {
          left.push(r);
        }

        let rectC = rectangles[j];
        let rectD = rectangles[j - 1];
        result = this._findOutline(rectC[2],
          rectC[3], rectD[2], rectD[3]);
        
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

  isPointInside(point) {
    // checks if the point is inside this polygon

    let windingNum = 0;

    for (let i = 0; i < this._verts.length; ++i) { 
      let curr = this._verts[i];
      let next = this._verts[(i + 1) % this._verts.length];

      const cn = new Vec2( next.x - curr.x,  next.y - curr.y);
      const cp = new Vec2(point.x - curr.x, point.y - curr.y);
      let det = cn.getDeterminant(cp);

      if (curr.y <= point.y) {
        if (next.y > point.y && det > 0) {
          ++windingNum;
        }
      } else {
        if (next.y <= point.y && det < 0) {
          --windingNum;
        }
      }
    }

    return (windingNum !== 0) ? true : false;
  }

  //> internal methods //
  _findOutline = (ptA, ptB, ptC, ptD) => {
    // find the point that sits on the outline
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
        } else {
          return [ptB.getCopy(), ptC.getCopy()];
        }
      } else {
        // we only get here if points are too close so
        // just return the point

        return [ptB.getCopy()];
      }
    } else {
      return [ptB.getCopy()];
    }
  }

  //> static methods //
  static SegSeg(frstSeg, scndSeg) {
    // an alias function for segment-segment intersection
    return Polygon.SegmentSegmentIntersect(frstSeg, scndSeg);
  }

  static SegmentSegmentIntersect(frstSeg, scndSeg) {
    // from Graphics Gems 3

    let result = {
      intersects : false,
      point : undefined
    };

    // a -> b is the first segment
    // c -> d is the second segment
    const a = frstSeg[0];
    const b = frstSeg[1];
    const c = scndSeg[0];
    const d = scndSeg[1];

    // ensure correct direction
    const ab = new Vec2(b.x - a.x, b.y - a.y);
    const dc = new Vec2(c.x - d.x, c.y - d.y);

    // if the denominator is 0 then the lines are parallel
    const dcabDet = dc.getDeterminant(ab);
    if (dcabDet === 0) {
      return result;
    }
    
    const ca = new Vec2(a.x - c.x, a.y - c.y);

    const cadcDet = ca.getDeterminant(dc);
    if (cadcDet < 0 || cadcDet > dcabDet) {
      return result;
    }

    const abcaDet = ab.getDeterminant(ca);
    if (abcaDet < 0 || abcaDet > dcabDet) {
      return result;
    }

    const alpha = cadcDet / dcabDet;

    result.intersects = true;
    result.point = new Vec2(
      a.x + (alpha * ab.x),
      a.y + (alpha * ab.y)
    );

    return result;
  }

  static isLeft(top, bot, cur) {
    const tb = new Vec2(bot.x - top.x, bot.y - top.y);
    const tc = new Vec2(cur.x - top.x, cur.y - top.y);
    const det = tb.getDeterminant(tc);
    
    return (det <= 0) ? true : false;
  }
};

export default Polygon;
