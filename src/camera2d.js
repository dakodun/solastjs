import Mat3 from './mat3.js';
import Mat4 from './mat4.js';
import Vec2 from './vec2.js';
import Vec3 from './vec3.js';

class Camera2D {
  // private fields
    #view = new Mat4();
  // ...

	constructor() {
    this.update = false;

    this.position = new Vec2(0.0, 0.0);
    this.origin = new Vec2(0.0, 0.0);

    this.transMat = new Mat3();
    this.scale = new Vec2(1.0, 1.0);
    this.rotation = 0;

	}

  // getters/setters
  get view() {
    this.#updateView()
    return this.#view;
  }
  // ...

	copy(other) {
    this.#view = other.#view.getCopy();
    this.update = other.update;

    this.position = position.origin.getCopy();
    this.origin = other.origin.getCopy();

    this.transMat = other.transMat.getCopy();
    this.zoom = other.zoom;
    this.rotation = other.rotation;
  }

  getCopy() {
    let copy = new Camera2D(); copy.copy(this);
    return copy;
  }

  setPosition(position) {
    this.position.copy(position);
    this.update = true;
  }

  setRotation(angle) {
    this.rotation = angle;
    this.update = true;
  }

  setScale(scale) {
    this.scale.copy(scale);
    this.update = true;
  }

  setOrigin(origin) {
    this.origin.copy(origin);
    this.update = true;
  }

  #updateView() {
    if (this.update) {
      let transMat = this.transMat.getCopy();

      // transMat.translate(this.position.getNegated());

      let offset = new Vec2(this.origin.x - this.position.x,
          this.origin.y - this.position.y);
      
      transMat.translate(offset);

      transMat.translate(this.origin);
      transMat.rotate(this.rotation);
      transMat.scale(this.scale);
      transMat.translate(this.origin.getNegated());
      
      // convert our 3d matrix to a 4d matrix by omitting the z component...
      this.#view.identity();
      this.#view.arr[ 0] = transMat.arr[0];
      this.#view.arr[ 1] = transMat.arr[1];
      this.#view.arr[ 3] = transMat.arr[2];

      this.#view.arr[ 4] = transMat.arr[3];
      this.#view.arr[ 5] = transMat.arr[4];
      this.#view.arr[ 7] = transMat.arr[5];

      this.#view.arr[12] = transMat.arr[6];
      this.#view.arr[13] = transMat.arr[7];
      this.#view.arr[15] = transMat.arr[8];
      // ...

      this.update = false;
    }
  }
};

export default Camera2D;
