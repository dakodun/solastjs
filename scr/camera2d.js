import Mat3 from './mat3.js';
import Mat4 from './mat4.js';
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';

class Camera2D {
	constructor() {
    this.view = new Mat4();
    this.update = false;

    this.position = new Vec2(0.0, 0.0);
    this.origin = new Vec2(0.0, 0.0);
    this.rotation = 0.0;
    this.zoom = 1.0;
	}

	copy(other) {
    this.view = other.view.getCopy();
    this.update = other.update;

    this.position = position.origin.getCopy();
    this.origin = other.origin.getCopy();
    this.rotation = other.rotation;
    this.zoom = other.zoom;
  }

  getCopy() {
    let copy = new Camera2D(); copy.copy(this);
    return copy;
  }

  translate(translation) {
    // create an identity matrix and place at current position
    let mat = new Mat3();
    mat.arr = [     1.0,             0.0, 0.0,
		                0.0,             1.0, 0.0,
		    this.position.x, this.position.y, 1.0
    ];

    // calculate position offset accounting for
    // rotation but not scale
	  mat.rotate(this.rotation);
	  let offset = mat.multVec3(
        new Vec3(-translation.x, -translation.y, 1.0)
    );
	  this.position.x += offset.x; this.position.y += offset.y;

    this.update = true;
  }

  rotate(angleRad) {
    // clip rotation between -2PI and 2PI
    this.rotation = (this.rotation + angleRad) % (2 * Math.PI);
    this.update = true;
  }

  zoom(zoom) {
    // implement
  }

  setPosition(position) {
    // set intial position to the origin and unset the rotation
    // temporarily to allow absolute position to be set via
    // the translate function
    this.position = this.origin.getCopy();
    let tempRotation = this.rotation;
    this.rotation = 0;
    
    this.translate(position);
    
    this.rotation = tempRotation;
  }

  setRotation(angleRad) {
    // implement
  }

  setZoom(zoom) {
    this.zoom = zoom;
    this.update = true;
  }

  setOrigin(origin) {
    this.origin = origin;
    this.update = true;
  }

  getViewMatrix() {
    if (this.update) {
      let transMat = new Mat3();
      transMat.translate(this.position);

      let offset = new Vec2(this.origin.x - this.position.x,
          this.origin.y - this.position.y);
      
      transMat.translate(offset);
      transMat.rotate(this.rotation);
      transMat.scale(new Vec2(this.zoom, this.zoom));
      transMat.translate(offset.getNegated());
      
      this.view.arr[ 0] = transMat.arr[0];
      this.view.arr[ 1] = transMat.arr[1];
      this.view.arr[ 2] = 0.0;
      this.view.arr[ 3] = transMat.arr[2];

      this.view.arr[ 4] = transMat.arr[3];
      this.view.arr[ 5] = transMat.arr[4];
      this.view.arr[ 6] = 0.0;
      this.view.arr[ 7] = transMat.arr[5];

      this.view.arr[ 8] = 0.0;
      this.view.arr[ 9] = 0.0;
      this.view.arr[10] = 1.0;
      this.view.arr[11] = 0.0;

      this.view.arr[12] = transMat.arr[6];
      this.view.arr[13] = transMat.arr[7];
      this.view.arr[14] = 0.0;
      this.view.arr[15] = transMat.arr[8];

      this.update = false;
    }

    return this.view;
  }
};

export default Camera2D;
