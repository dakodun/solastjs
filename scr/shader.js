import GL from './gl.js'
import GLStates from './glstates.js'

class Shader {
  constructor() {
    this.programID = null;

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

  init() {
    if (this.programID == null) {
      this.programID = GL.createProgram();
    }
  }

  delete() {
    if (this.programID != null) {
      GL.deleteProgram(this.programID);
      this.programID = null;
    }
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
    let vertSrc = shaderStr;
    if (vertSrc == undefined) {
      vertSrc = `
uniform mat4 vertModel;
uniform mat4 vertView;
uniform mat4 vertProj;

attribute vec3 vertXYZ;
attribute vec4 vertRGBA;
attribute vec2 vertST;
attribute vec4 vertFlags;

varying mediump vec4 fragRGBA;
varying mediump vec2 fragST;
varying mediump float fragTextured;

void main() {
  mat4 mvp = vertProj * vertView * vertModel;
  gl_Position = mvp * vec4(vertXYZ, 1.0);
  
  fragRGBA = vertRGBA;
  fragST = vertST;
  fragTextured = vertFlags.x;
}
`;
    }

    this.vertSrc = vertSrc;
  }

  setFragmentSrc(shaderStr) {
    let fragSrc = shaderStr;
    if (fragSrc == undefined) {
      fragSrc = `
precision mediump float;

uniform sampler2D fragBaseTex;

varying mediump vec4 fragRGBA;
varying mediump vec2 fragST;
varying mediump float fragTextured;

void main() {
  vec4 texColour = clamp(texture2D(fragBaseTex, fragST) +
      (1.0 - fragTextured), 0.0, 1.0);
  gl_FragColor = texColour * vec4(fragRGBA.r, fragRGBA.g,
      fragRGBA.b, fragRGBA.a);
}
`;
    }

    this.fragSrc = fragSrc;
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
      let byteSize = 24;

      if (this.vertexPosition != -1) {
        GL.enableVertexAttribArray(this.vertexPosition);
        GL.vertexAttribPointer(this.vertexPosition, 3, GL.FLOAT,
            false, byteSize, 0);
      }

      if (this.vertexColor != -1) {
        GL.enableVertexAttribArray(this.vertexColor);
        GL.vertexAttribPointer(this.vertexColor, 4, GL.UNSIGNED_BYTE,
            true, byteSize, 12);
      }

      if (this.vertexTexture != -1) {
        GL.enableVertexAttribArray(this.vertexTexture);
        GL.vertexAttribPointer(this.vertexTexture, 2, GL.UNSIGNED_SHORT,
            true, byteSize, 16);
      }

      if (this.vertexFlags != -1) {
        GL.enableVertexAttribArray(this.vertexFlags);
        GL.vertexAttribPointer(this.vertexFlags, 4, GL.UNSIGNED_BYTE,
            true, byteSize, 20);
      }
  }

  renderCallback() {
    GL.uniformMatrix4fv(this.projectionMatrixLocation, false,
        GLStates.projectionMatrix.asArr());
    GL.uniformMatrix4fv(this.viewMatrixLocation, false,
        GLStates.viewMatrix.asArr());
    GL.uniformMatrix4fv(this.modelMatrixLocation, false,
        GLStates.modelMatrix.asArr());
  }
};

export default Shader;
