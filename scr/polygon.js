import Transformable2D from './transformable2d.js';
import Vec2 from './vec2.js';

class Polygon {
  // private fields
    #transformable = new Transformable2D();

    #verts = new Array();
  // ...

  constructor(verts = undefined) {
    // checking for undefined here lets us call this
    // constructor from a derived class (namely shape)
    // by passing nothing, which prevents calling the
    // derived setter for verts
    if (verts !== undefined) {
      this.verts = verts;
    }
  }

  // getters/setters
  get verts() { return this.#verts; }

  set verts(verts) {
    if (!(verts instanceof Array)) {
      throw new TypeError("Polygon (verts): verts should " +
        "be an Array of Vec2");
    }

    let bbox = {
      lower: new Vec2(Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY),
      upper: new Vec2(Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY)
    };

    for (const vert of verts) {
      if (!(vert instanceof Vec2)) {
        throw new TypeError("Polygon (verts): vert should " +
          "be a Vec2");
      }

      bbox.lower.x = Math.min(vert.x, bbox.lower.x);
      bbox.lower.y = Math.min(vert.y, bbox.lower.y);

      bbox.upper.x = Math.max(vert.x, bbox.upper.x);
      bbox.upper.y = Math.max(vert.y, bbox.upper.y);
    }
    
    this.boundingBox = bbox;
    this.#verts = verts;
  }

  // helpers for working with transformable - error
  // handling occurs in Transformable2D class
  get transformable() { return this.#transformable; }
  
  get position() { return this.#transformable.position; }
  get origin()   { return this.#transformable.origin;   }
  get transMat() { return this.#transformable.transMat; }
  get scale()    { return this.#transformable.scale;    }
  get rotation() { return this.#transformable.rotation; }
  get boundingBox() { return this.#transformable.boundingBox; }

  set position(position) { this.#transformable.position = position; }
  set origin(origin)     { this.#transformable.origin = origin;     }
  set transMat(transMat) { this.#transformable.transMat = transMat; }
  set scale(scale)       { this.#transformable.scale = scale;       }
  set rotation(rotation) { this.#transformable.rotation = rotation; }

  set boundingBox(boundingBox) {
    this.#transformable.boundingBox = boundingBox;
  }
  // ...

  copy(other) {
    if (!(other instanceof Polygon)) {
      throw new TypeError("Polygon (copy): other should be " +
        "a Polygon");
    }

    this.#transformable = other.#transformable.getCopy();

    this.#verts.splice(0, this.#verts.length);
    for (let v of other.#verts) {
      this.#verts.push(v.getCopy());
    }
  }

  getCopy() {
    let copy = new Polygon();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    if (!(other instanceof Polygon)) {
      throw new TypeError("Polygon (equals): other should be " +
        "a Polygon");
    }
    
    return (
      this.#verts.length === other.#verts.length &&
      this.#verts.every((e, i) => {
         return e.equals(other.#verts[i]);
      }) &&

      this.#transformable.equals(other.#transformable)
    );
  }

  pushVert(vert) {
    if (!(vert instanceof Vec2)) {
      throw new TypeError("Polygon (pushVert): vert should " +
        "be a Vec2");
    }
    
    this.#verts.push(vert.getCopy());
    
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
    if (!(verts instanceof Array)) {
      throw new TypeError("Polygon (pushVerts): verts should " +
        "be an Array of Vec2");
    }
    
    for (const vert of verts) {
      this.pushVert(vert);
    }
  }

  getWinding() {
    // if area is positive then polygon is clockwise
    let area = 0.0;

    for (let i = 0; i < this.#verts.length; ++i) {
      // next vertex; wrap around
      let ii = (i + 1) % this.#verts.length;

      area += (this.#verts[ii].x - this.#verts[i].x) *
        (this.#verts[ii].y + this.#verts[i].y);
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
    this.#verts.splice(0, this.#verts.length);

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
    this.#verts.splice(0, this.#verts.length);

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
        let result = this.#findOutline(rectA[0],
          rectA[1], rectB[0], rectB[1]);

        for (let r of result) {
          left.push(r);
        }

        let rectC = rectangles[j];
        let rectD = rectangles[j - 1];
        result = this.#findOutline(rectC[2],
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

  // checks if the point is inside this polygon
  isPointInside(point) {
    let windingNum = 0;

    for (let i = 0; i < this.#verts.length; ++i) { 
      let curr = this.#verts[i];
      let next = this.#verts[(i + 1) % this.#verts.length];

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

  #findOutline = (ptA, ptB, ptC, ptD) => {
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
