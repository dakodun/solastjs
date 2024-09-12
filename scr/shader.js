import GL from './gl.js'
import GLStates from './glstates.js'

import VBOVertex from './vbovertex.js'

class Shader {
  constructor() {
    this.programID = null;

    this.vertSrc = null;
    this.fragSrc = null;
    
    this.projectionMatrixLocation = null;
		this.viewMatrixLocation = null;

    this.textureLocation = null;

    this.vertexPosition = null; // (3 4-byte)
    this.vertexColor = null; // (4 1-byte)
    this.vertexTexture = null; // (2 2-byte)
    this.vertexFlags = null; // (4 1-byte)
    
    // es 1.0
    this.vertexNormal = null; // (3 4-byte)

    // es 3.0
    // this.vertexNormal = null; // (1 4-byte)
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
uniform mat4 vertView;
uniform mat4 vertProj;

attribute vec3 vertXYZ;
attribute vec4 vertRGBA;
attribute vec2 vertST;
attribute vec4 vertFlags;

// es 1.0
attribute vec3 vertNormal;

// es 3.0
// attribute vec4 vertNormal;

varying mediump vec4 fragRGBA;
varying mediump vec2 fragST;

varying mediump float fragTextured;
varying mediump float fragLighting;

varying mediump vec3 fragNormal;

void main() {
  mat4 vp = vertProj * vertView;
  gl_Position = vp * vec4(vertXYZ, 1.0);
  
  fragRGBA = vertRGBA;
  fragST = vertST;

  fragTextured = vertFlags.x;
  fragLighting = vertFlags.y;

  fragNormal = vertNormal;
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
varying mediump float fragLighting;

varying mediump vec3 fragNormal;

void main() {
  vec4 texColor = clamp(texture2D(fragBaseTex, fragST) +
      (1.0 - fragTextured), 0.0, 1.0);
  gl_FragColor = texColor * vec4(fragRGBA.r, fragRGBA.g,
      fragRGBA.b, fragRGBA.a);

  float light = max(1.0 - fragLighting,
      dot(fragNormal, vec3(0.0, 0.0, 1.0)));
  gl_FragColor.rgb *= max(0.1, light);
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
    this.vertexNormal =
        GL.getAttribLocation(this.programID, "vertNormal");
  }

  vaCallback() {
      let v = new VBOVertex();
      let byteSize = v.byteSize;
      let offset = 0;

      if (this.vertexPosition != -1) {
        GL.enableVertexAttribArray(this.vertexPosition);
        GL.vertexAttribPointer(this.vertexPosition, 3, GL.FLOAT,
            false, byteSize, offset);
      } offset += 12;

      if (this.vertexColor != -1) {
        GL.enableVertexAttribArray(this.vertexColor);
        GL.vertexAttribPointer(this.vertexColor, 4, GL.UNSIGNED_BYTE,
            true, byteSize, offset);
      } offset += 4;

      if (this.vertexTexture != -1) {
        GL.enableVertexAttribArray(this.vertexTexture);
        GL.vertexAttribPointer(this.vertexTexture, 2, GL.UNSIGNED_SHORT,
            true, byteSize, offset);
      } offset += 4;

      if (this.vertexFlags != -1) {
        GL.enableVertexAttribArray(this.vertexFlags);
        GL.vertexAttribPointer(this.vertexFlags, 4, GL.UNSIGNED_BYTE,
            true, byteSize, offset);
      } offset += 4;

      // es 1.0
      if (this.vertexNormal != -1) {
        GL.enableVertexAttribArray(this.vertexNormal);
        GL.vertexAttribPointer(this.vertexNormal, 3, GL.FLOAT,
            true, byteSize, offset);
      } offset += 12;
      
      // es 3.0
      /* if (this.vertexNormal != -1) {
        GL.enableVertexAttribArray(this.vertexNormal);
        GL.vertexAttribPointer(this.vertexNormal, 4, GL.INT_2_10_10_10_REV,
            true, byteSize, offset);
      } offset += 4; */
  }

  renderCallback() {
    GL.uniformMatrix4fv(this.projectionMatrixLocation, false,
        Float32Array.from(GLStates.projectionMatrix.arr));
    GL.uniformMatrix4fv(this.viewMatrixLocation, false,
        Float32Array.from(GLStates.viewMatrix.arr));
  }
};

export default Shader;
