import GLStates from './glstates.js'

import Renderable from './renderable.js'
import RenderBatchData from './renderbatchdata.js'
import VBO from './vbo.js'
import VBOSegment from './vbosegment.js'

class RenderBatch {
	constructor() {
    this.renderData = new Array();
		this.vbo = new VBO();

    this.depthSort = new Array();
	}

  delete() {
    this.vbo.delete();
  }
	
	add(renderBase, pass = 0) {
    let renderable = renderBase.renderable

    if (!(renderable instanceof Renderable)) {
      throw new TypeError("RenderBatch (add): renderBase should " +
      "have a 'renderable' field, which should be a Renderable");
    }

    this.vbo.init();

    if (this.depthSort[pass] === undefined) {
      this.depthSort[pass] = false;
    }

    let data = renderable.asData(renderBase);

    for (const datum of data) {
      let rbd = datum.getCopy();

      rbd.pass = pass;

      if (rbd.shaderRef === null) {
        rbd.shaderRef = GLStates.defaultShader;
      }
      
      if (this.depthSort[pass]) {
        rbd.depthSort = true;
      }

      this.renderData.push(rbd);
    }
  }

  upload() {
    if (this.renderData.length !== 0) {
      let vertices = new Array();
      let indices = new Array();
      let segments = new Array();
      let vertexCount = 0;

      // 1. sort the data first by pass
      // 2. then sort by depth only if depth sorting is enabled
      // 3. then sort by shader id
      // 4. then sort by texture id (group non-textured)
      // 5. and finally sort by render mode
      this.renderData.sort((first, second) => {
        let dsort = this.depthSort[first.pass];

        // assign a null texture reference as id 0
        let firstTex = (first.textureRef === null) ?
          0 : first.textureRef.id;
        let secondTex = (second.textureRef === null) ?
          0 : second.textureRef.id;

        return (first.pass < second.pass) ? -1 :
          (first.pass > second.pass) ? 1 :
        
          (dsort && first.depth < second.depth) ? -1 :
            (dsort && first.depth > second.depth) ? 1 :
          
          (first.shaderRef.id < second.shaderRef.id) ? -1 :
            (first.shaderRef.id > second.shaderRef.id) ? 1 :
          
          (firstTex < secondTex) ? -1 :
            (firstTex > secondTex) ? 1 :
          
          (first.renderMode < second.renderMode) ? -1 :
            (first.renderMode > second.renderMode) ? 1 : 0;
      });

      // info for the current vbo segment
      let currPass = this.renderData[0].pass;
      let currRenderMode = this.renderData[0].renderMode;
      let currShader = this.renderData[0].shaderRef;
      let currTex = this.renderData[0].textureRef;
      let currCount = 0;
      let currOffset = 0;

      for (let r of this.renderData) {
        for (let i = 0; i < r.indices.length; ++i) {
          r.indices[i] += vertexCount;
        }

        vertexCount += r.vertices.length;

        if (r.pass !== currPass || r.shaderRef !== currShader ||
          r.textureRef !== currTex || r.renderMode !== currRenderMode) {
          // something changed from previous segment so we need to
          // start a new segment

          segments.push(new VBOSegment(currPass, currShader, currTex,
              currRenderMode, currCount, currOffset));

          currPass = r.pass;
          currRenderMode = r.renderMode;
          currShader = r.shaderRef;
          currTex = r.textureRef;
          currOffset += currCount;
          currCount = 0;
        }

        currCount += r.indices.length;

        vertices = vertices.concat(r.vertices);
        indices = indices.concat(r.indices);
      }

      segments.push(new VBOSegment(currPass, currShader, currTex,
          currRenderMode, currCount, currOffset));

      // get the size of the vertex object from the first one
      // in the array
      let byteSize = 0;
      if (vertices.length > 0) {
        byteSize = vertices[0].constructor.byteSize;
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
