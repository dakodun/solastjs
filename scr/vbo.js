import GL from './gl.js'

import VBOSegment from './vbosegment.js'

class VBO {
	constructor() {
    this.vertBuffer = null;
    this.indexBuffer = null;

    this.segments = new Map();
	}

  init() {
    if (this.vertBuffer === null) {
      this.vertBuffer = GL.createBuffer();
    }

    if (this.indexBuffer === null) {
      this.indexBuffer = GL.createBuffer();
    }
  }

  delete() {
    if (this.vertBuffer !== null) {
      GL.deleteBuffer(this.vertBuffer);
      this.vertBuffer = null;
    }

    if (this.indexBuffer !== null) {
      GL.deleteBuffer(this.indexBuffer);
      this.indexBuffer = null;
    }
  }

  addData(vertices, indices, segments =
    [new VBOSegment(0, null, null, indices.length, 0)]) {

    this.init();

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
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

  draw(pass) {
    if (this.segments.has(pass)) {
      GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBuffer);
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

      let segments = this.segments.get(pass);
      let currShader = null;
      let currTex = null;

      for (let s of segments) {
        if (s.shaderRef !== currShader) {
          s.shaderRef.useProgram();
          s.shaderRef.renderCallback();

          currShader = s.shaderRef;
        }

        if (s.textureRef !== currTex) {
          GL.bindTexture(GL.TEXTURE_2D, s.textureRef);

          currTex = s.textureRef;
        }
        
        GL.drawElements(s.renderMode, s.count,
            GL.UNSIGNED_SHORT, s.offset * 2);
      }
    }
  }
};

export default VBO;
