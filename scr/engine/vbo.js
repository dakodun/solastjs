import GL from './gl.js'

import VBOSegment from './vbosegment.js'

class VBO {
	constructor() {
    this.vertBufferID = 0;
    this.indexBufferID = 0;

    this.tempIndexCount = 0; // !
    this.segments = new Map();
	}

  init() {
    if (this.vertBufferID == 0) {
      this.vertBufferID = GL.createBuffer();
    }

    if (this.indexBufferID == 0) {
      this.indexBufferID = GL.createBuffer();
    }
  }

  addData(vertices, indices, segments) {
    if (segments == undefined) {
      addData(vertices, indices, [new VBOSegment(0, 0,
          indices.length, 0)]);
    }
    else {
      this.init();

      GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBufferID);
      GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);

      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBufferID);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices), GL.STATIC_DRAW);

      this.tempIndexCount = indices.length; // !
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

  draw(shader, pass) {
    if (this.segments.has(pass)) {
      let segments = this.segments.get(pass);
      for (let s of segments) {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBufferID);
        shader.vaCallback();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBufferID);
        
        shader.useProgram();
        shader.renderCallback();

        GL.bindTexture(GL.TEXTURE_2D, s.textureID);
        GL.drawElements(GL.TRIANGLES, s.count,
            GL.UNSIGNED_SHORT, s.offset * 2);
      }
    }
  }
};

export default VBO;
