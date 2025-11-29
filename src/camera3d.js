import Sol from './sol.js';

import Mat4 from './mat4.js';
import Vec3 from './vec3.js';

class Camera3D {
  // a Camera3D is a 4-dimensional 'view' matrix with
  // properties and methods that apply translations
  // and rotations, creating a camera object that can
  // be moved around a 3-dimensional space

  //> static enums //
  static Plane = {
    YZ : 1,
    XZ : 2,
    XY : 4,
  };

  //> public properties //
  update = false;

  //> internal properties //
  _view = new Mat4();

  _position = new Vec3(0.0, 0.0, 0.0);
  _rotation = new Vec3(0.0, 0.0, 0.0);

  //> constructor //
	constructor() {
    
	}

  //> getters/setters //
  get view() {
    this._updateView();
    return this._view;
  }

  get position() { return this._position; }
  get rotation() { return this._rotation; }

  set view(view) {
    Sol.CheckTypes(this, "set view",
    [{view}, [Mat4]]);

    this._view = view;

    let decom = this._view.decompose();
    this._position = decom[0].getNegated();
    this._rotation = decom[2].getNegated();

    this.update = false;
  }

  set position(position) {
    Sol.CheckTypes(this, "set position",
    [{position}, [Vec3]]);

    this._position = position;
    this.update = true;
  }

  set rotation(rotation) {
    Sol.CheckTypes(this, "set rotation",
    [{rotation}, [Vec3]]);

    this._rotation = rotation;
    this.update = true;
  }

  //> public methods //
	copy(other) {
    Sol.CheckTypes(this, "copy",
    [{other}, [Camera3D]]);

    this.update = other.update;

    this._view = other._view.getCopy();

    this._position = other._position.getCopy();
    this._rotation = other._rotation.getCopy();
  }

  getCopy() {
    let copy = new Camera3D();
    copy.copy(this);

    return copy;
  }

  equals(other) {
    Sol.CheckTypes(this, "equals",
    [{other}, [Camera3D]]);
    
    return (
      this._view.equals(other._view) &&

      this._position.equals(other._position) &&
      this._rotation.equals(other._rotation)
    );
  }

  // [!] deprecated
  setPosition(position) {
    this.position = position;
    
    this.update = true;
  }

  // [!] deprecated
  setRotation(rotation) {
    this.rotation = rotation;
    
    this.update = true;
  }

  translate(direction, plane = 0) {
    // changes the camera position by 'direction' but
    // accounts for current position and any rotation
    // if a plane is specified then the camera moves only
    // in that plane (eg, for xy any z movement is ignored)

    Sol.CheckTypes(this, "translate",
    [{direction}, [Vec3]], [{plane}, [Number]]);

    this._updateView();

    let dist = direction.asArray();

    for (let i = 0; i < 3; ++i) {
      if (Math.abs(dist[i]) > 1e-15) {
        // calculate the axis to move along using the
        // current rotation from view matrix
        // (zero the appropriate coordinate to restrict
        // movement to the required plane)

        let axis = new Vec3(
          ((plane & Camera3D.Plane.YZ) === 0) ?
            this._view.arr[0 + i] : 0,
          ((plane & Camera3D.Plane.XZ) === 0) ?
            this._view.arr[4 + i] : 0,
          ((plane & Camera3D.Plane.XY) === 0) ?
            this._view.arr[8 + i] : 0
        );
        
        axis.normalize();

        this._position.x += axis.x * dist[i];
        this._position.y += axis.y * dist[i];
        this._position.z += axis.z * dist[i];

        this.update = true;
      }
    }
  }

  lookAt(eyeVec, centerVec, upVec = new Vec3(0.0, 1.0, 0.0)) {
    // positions the camera at 'eyeVec' and points it
    // towards 'centerVec', with 'upVec' denoting the
    // vertical axis (by default positive y is up)
    // 
    // .--LOOK-AT-------.
    // | sx  sy  sz -tx |
    // | ux  uy  uz -ty |
    // |-fx -fy -fz -tz |
    // |  0   0   0   1 |
    // '----------------'

    Sol.CheckTypes(this, "translate", [{eyeVec}, [Vec3]],
    [{centerVec}, [Vec3]], [{upVec}, [Vec3]]);

    let f = new Vec3(
      centerVec.x - eyeVec.x,
      centerVec.y - eyeVec.y,
      centerVec.z - eyeVec.z
    );
    
    f.normalize();

    let s = f.getCross(upVec);
    s.normalize();
    let u = s.getCross(f);

    // create the view matrix
    this._view.identity();

    this._view.arr[ 0] = s.x;
    this._view.arr[ 4] = s.y;
    this._view.arr[ 8] = s.z;
    
    this._view.arr[ 1] = u.x;
    this._view.arr[ 5] = u.y;
    this._view.arr[ 9] = u.z;
    
    this._view.arr[ 2] = -f.x;
    this._view.arr[ 6] = -f.y;
    this._view.arr[10] = -f.z;

    this._view.arr[12] = 0;
    this._view.arr[13] = 0;
    this._view.arr[14] = 0;

    this._view.translate(eyeVec.getNegated());

    // get the position and rotation from the matrix
    // (both need to be negated as we're techincally
    // moving the camera in the opposite direction)

    let decom = this._view.decompose();

    this._position = decom[0].getNegated();
    this._rotation = decom[2].getNegated();

    this.update = false;
  }

  //> internal methods //
  _updateView() {
    if (this.update) {
      this._view.identity();

      this._view.rotateEuler(this._rotation.getNegated());
      this._view.translate(this._position.getNegated());

      this.update = false;
    }
  }
};

export default Camera3D;
