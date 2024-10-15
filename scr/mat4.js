import Vec3 from './vec3.js';
import Vec4 from './vec4.js';

class Mat4 {
	constructor() {
    /*
    .--COL-MAJOR---.
    | 0   4   8  12|
    | 1   5   9  13|
    | 2   6  10  14|
    | 3   7  11  15|
    '--------------'
    */

    this.arr = new Array();
    this.identity();
	}

	copy(other) {
    if (!(other instanceof Mat4)) {
      throw new TypeError("copy(other): other should be a Mat4");
    }
    
    this.arr = other.arr.slice();
  }

  getCopy() {
    let copy = new Mat4(); copy.copy(this);
    return copy;
  }

  identity() {
    this.arr.splice(0, this.arr.length);
    this.arr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  transpose() {
    let copy = this.getCopy();

    for (var x = 0; x < 4; ++x) {
		  for (var y = 0; y < 4; ++y) {
        this.arr[(x * 4) + y] = copy.arr[(y * 4) + x];
      }
    }
  }

  getTranspose() {
    let transposed = this.getCopy();
    transposed.transpose();

    return transposed;
  }

  ortho(left, right, bottom, top, near, far) {
    /*
    .--ORTHO----------------------------------------------.
    |     2/(r-l)           0            0  -((r+l)/(r-l))|
    |           0     2/(t-b)            0  -((t+b)/(t-b))|
    |           0           0   -2/(f - n)  -((f+n)/(f-n))|
    |           0           0            0               1|
    '-----------------------------------------------------'
    */
    
    this.identity();
    
    let invRL = 1 / (right - left);
    let invTB = 1 / (top - bottom);
    let invFN = 1 / (far - near);

    this.arr[ 0] =  2 * invRL;
    this.arr[ 5] =  2 * invTB;
    this.arr[10] = -2 * invFN;

    this.arr[12] = -(right + left) * invRL;
    this.arr[13] = -(top + bottom) * invTB;
    this.arr[14] =   -(far + near) * invFN;
  }

  perspective(fovy, aspect, near, far) {
    this.identity();

    let top = near * Math.tan(fovy / 2);
    let bottom = -top;
    let left = bottom * aspect;
    let right = top * aspect;
    
    this.frustum(left, right, bottom, top, near, far);
  }

  frustum(left, right, bottom, top, near, far) {
    /*
    .--FRUSTUM---------------------------------------.
    |  2n/(r-l)         0   (r+l)/(r-l)             0|
    |         0  2n/(t-b)   (t+b)/(t-b)             0|
    |         0         0  -(f+n)/(f-n)  -(2fn)/(f-n)|
    |         0         0            -1             0|
    '------------------------------------------------'
    */
    
    this.identity();

    let invRL = 1 / (right - left);
    let invTB = 1 / (top - bottom);
    let invFN = 1 / (far - near);

    this.arr[ 0] = (2 * near) * invRL;
    this.arr[ 5] = (2 * near) * invTB;

    this.arr[ 8] = (right + left) * invRL;
    this.arr[ 9] = (top + bottom) * invTB;
    this.arr[10] =  -(far + near) * invFN;
    this.arr[11] =                     -1;

    this.arr[14] = (-2 * far * near) * invFN;
    this.arr[15] =                         0;
  }

  multMat4(other) {
    if (!(other instanceof Mat4)) {
      throw new TypeError("multMat4(other): other should be a Mat4");
    }

    let result = new Mat4();

    // post multiplication - this row * other column
    for (var x = 0; x < 4; ++x) {
		  for (var y = 0; y < 4; ++y) {
        result.arr[(x * 4) + y] =
          (this.arr[y     ] * other.arr[(x * 4)    ]) +
          (this.arr[y +  4] * other.arr[(x * 4) + 1]) +
          (this.arr[y +  8] * other.arr[(x * 4) + 2]) +
          (this.arr[y + 12] * other.arr[(x * 4) + 3]);
      }
    }
    
    this.arr = result.arr;
  }

  getMultVec4(multVec) {
    /*
    .--MATRIX------.   .-V-.
    | 0   4   8  12|   | 0 |
    | 1   5   9  13|   | 1 |
    | 2   6  10  14| . | 2 |
    | 3   7  11  15|   | 3 |
    '--------------'   '---'
    */
    
    if (!(multVec instanceof Vec4)) {
      throw new TypeError("getMultVec4(multVec): multVec should be a Vec4");
    }

    let arrIn = multVec.asArray();
    let arrOut = new Array();

    for (var i = 0; i < 4; ++i) {
      arrOut[i] =
        (this.arr[i     ] * arrIn[0]) +
        (this.arr[i +  4] * arrIn[1]) +
        (this.arr[i +  8] * arrIn[2]) +
        (this.arr[i + 12] * arrIn[3]);
    }
    
    let result = new Vec4();
    result.fromArray(arrOut);
    return result;
  }

  translate(transVec) {
    /*
    .--TRANSLATE---.
    | 1   0   0  tx|
    | 0   1   0  ty|
    | 0   0   1  tz|
    | 0   0   0   1|
    '--------------'
    */
    
    if (!(transVec instanceof Vec3)) {
      throw new TypeError("translate(transVec): transVec should be a Vec3");
    }

    let transMat = new Mat4();
    transMat.arr[12] = transVec.x;
    transMat.arr[13] = transVec.y;
    transMat.arr[14] = transVec.z;

    this.multMat4(transMat);
  }

  rotateAxis(angle, axis) {
    /*
    .--ROTATION-------------------------------------------------.
    | (1-cosA)(XX)+ cosA  (1-cosA)(XY)-ZsinA  (1-cosA)(XZ)+YsinA|
    | (1-cosA)(XY)+ZsinA  (1-cosA)(YY)+ cosA  (1-cosA)(YZ)-XsinA|
    | (1-cosA)(XZ)-YsinA  (1-cosA)(YZ)+XsinA  (1-cosA)(ZZ)+ cosA|
    '-----------------------------------------------------------'
    */

    if (typeof angle != 'number') {
      throw new TypeError("rotateAxis(angle, axis): angle " +
      "should be a Number");
    }
    else if (!(axis instanceof Vec3)) {
      throw new TypeError("rotateAxis(angle, axis): axis should " +
      "be a Vec3");
    }

    let rotAA = new Mat4();
    
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let t = 1 - c;

    let axisNorm = axis.getNormalized();

    let x = axisNorm.x;
    let y = axisNorm.y;
    let z = axisNorm.z;
    
    rotAA.arr[ 0] = (t * (x * x)) +       c;
    rotAA.arr[ 1] = (t * (x * y)) + (z * s);
    rotAA.arr[ 2] = (t * (x * z)) - (y * s);

    rotAA.arr[ 4] = (t * (x * y)) - (z * s);
    rotAA.arr[ 5] = (t * (y * y)) +       c;
    rotAA.arr[ 6] = (t * (y * z)) + (x * s);

    rotAA.arr[ 8] = (t * (x * z)) + (y * s);
    rotAA.arr[ 9] = (t * (y * z)) - (x * s);
    rotAA.arr[10] = (t * (z * z)) +       c;

    this.multMat4(rotAA);
  }

  rotateEuler(angles) {
    /*
    .--ROLL-----------. .--PITCH----------. .--YAW------------.
    | cosZ  sinZ     0| | cosY     0 -sinY| |    1     0     0|
    |-sinZ  cosZ     0|.|    0     1     0|.|    0  cosX -sinX|
    |    0     0     1| | sinY     0  cosY| |    0  sinX  cosX|
    '-----------------' '-----------------' '-----------------'
    .--ROTATION-----------------------------------------------.
    |              cosZcosY                sinZcosY      -sinY|
    |-sinZcosX-cosZsinYsinX   cosZcosX-sinZsinYsinX  -cosYsinX|
    |-sinZsinX+cosZsinYcosX   cosZsinX+sinZsinYcosX   cosYcosX|
    '---------------------------------------------------------'
    */
    
    if (!(angles instanceof Vec3)) {
      throw new TypeError("rotateEuler(angles): angles should be a Vec3");
    }

    let rotZYX = new Mat4();

    let cX = Math.cos(angles.x);
    let cY = Math.cos(angles.y);
    let cZ = Math.cos(angles.z);

    let sX = Math.sin(angles.x);
    let sY = Math.sin(angles.y);
    let sZ = Math.sin(angles.z);

    rotZYX.arr[ 0] =                     cZ * cY;
    rotZYX.arr[ 1] = (-sZ * cX) - (cZ * sY * sX);
    rotZYX.arr[ 2] = (-sZ * sX) + (cZ * sY * cX);

    rotZYX.arr[ 4] =                     sZ * cY;
    rotZYX.arr[ 5] =  (cZ * cX) - (sZ * sY * sX);
    rotZYX.arr[ 6] =  (cZ * sX) + (sZ * sY * cX);

    rotZYX.arr[ 8] =                         -sY;
    rotZYX.arr[ 9] =                    -cY * sX;
    rotZYX.arr[10] =                     cY * cX;

    this.multMat4(rotZYX);
  }

  scale(scaleVec) {
    /*
    .--SCALE--------.
    | sx   0   0   0|
    |  0  sy   0   0|
    |  0   0  sz   0|
    |  0   0   0   1|
    '---------------'
    */
    
    if (!(scaleVec instanceof Vec3)) {
      throw new TypeError("scale(scaleVec): scaleVec should be a Vec3");
    }
    
    let scaleMat = new Mat4();

    scaleMat.arr[ 0] = scaleVec.x;
    scaleMat.arr[ 5] = scaleVec.y;
    scaleMat.arr[10] = scaleVec.z;

    this.multMat4(scaleMat);
  }

  decompose() {
    // translation...
      let position = new Vec3(
        this.arr[12],
        this.arr[13],
        this.arr[14]
      );
    // ...


    // scaling...
      let sxLen = Math.sqrt(
        this.arr[0] * this.arr[0] +
        this.arr[1] * this.arr[1] +
        this.arr[2] * this.arr[2]
      ); let invSXLen = 1 / sxLen;

      let syLen = Math.sqrt(
        this.arr[4] * this.arr[4] +
        this.arr[5] * this.arr[5] +
        this.arr[6] * this.arr[6]
      ); let invSYLen = 1 / syLen;

      let szLen = Math.sqrt(
        this.arr[ 8] * this.arr[ 8] +
        this.arr[ 9] * this.arr[ 9] +
        this.arr[10] * this.arr[10]
      ); let invSZLen = 1 / szLen;

      let scale = new Vec3(sxLen, syLen, szLen);
    // ...


    // rotation...
      // create a rotation matrix from our matrix
        let rotMat = this.getCopy();

        rotMat.arr[0] *= invSXLen;
        rotMat.arr[1] *= invSXLen;
        rotMat.arr[2] *= invSXLen;

        rotMat.arr[4] *= invSYLen;
        rotMat.arr[5] *= invSYLen;
        rotMat.arr[6] *= invSYLen;

        rotMat.arr[ 8] *= invSZLen;
        rotMat.arr[ 9] *= invSZLen;
        rotMat.arr[10] *= invSZLen;

        rotMat.arr[12] = 0;
        rotMat.arr[13] = 0;
        rotMat.arr[14] = 0;
      // ...

      let rotation = new Vec3();

      if (Math.abs(Math.abs(rotMat.arr[2]) - 1.0) < 1e-15) { // if the value
        // of the rotation matrix at [0, 2] is 1 or -1...

        rotation.z = 0.0;

        if (rotMat.arr[2] < 0.0) {
          rotation.y = Math.PI / 2.0;
          rotation.x = Math.atan2(
            rotMat.arr[4],  rotMat.arr[8]
          ) + rotation.z;
        }
        else {
          rotation.y = -Math.PI / 2.0;
          rotation.x = Math.atan2(
            -rotMat.arr[4], -rotMat.arr[8]
          ) - rotation.z;
        }
      }
      else {
        rotation.y = -Math.asin(rotMat.arr[2]);
        let invCY = 1 / Math.cos(rotation.y);

        rotation.x = Math.atan2(
          (rotMat.arr[ 6] * invCY), (rotMat.arr[10] * invCY)
        );

        rotation.z = Math.atan2(
          (rotMat.arr[ 1] * invCY), (rotMat.arr[ 0] * invCY)
        );
      }
    // ...

    return [position, scale, rotation];
  }

  asString() {
    let matStr = "";

    for (var x = 0; x < 4; ++x) {
		  for (var y = 0; y < 4; ++y) {
        matStr += this.arr[(y * 4) + x];
        matStr += "  ";

        if (y == 3) {
          matStr += "\n";
        }
      }
    }

    return matStr;
  }
};

export default Mat4;
