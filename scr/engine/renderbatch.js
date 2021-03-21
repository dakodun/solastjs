import RenderBatchData from './renderbatchdata.js'
import VBO from './vbo.js'
import VBOSegment from './vbosegment.js'

function renderDataSort(first, second) {
  let result = 1;
	if (first.pass < second.pass) {
		result = -1;
	}
	else if (first.pass == second.pass) {
		if (first.textureID < second.textureID) {
      result = -1;
    }
    else if (first.textureID == second.textureID) {
      result = 0;
    }
  }

  return result;
};

class RenderBatch {
	constructor() {
    this.renderData = new Array();
		this.vbo = new VBO();
	}
	
	add(renderable, pass) {
    if (pass == undefined) {
      this.add(renderable, 0);
    }
    else {
      this.vbo.init();

      let renderableData = renderable.getRenderBatchData();
      for (let r of renderableData) {
        r.pass = pass;
        this.renderData.push(r);
      }
    }
  }

  upload() {
    if (this.renderData.length != 0) {
      let vertices = new Array();
      let indices = new Array();
      let segments = new Array();
      let vertexCount = 0;

      this.renderData.sort(renderDataSort);

      // info for the current vbo segment
      let currPass = this.renderData[0].pass;
      let currTexID = this.renderData[0].textureID;
      let currCount = 0;
      let currOffset = 0;

      for (let r of this.renderData) {
        for (let i = 0; i < r.indices.length; ++i) {
          r.indices[i] += vertexCount;
        }

        vertexCount += r.vertices.length;

        // if we need to start a new vbo segment...
        if (r.pass != currPass || r.textureID != currTexID) {
          segments.push(new VBOSegment(currPass, currTexID,
              currCount, currOffset));

          currPass = r.pass;
          currTexID = r.textureID;
          currOffset += currCount;
          currCount = 0;
        }

        currCount += r.indices.length;

        vertices = vertices.concat(r.vertices);
        indices = indices.concat(r.indices);
      }

      segments.push(new VBOSegment(currPass, currTexID,
          currCount, currOffset));

      let byteSize = 24;
      let buffer = new ArrayBuffer(byteSize * vertices.length);
      let dv = new DataView(buffer);
      for (let i = 0; i < vertices.length; ++i) {
        let v = vertices[i];

        dv.setFloat32(byteSize * i, v.x, true);
        dv.setFloat32((byteSize * i) + 4, v.y, true);
        dv.setFloat32((byteSize * i) + 8, v.z, true);

        dv.setUint8((byteSize * i) + 12, v.r);
        dv.setUint8((byteSize * i) + 13, v.g);
        dv.setUint8((byteSize * i) + 14, v.b);
        dv.setUint8((byteSize * i) + 15, v.a);

        dv.setUint16((byteSize * i) + 16, v.s, true);
        dv.setUint16((byteSize * i) + 18, v.t, true);

        dv.setUint8((byteSize * i) + 20, v.textureFlag);
        dv.setUint8((byteSize * i) + 21, v.flag2);
        dv.setUint8((byteSize * i) + 22, v.flag3);
        dv.setUint8((byteSize * i) + 23, v.flag4);
      }

      this.vbo.addData(buffer, indices, segments);
      this.renderData.splice(0, this.renderData.length);
    }
  }

  draw(shader, pass) {
    this.vbo.draw(shader, pass);
  }
};

export default RenderBatch;
