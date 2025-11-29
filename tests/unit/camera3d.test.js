import { describe, test, expect } from 'vitest';

import Camera3D from '../../src/camera3d.js';

import Mat4 from '../../src/mat4.js';
import Vec3 from '../../src/vec3.js';

//> Camera3D //
describe("Camera3D", () => {
  //> view //
  describe("view", () => {
    describe("get", () => {
      test("updates view matrix if needed, then returns " + 
      "it (shallow)", () => {
        let cam = new Camera3D();
          cam._position = new Vec3(100, 50, 25);
          cam.update = true;

        let view = cam.view;

        expect(view).toBe(cam.view);

        let expected = [
             1,   0,   0, 0,
             0,   1,   0, 0,
             0,   0,   1, 0,
          -100, -50, -25, 1];

        expect(view._arr.length).toEqual(expected.length);
          view._arr.forEach((e, i) => {
            expect(e).toEqual(expected[i]);
          });
      });
    });

    describe("set", () => {
      test("sets the camera3d's view matrix", () => {
        let view = new Mat4();
        let cam = new Camera3D();
        
        cam.view = view;

        expect(cam._view).toBe(view);
      });

      test("updates the position and rotation properties, and " +
      "indicates no update is necessary", () => {
        let view = new Mat4([
          0.06,  0.9, -0.4, 0,
           0.4,  0.3,  0.8, 0,
           0.9, -0.2, -0.3, 0,
           -36,   -9,   -2, 1
        ]);

        let cam = new Camera3D();
          cam.update = true;
        
        cam.view = view;

        let expected = {
          update: false,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 }
        }

        expect(cam.update).toEqual(expected.update);

        expect(cam._position.x).not.toEqual(expected.position.x);
        expect(cam._position.y).not.toEqual(expected.position.y);
        expect(cam._position.z).not.toEqual(expected.position.z);

        expect(cam._rotation.x).not.toEqual(expected.rotation.x);
        expect(cam._rotation.y).not.toEqual(expected.rotation.y);
        expect(cam._rotation.z).not.toEqual(expected.rotation.z);
      });

      test("throws an error on a type mismatch", () => {
        let cam = new Camera3D();

        expect(() => { cam.view = "string"; }).toThrowError(/Mat4/);
      });
    });
  });

  //> position //
  describe("position", () => {
    describe("get", () => {
      test("returns the camera3d's position (shallow)", () => {
        let cam = new Camera3D();
          cam._position = new Vec3(1, 2, 3);

        let position = cam.position;

        expect(position).toBe(cam._position);
      });
    });

    describe("set", () => {
      test("sets the camera3d's position and indicates an " +
      "update is neccesary", () => {
        let cam = new Camera3D();
          cam.update = false;
        
        let expected = {
          update: true,
          position: { x: 1, y: 2, z: 3 }
        }
        
        cam.position = new Vec3(1, 2, 3);

        expect(cam.update).toEqual(expected.update);

        expect(cam._position._x).toEqual(expected.position.x);
        expect(cam._position._y).toEqual(expected.position.y);
        expect(cam._position._z).toEqual(expected.position.z);
      });

      test("throws an error on a type mismatch", () => {
        let cam = new Camera3D();

        expect(() => { cam.position = "string"; }).toThrowError(/Vec3/);
      });
    });
  });

  //> rotation //
  describe("rotation", () => {
    describe("get", () => {
      test("returns the camera3d's rotation (shallow)", () => {
        let cam = new Camera3D();
          cam._rotation = new Vec3(1, 2, 3);

        let rotation = cam.rotation;

        expect(rotation).toBe(cam._rotation);
      });
    });

    describe("set", () => {
      test("sets the camera3d's rotation and indicates an " +
      "update is neccesary", () => {
        let cam = new Camera3D();
          cam.update = false;
        
        let expected = {
          update: true,
          rotation: { x: 1, y: 2, z: 3 }
        }
        
        cam.rotation = new Vec3(1, 2, 3);

        expect(cam.update).toEqual(expected.update);

        expect(cam._rotation._x).toEqual(expected.rotation.x);
        expect(cam._rotation._y).toEqual(expected.rotation.y);
        expect(cam._rotation._z).toEqual(expected.rotation.z);
      });

      test("throws an error on a type mismatch", () => {
        let cam = new Camera3D();

        expect(() => { cam.rotation = "string"; }).toThrowError(/Vec3/);
      });
    });
  });

  //> copy //
  describe("copy()", () => {
   test("copies all properties from other to this", () => {
      let cam = new Camera3D();
        cam.update = true;
        cam._view = new Mat4([
          1, 2, 3, 4,
          4, 1, 2, 3,
          3, 4, 1, 2,
          2, 3, 4, 1
        ]);
        cam._position = new Vec3(1, 2, 3);
        cam._rotation = new Vec3(4, 5, 6);
      
      let expected = {
        update: true,
        view: {
          arr: [
            1, 2, 3, 4,
            4, 1, 2, 3,
            3, 4, 1, 2,
            2, 3, 4, 1
          ]
        },

        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 4, y: 5, z: 6 }
      }

      let camCopy = new Camera3D();
      camCopy.copy(cam);

      expect(camCopy).not.toBe(cam);

      expect(camCopy.update).toEqual(cam.update);
      expect(camCopy.update).toEqual(expected.update);

      expect(camCopy._view).not.toBe(cam._view);
      expect(camCopy._view._arr.length).toEqual(expected.view.arr.length);
        camCopy._view._arr.forEach((e, i) => {
          expect(e).toEqual(expected.view.arr[i]);
      });

      expect(camCopy._position).not.toBe(cam._position);
        expect(camCopy._position._x).toEqual(cam._position._x);
        expect(camCopy._position._y).toEqual(cam._position._y);
        expect(camCopy._position._z).toEqual(cam._position._z);

      expect(camCopy._rotation).not.toBe(cam._rotation);
        expect(camCopy._rotation._x).toEqual(cam._rotation._x);
        expect(camCopy._rotation._y).toEqual(cam._rotation._y);
        expect(camCopy._rotation._z).toEqual(cam._rotation._z);
    });

    test("throws an error if 'other' is not a Camera3D", () => {
      let cam = new Camera3D();

      expect(() => { cam.copy("string"); }).toThrowError(/Camera3D/);
    });
  });

  //> getCopy //
  describe("getCopy()", () => {
    test("returns a matching copy (deep)", () => {
      let cam = new Camera3D();
        cam.update = true;
        cam._view = new Mat4([
          1, 2, 3, 4,
          4, 1, 2, 3,
          3, 4, 1, 2,
          2, 3, 4, 1
        ]);
        cam._position = new Vec3(1, 2, 3);
        cam._rotation = new Vec3(4, 5, 6);
      
      let expected = {
        update: true,
        view: {
          arr: [
            1, 2, 3, 4,
            4, 1, 2, 3,
            3, 4, 1, 2,
            2, 3, 4, 1
          ]
        },

        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 4, y: 5, z: 6 }
      }

      let camCopy = cam.getCopy();

      expect(camCopy).not.toBe(cam);

      expect(camCopy.update).toEqual(cam.update);
      expect(camCopy.update).toEqual(expected.update);

      expect(camCopy._view).not.toBe(cam._view);
      expect(camCopy._view._arr.length).toEqual(expected.view.arr.length);
        camCopy._view._arr.forEach((e, i) => {
          expect(e).toEqual(expected.view.arr[i]);
      });

      expect(camCopy._position).not.toBe(cam._position);
        expect(camCopy._position._x).toEqual(cam._position._x);
        expect(camCopy._position._y).toEqual(cam._position._y);
        expect(camCopy._position._z).toEqual(cam._position._z);

      expect(camCopy._rotation).not.toBe(cam._rotation);
        expect(camCopy._rotation._x).toEqual(cam._rotation._x);
        expect(camCopy._rotation._y).toEqual(cam._rotation._y);
        expect(camCopy._rotation._z).toEqual(cam._rotation._z);
    });
  });

  //> equals //
  describe("equals()", () => {
    let compare = (modFunc, expected) => {
      let cam = new Camera3D();
        cam.update = true;
        cam._view = new Mat4([
          1, 2, 3, 4,
          4, 1, 2, 3,
          3, 4, 1, 2,
          2, 3, 4, 1
        ]);
        cam._position = new Vec3(1, 2, 3);
        cam._rotation = new Vec3(4, 5, 6);
      
      let camMatch = new Camera3D();
        camMatch.update = true;
        camMatch._view = new Mat4([
          1, 2, 3, 4,
          4, 1, 2, 3,
          3, 4, 1, 2,
          2, 3, 4, 1
        ]);
        camMatch._position = new Vec3(1, 2, 3);
        camMatch._rotation = new Vec3(4, 5, 6);

      expect(cam.equals(camMatch)).toEqual(true);
      modFunc(camMatch);
      expect(cam.equals(camMatch)).toEqual(expected);
    }

    test("is considered equal when all properties match", () => {
      compare(() => { }, true);
    });

    describe("is not considered equal if any property is a " +
    "mismatch", () => {
      test("view", () => {
        compare((cam) => { cam._view = new Mat4(); }, false);
      });

      test("position", () => {
        compare((cam) => { cam._position = new Vec3(); }, false);
      });

      test("rotation", () => {
        compare((cam) => { cam._rotation = new Vec3(); }, false);
      });
    });

    test("disregards if there is an update waiting", () => {
      compare((cam) => { cam.update = false; }, true);
    });

    test("throws an error if 'other' is not a Camera3D", () => {
      let cam = new Camera3D();

      expect(() => { cam.equals("string"); }).toThrowError(/Camera3D/);
    });
  });

  //> setPosition //
  describe.todo("setPosition()", () => {
    // [!] deprecated
  });

  //> setRotation //
  describe.todo("setRotation()", () => {
    // [!] deprecated
  });

  //> translate //
  describe("translate()", () => {
    test("changes position and requests an update", () => {
      let cam = new Camera3D();

      let expected = {
        update: true,
        position: { x: 0, y: 0, z: 0 }
      }

      cam.translate(new Vec3(1, 2, 3));

      expect(cam.update).toEqual(expected.update);

      // don't know what it should be, but it shouldn't be (0, 0, 0)
      expect(cam._position._x).not.toEqual(expected.position.x);
      expect(cam._position._y).not.toEqual(expected.position.y);
      expect(cam._position._z).not.toEqual(expected.position.z);
    });

    test("doesn't request an update if 'direction' is a " +
    "zero vector", () => {
      let cam = new Camera3D();

      let expected = {
        update: false,
      }

      cam.translate(new Vec3(0, 0, 0));

      expect(cam.update).toEqual(expected.update);
    });

    test("sets coordinate that corresponds to 'plane' to zero", () => {
      let cam = new Camera3D();

      let expected = {
        position: { x: 0, y: 0, z: 0 }
      }

      cam.translate(new Vec3(1, 2, 3), Camera3D.Plane.XY |
        Camera3D.Plane.XZ | Camera3D.Plane.YZ);

      expect(cam._position._x).toEqual(expected.position.x);
      expect(cam._position._y).toEqual(expected.position.y);
      expect(cam._position._z).toEqual(expected.position.z);
    });

    test("throws an error if 'direction' is not a Vec3", () => {
      let cam = new Camera3D();

      expect(() => { cam.translate("string"); }).
        toThrowError(/Vec3/);
    });

    test("throws an error if 'plane' is not a Number", () => {
      let cam = new Camera3D();

      expect(() => { cam.translate(new Vec3(), "string"); }).
        toThrowError(/Number/);
    });
  });

  //> lookAt //
  describe("lookAt()", () => {
    test("changes 'view' matrix as well as 'position' and " +
    "'rotation', and indicates no 'update' is necessary", () => {
      let cam = new Camera3D();
        cam.update = true;

      let expected = {
        update: false,
        view: {
          arr: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          ]
        },

        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      }

      cam.lookAt(new Vec3(1, 2, 3), new Vec3(1, 2, 3),
        new Vec3(1, 2, 3));

      expect(cam.update).toEqual(expected.update);

      expect(cam._view._arr).not.toEqual(expected.view.arr);

      // don't know what it should be, but it shouldn't be (0, 0, 0)
      expect(cam._position._x).not.toEqual(expected.position.x);
      expect(cam._position._y).not.toEqual(expected.position.y);
      expect(cam._position._z).not.toEqual(expected.position.z);

      expect(cam._rotation._x).not.toEqual(expected.rotation.x);
      expect(cam._rotation._y).not.toEqual(expected.rotation.y);
      expect(cam._rotation._z).not.toEqual(expected.rotation.z);
    });

    // [!] works with default upVec

    test("throws an error if 'eyeVec' is not a Vec3", () => {
      let cam = new Camera3D();

      expect(() => { cam.lookAt("string"); }).
        toThrowError(/Vec3/);
    });

    test("throws an error if 'centerVec' is not a Vec3", () => {
      let cam = new Camera3D();

      expect(() => { cam.lookAt(new Vec3(), "string"); }).
        toThrowError(/Vec3/);
    });

    test("throws an error if 'upVec' is not a Vec3", () => {
      let cam = new Camera3D();

      expect(() => { cam.lookAt(new Vec3(), new Vec3(), "string"); }).
        toThrowError(/Vec3/);
    });
  });
});
