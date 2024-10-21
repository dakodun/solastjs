import Mat4 from './mat4.js';
import Vec3 from './vec3.js';

class Camera3D {
  static Plane = {
    YZ : 1,
    XZ : 2,
    XY : 4
  };

	constructor() {
    this.view = new Mat4();
    this.update = false;

    this.position = new Vec3(0.0, 0.0, 0.0);
    this.rotation = new Vec3(0.0, 0.0, 0.0);
	}

	copy(other) {
    this.view = other.view.getCopy();
    this.update = other.update;

    this.position = other.position.getCopy();
    this.rotation = other.rotation.getCopy();
  }

  getCopy() {
    let copy = new Camera3D(); copy.copy(this);
    return copy;
  }

  setPosition(position) {
    this.position.copy(position);
    
    this.update = true;
  }

  setRotation(rotation) {
    this.rotation = rotation;
    
    this.update = true;
  }

  translate(direction, plane) {
    this.getViewMatrix();

    let axis = new Array(3);
    let dist = direction.asArray();

    for (let i = 0; i < 3; ++i) {
      if (Math.abs(dist[i]) > 1e-15) {
        // get the transformed axis to move along
        axis[i] = new Vec3(
          ((plane & Camera3D.Plane.YZ) === 0) ? this.view.arr[0 + i] : 0,
          ((plane & Camera3D.Plane.XZ) === 0) ? this.view.arr[4 + i] : 0,
          ((plane & Camera3D.Plane.XY) === 0) ? this.view.arr[8 + i] : 0
        ); axis[i].normalize();

        this.position.x += axis[i].x * dist[i];
        this.position.y += axis[i].y * dist[i];
        this.position.z += axis[i].z * dist[i];
      }
    }

    this.update = true;
  }

  lookAt(eyeVec, centerVec, upVec) {
    /*
    .--LOOK-AT-------.
    | sx  sy  sz -tx |
    | ux  uy  uz -ty |
    |-fx -fy -fz -tz |
    |  0   0   0   1 |
    '----------------'
    */
    
    let up = new Vec3(0.0, 1.0, 0.0);
    if (upVec != undefined) {
       up = upVec.getCopy();
    }

    let f = new Vec3(
      centerVec.x - eyeVec.x,
      centerVec.y - eyeVec.y,
      centerVec.z - eyeVec.z
    ); f.normalize();

    let s = f.getCross(up); s.normalize();
    let u = s.getCross(f);

    // create the view matrix
    this.view.identity();

    this.view.arr[ 0] = s.x;
    this.view.arr[ 4] = s.y;
    this.view.arr[ 8] = s.z;
    
    this.view.arr[ 1] = u.x;
    this.view.arr[ 5] = u.y;
    this.view.arr[ 9] = u.z;
    
    this.view.arr[ 2] = -f.x;
    this.view.arr[ 6] = -f.y;
    this.view.arr[10] = -f.z;

    this.view.arr[12] = 0;
    this.view.arr[13] = 0;
    this.view.arr[14] = 0;

    this.view.translate(eyeVec.getNegated());
    // ...

    // get the position and rotation from the matrix
    let decom = this.view.decompose();

    this.position.copy(decom[0]);

    this.rotation.copy(decom[2]);
    this.rotation.x = -this.rotation.x;
    this.rotation.y = -this.rotation.y;
    this.rotation.z = -this.rotation.z;
    // ...
  }

  getViewMatrix() {
    if (this.update) {
      this.view.identity();

      this.view.rotateEuler(this.rotation.getNegated());
      this.view.translate(this.position.getNegated());

      this.update = false;
    }

    return this.view;
  }
};

export default Camera3D;
