import GL from './gl.js'
import GLStates from './glstates.js'

class Shader {
  constructor() {
    this.programID = 0;

    this.vertSrc = null;
    this.fragSrc = null;
    
    this.projectionMatrixLocation = null;
		this.viewMatrixLocation = null;
		this.modelMatrixLocation = null;

    this.textureLocation = null;

    this.vertexPosition = null;
    this.vertexColor = null;
    this.vertexTexture = null;
    this.vertexFlags = null;
  }

  linkProgram() {
    this.init();

    let vertShaderID = 0;
    let vertAttached = false;
    if (this.vertSrc) {
      vertShaderID = GL.createShader(GL.VERTEX_SHADER);
      GL.shaderSource(vertShaderID, this.vertSrc);
      GL.compileShader(vertShaderID);

      if (GL.getShaderParameter(vertShaderID, GL.COMPILE_STATUS)) {
        GL.attachShader(this.programID, vertShaderID);
        vertAttached = true;
      }
      else {
        console.log("compilation of the vertex shader failed: " +
            GL.getShaderInfoLog(vertShaderID));
      }
    }

    let fragShaderID = 0;
    let fragAttached = false;
    if (this.fragSrc) {
      fragShaderID = GL.createShader(GL.FRAGMENT_SHADER);
      GL.shaderSource(fragShaderID, this.fragSrc);
      GL.compileShader(fragShaderID);

      if (GL.getShaderParameter(fragShaderID, GL.COMPILE_STATUS)) {
        GL.attachShader(this.programID, fragShaderID);
        fragAttached = true;
      }
      else {
        console.log("compilation of the fragment shader failed: " +
            GL.getShaderInfoLog(fragShaderID));
      }
    }

    GL.linkProgram(this.programID);

    if (vertShaderID) {
      if (vertAttached) {
        GL.detachShader(this.programID, vertShaderID);
      }

      GL.deleteShader(vertShaderID);
    }

    if (fragShaderID) {
      if (fragAttached) {
        GL.detachShader(this.programID, fragShaderID);
      }

      GL.deleteShader(fragShaderID);
    }

    if (!GL.getProgramParameter(this.programID, GL.LINK_STATUS)) {
      console.log("linking of the program failed: " +
          GL.getProgramInfoLog(this.programID));
    }
  }

  useProgram() {
    GL.useProgram(this.programID);
  }

  setVertexSrc(shaderStr) {
    this.vertSrc = shaderStr;
  }

  setFragmentSrc(shaderStr) {
    this.fragSrc = shaderStr;
  }

  initCallback() {
    this.init();
    this.useProgram();

    this.projectionMatrixLocation =
        GL.getUniformLocation(this.programID, "vertProj");
		this.viewMatrixLocation =
        GL.getUniformLocation(this.programID, "vertView");
		this.modelMatrixLocation =
        GL.getUniformLocation(this.programID, "vertModel");

    this.textureLocation =
        GL.getUniformLocation(this.programID, "fragBaseTex");
	  GL.uniform1i(this.textureLocation, 0);
    
    this.vertexPosition =
        GL.getAttribLocation(this.programID, "vertXYZ");
    this.vertexColor =
        GL.getAttribLocation(this.programID, "vertRGBA");
    this.vertexTexture =
        GL.getAttribLocation(this.programID, "vertST");
    this.vertexFlags =
        GL.getAttribLocation(this.programID, "vertFlags");
  }

  vaCallback() {
      GL.enableVertexAttribArray(this.vertexPosition);
      GL.enableVertexAttribArray(this.vertexColor);
      GL.enableVertexAttribArray(this.vertexTexture);
      GL.enableVertexAttribArray(this.vertexFlags);

      let byteSize = 24;
      GL.vertexAttribPointer(this.vertexPosition, 3, GL.FLOAT,
          false, byteSize, 0);
      GL.vertexAttribPointer(this.vertexColor, 4, GL.UNSIGNED_BYTE,
          true, byteSize, 12);
      GL.vertexAttribPointer(this.vertexTexture, 2, GL.UNSIGNED_SHORT,
          true, byteSize, 16);
      GL.vertexAttribPointer(this.vertexFlags, 4, GL.UNSIGNED_BYTE,
          true, byteSize, 20);
  }

  renderCallback() {
    GL.uniformMatrix4fv(this.projectionMatrixLocation, false,
        GLStates.projectionMatrix.asArr());
    GL.uniformMatrix4fv(this.viewMatrixLocation, false,
        GLStates.viewMatrix.asArr());
    GL.uniformMatrix4fv(this.modelMatrixLocation, false,
        GLStates.modelMatrix.asArr());
  }

  init() {
    if (this.programID == 0) {
      this.programID = GL.createProgram();
    }
  }
};

export default Shader;
