import APP, { sol, GLStates, GL } from './init.js';

class PickShader {
  _shader = new sol.Shader();

  constructor() {
    this._createPickShader();
  }

  get shader() { return this._shader; }

  _createPickShader() {
    let shader = this._shader;

    shader.vertSrc =
      `#version 300 es
      
      uniform mat4 vertView;
      uniform mat4 vertProj;

      layout(location = 0) in vec3 vertXYZ;
      layout(location = 1) in vec4 vertRGBA;
      layout(location = 2) in vec2 vertST;
      layout(location = 3) in vec4 vertFlags;
      layout(location = 4) in vec4 vertNormal;

      out mediump vec4 fragRGBA;
      out mediump vec3 fragSTL;
      out mediump vec3 fragNormal;

      void main() {
        mat4 vp = vertProj * vertView;
        gl_Position = vp * vec4(vertXYZ, 1.0);
        
        fragRGBA = vertRGBA;
        fragSTL = vec3(vertST, vertFlags.y);
        fragNormal = vertNormal.xyz;
      }`;
    
    shader.fragSrc =
      `#version 300 es
      
      precision mediump float;

      uniform mediump sampler2DArray fragBaseTex;

      in mediump vec4 fragRGBA;
      in mediump vec3 fragSTL;
      in mediump vec3 fragNormal;

      layout(location = 0) out mediump vec4 fragColor;

      void main() {
        vec4 texColor = texture(fragBaseTex, fragSTL);
        fragColor = texColor.a * vec4(fragRGBA.r,
          fragRGBA.g, fragRGBA.b, 1.0);
      }`;

    shader.uniformLocations = {
      projectionMatrix : null,
      viewMatrix       : null,
      texture          : null,
    };

    shader.attributeLocations = {
      vertexPosition : -1, // (3 4-byte)
      vertexColor    : -1, // (4 1-byte)
      vertexTexture  : -1, // (2 4-byte)
      vertexFlags    : -1, // (4 1-byte)
      vertexNormal   : -1, // (1 4-byte)
    };

    shader.renderCallback = function() {
      let byteSize = sol.VBOVertex.byteSize;
      let offset = 0;

      if (this.attributeLocations.vertexPosition !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexPosition);
        GL.vertexAttribPointer(this.attributeLocations.vertexPosition,
            3, GL.FLOAT, false, byteSize, offset);
      }
      
      offset += 12;
      if (this.attributeLocations.vertexColor !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexColor);
        GL.vertexAttribPointer(this.attributeLocations.vertexColor,
            4, GL.UNSIGNED_BYTE, true, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexTexture !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexTexture);
        GL.vertexAttribPointer(this.attributeLocations.vertexTexture,
            2, GL.FLOAT, false, byteSize, offset);
      }
      
      offset += 8;
      if (this.attributeLocations.vertexFlags !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexFlags);
        GL.vertexAttribPointer(this.attributeLocations.vertexFlags,
            4, GL.UNSIGNED_BYTE, false, byteSize, offset);
      }
      
      offset += 4;
      if (this.attributeLocations.vertexNormal !== -1) {
        GL.enableVertexAttribArray(this.attributeLocations.vertexNormal);
        GL.vertexAttribPointer(this.attributeLocations.vertexNormal,
            4, GL.UNSIGNED_INT_2_10_10_10_REV, true, byteSize, offset);
      }
      
      offset += 4;

      GL.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false,
        Float32Array.from(GLStates.projectionMatrix.arr));
      GL.uniformMatrix4fv(this.uniformLocations.viewMatrix, false,
        Float32Array.from(GLStates.viewMatrix.arr));
    }

    shader.compileAndLink();
    shader.useProgram();

    shader.uniformLocations.projectionMatrix =
      GL.getUniformLocation(shader.program, "vertProj");
    shader.uniformLocations.viewMatrix =
      GL.getUniformLocation(shader.program, "vertView");

    shader.uniformLocations.texture =
      GL.getUniformLocation(shader.program, "fragBaseTex");
    GL.uniform1i(shader.textureLocation, 0);
    
    shader.attributeLocations.vertexPosition =
      GL.getAttribLocation(shader.program, "vertXYZ");
    shader.attributeLocations.vertexColor =
      GL.getAttribLocation(shader.program, "vertRGBA");
    shader.attributeLocations.vertexTexture =
      GL.getAttribLocation(shader.program, "vertST");
    shader.attributeLocations.vertexFlags =
      GL.getAttribLocation(shader.program, "vertFlags");
    shader.attributeLocations.vertexNormal =
      GL.getAttribLocation(shader.program, "vertNormal");
  }
};

export default PickShader;
