import GL from './gl.js'

import VBOSegment from './vbosegment.js'

class VBO {
	constructor() {
    this.vertBufferID = null;
    this.indexBufferID = null;

    this.segments = new Map();
	}

  init() {
    if (this.vertBufferID == null) {
      this.vertBufferID = GL.createBuffer();
    }

    if (this.indexBufferID == null) {
      this.indexBufferID = GL.createBuffer();
    }
  }

  delete() {
    if (this.vertBufferID != null) {
      GL.deleteBuffer(this.vertBufferID);
      this.vertBufferID = null;
    }

    if (this.indexBufferID != null) {
      GL.deleteBuffer(this.indexBufferID);
      this.indexBufferID = null;
    }
  }

  addData(vertices, indices, segments) {
    if (segments == undefined) {
      addData(vertices, indices, [new VBOSegment(0, null, null,
          indices.length, 0)]);
    }
    else {
      this.init();

      GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBufferID);
      GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);

      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBufferID);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices), GL.STATIC_DRAW);

      this.segments.clear();

      for (let s of segments) {
        if (!this.segments.has(s.pass)) {
          this.segments.set(s.pass, []);
        }
        
        let passSeg = this.segments.get(s.pass);
        passSeg.push(s);
      }
    }
  }

  draw(pass) {
    if (this.segments.has(pass)) {
      GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBufferID);
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBufferID);

      let segments = this.segments.get(pass);
      let currShader = null;
      let currTex = null;

      for (let s of segments) {
        if (s.shader.programID != currShader) {
          s.shader.vaCallback();
          s.shader.useProgram();
          s.shader.renderCallback();

          currShader = s.shader.programID;
        }

        if (s.textureID != currTex) {
          GL.bindTexture(GL.TEXTURE_2D, s.textureID);

          currTex = s.textureID;
        }
        
        GL.drawElements(s.renderMode, s.count,
            GL.UNSIGNED_SHORT, s.offset * 2);
      }
    }
  }
};

export default VBO;
