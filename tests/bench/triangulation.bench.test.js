import { bench, describe } from 'vitest'


import {glSetContext} from '../../scr/gl.js'

import Shape from '../../scr/shape.js';
import Vec2 from '../../scr/vec2.js';

describe("triangulation", () => {
  /*
  .--------------------------------------------------------------------.
  | test the speed of the triangulation algorithm on a variety of      |
  | differing polygons. datasets taken from here:                      |
  | https://people.sc.fsu.edu/~jburkardt/datasets/polygon/polygon.html |
  '--------------------------------------------------------------------'
  */

  // only need a valid context to retrieve render mode enums inside
  // Renderable2D base class (via Shape)
  var fakeContext = {
    TRIANGLES: 0
  };

  glSetContext(fakeContext);
  // ...

  let hand = new Shape([
    new Vec2(0.496200, 0.208600),
    new Vec2(0.557100, 0.319900),
    new Vec2(0.606100, 0.415800),
    new Vec2(0.644900, 0.500900),
    new Vec2(0.627100, 0.534400),
    new Vec2(0.593200, 0.512700),
    new Vec2(0.568900, 0.469200),
    new Vec2(0.539800, 0.424000),
    new Vec2(0.500500, 0.433900),
    new Vec2(0.486000, 0.501800),
    new Vec2(0.481700, 0.569700),
    new Vec2(0.493500, 0.663800),
    new Vec2(0.495700, 0.733500),
    new Vec2(0.496800, 0.783300),
    new Vec2(0.489800, 0.840300),
    new Vec2(0.477900, 0.855700),
    new Vec2(0.461800, 0.850200),
    new Vec2(0.457500, 0.822200),
    new Vec2(0.456900, 0.770600),
    new Vec2(0.456400, 0.736200),
    new Vec2(0.448300, 0.678300),
    new Vec2(0.437500, 0.612200),
    new Vec2(0.418100, 0.595000),
    new Vec2(0.405200, 0.642100),
    new Vec2(0.396100, 0.714500),
    new Vec2(0.381500, 0.773300),
    new Vec2(0.369100, 0.862000),
    new Vec2(0.351400, 0.885500),
    new Vec2(0.329800, 0.866500),
    new Vec2(0.334700, 0.817600),
    new Vec2(0.348700, 0.744300),
    new Vec2(0.354600, 0.688200),
    new Vec2(0.372400, 0.586000),
    new Vec2(0.360500, 0.586000),
    new Vec2(0.339000, 0.641200),
    new Vec2(0.314200, 0.701800),
    new Vec2(0.279800, 0.811300),
    new Vec2(0.272200, 0.815800),
    new Vec2(0.256100, 0.808600),
    new Vec2(0.249600, 0.786900),
    new Vec2(0.256100, 0.754300),
    new Vec2(0.287300, 0.656600),
    new Vec2(0.297000, 0.622200),
    new Vec2(0.322800, 0.537100),
    new Vec2(0.312600, 0.530800),
    new Vec2(0.288400, 0.557900),
    new Vec2(0.251800, 0.626700),
    new Vec2(0.231300, 0.657500),
    new Vec2(0.215100, 0.656600),
    new Vec2(0.213000, 0.621300),
    new Vec2(0.235100, 0.572400),
    new Vec2(0.250700, 0.535300),
    new Vec2(0.289400, 0.461100),
    new Vec2(0.299100, 0.420400),
    new Vec2(0.306100, 0.363300),
    new Vec2(0.313100, 0.319000),
    new Vec2(0.323900, 0.264700),
    new Vec2(0.336300, 0.235700),
    new Vec2(0.356200, 0.217600)
  ]);

  let i18 = new Shape([
    new Vec2( 0,  0),
    new Vec2(10,  7),
    new Vec2(12,  3),
    new Vec2(20,  8),
    new Vec2(13, 17),
    new Vec2(10, 12),
    new Vec2(12, 14),
    new Vec2(14,  9),
    new Vec2( 8, 10),
    new Vec2( 6, 14),
    new Vec2(10, 15),
    new Vec2( 7, 18),
    new Vec2( 0, 16),
    new Vec2( 1, 13),
    new Vec2( 3, 15),
    new Vec2( 5,  8),
    new Vec2(-2,  9),
    new Vec2( 5,  5)
  ]);

  let square = new Shape([
    new Vec2( 0.0,  0.0),
    new Vec2(10.0,  0.0),
    new Vec2(10.0, 10.0),
    new Vec2( 0.0, 10.0)
  ]);

  let star = new Shape([
    new Vec2( 0.95105651629515353,  0.30901699437494740),
    new Vec2( 0.22451398828979272,  0.30901699437494740),
    new Vec2(-0.95105651629515353,  0.30901699437494751),
    new Vec2(-0.36327126400268051, -0.11803398874989464),
    new Vec2( 0.58778525229247292, -0.80901699437494756),
    new Vec2( 0.36327126400268039, -0.11803398874989492),
    new Vec2(                 0.0,                  1.0),
    new Vec2(-0.22451398828979263,  0.30901699437494745),
    new Vec2(-0.58778525229247325, -0.80901699437494734),
    new Vec2(                 0.0, -0.38196601125010515)
  ]);

  let circle = new Shape(); circle.makeCircle(10, 24);
  
  bench('triangulate a hand', () => {
    hand.triangulate();
  }, {time: 1000, iterations: 100});

  bench('triangulate a complex non-convex polygon', () => {
    i18.triangulate();
  }, {time: 1000, iterations: 100});

  bench('triangulate a square', () => {
    square.triangulate();
  }, {time: 1000, iterations: 100});

  bench('triangulate a star', () => {
    star.triangulate();
  }, {time: 1000, iterations: 100});

  bench('triangulate a circle', () => {
    circle.triangulate();
  }, {time: 1000, iterations: 100});
});
