import GLStates from './glstates.js'

import Renderable from './renderable.js'
import RenderBatchData from './renderbatchdata.js'
import VBO from './vbo.js'
import VBOSegment from './vbosegment.js'

function renderDataSort(first, second) {
  let result = 1;

	if (first.pass < second.pass) {
		result = -1;
	} else if (first.pass === second.pass) {
    if (first.depthSort === true && first.depth < second.depth) {
      result = -1;
    } else if ((first.depthSort === true && first.depth === second.depth) ||
        first.depthSort !== true) {

      if (first.shader.programID < second.shader.programID) {
        result = -1;
      } else if (first.shader.programID === second.shader.programID) {
        if (first.textureID < second.textureID) {
          result = -1;
        } else if (first.textureID === second.textureID) {
          if (first.renderMode < second.renderMode) {
            result = -1;
          } else if (first.renderMode === second.renderMode) {
            result = 0;
          }
        }
      }
    }
  }

  return result;
};

class RenderBatch {
	constructor() {
    this.renderData = new Array();
		this.vbo = new VBO();

    this.depthSort = new Array();
	}

  delete() {
    this.vbo.delete();
  }
	
	add(renderable, pass = 0) {
    if (!(renderable instanceof Renderable)) {
      throw new TypeError("RenderBatch (add): renderable " +
      "should be a Renderable");
    }

    this.vbo.init();

    if (this.depthSort[pass] === undefined) {
      this.depthSort[pass] = false;
    }

    let data = renderable.asData();
    for (let r of data) {
      let d = new RenderBatchData();

      if (r.shader === null) {
        r.shader = GLStates.defaultShader;
      }
      
      r.pass = pass;

      if (this.depthSort[pass]) {
        r.depthSort = true;
      }

      this.renderData.push(r);
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
      let currShader = this.renderData[0].shader;
      let currTexID = this.renderData[0].textureID;
      let currRenderMode = this.renderData[0].renderMode;
      let currCount = 0;
      let currOffset = 0;

      for (let r of this.renderData) {
        for (let i = 0; i < r.indices.length; ++i) {
          r.indices[i] += vertexCount;
        }

        vertexCount += r.vertices.length;

        // if we need to start a new vbo segment...
        if (r.pass != currPass || r.shader != currShader ||
            r.textureID != currTexID || r.renderMode != currRenderMode) {
        
          segments.push(new VBOSegment(currPass, currShader, currTexID,
              currRenderMode, currCount, currOffset));

          currPass = r.pass;
          currShader = r.shader;
          currTexID = r.textureID;
          currRenderMode = r.renderMode;
          currOffset += currCount;
          currCount = 0;
        }

        currCount += r.indices.length;

        vertices = vertices.concat(r.vertices);
        indices = indices.concat(r.indices);
      }

      segments.push(new VBOSegment(currPass, currShader, currTexID,
          currRenderMode, currCount, currOffset));

      // get the size of the vertex object from the first one
      // in the array
      let byteSize = 0;
      if (vertices.length > 0) {
        byteSize = vertices[0].byteSize;
      }

      let buffer = new ArrayBuffer(byteSize * vertices.length);
      let dv = new DataView(buffer);
      for (let i = 0; i < vertices.length; ++i) {
        const v = vertices[i];
        v.toBuffer(dv, i);
      }

      this.vbo.addData(buffer, indices, segments);
      this.renderData.splice(0, this.renderData.length);
    }
  }

  draw(pass = 0) {
    this.vbo.draw(pass);
  }

  setDepthSort(pass, enabled) {
    if (this.depthSort[pass] !== enabled) {
      for (let r of this.renderData) {
        r.depthSort = enabled;
      }

      this.depthSort[pass] = enabled;
    }
  }
};

export default RenderBatch;
