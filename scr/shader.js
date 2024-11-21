import GL from './gl.js'

class Shader {
  // private fields
    // assign a unique id to a shader object
    static #idCount = BigInt(1);
    
    #program = null;

    #vertSrc = "";
    #fragSrc = "";

    #id = BigInt(0);
  // ... 
  
  constructor() {
    this.uniformLocations   = { };
    this.attributeLocations = { };
  }

  // getters/setters
  get program() { return this.#program; }
  get vertSrc() { return this.#vertSrc; }
  get fragSrc() { return this.#fragSrc; }
  get id() { return this.#id; }

  set vertSrc(vertSrc) {
    if (typeof vertSrc !== 'string') {
      throw new TypeError("Shader (vertSrc): should " +
        "be a String");
    }

    this.#vertSrc = vertSrc;
  }

  set fragSrc(fragSrc) {
    if (typeof fragSrc !== 'string') {
      throw new TypeError("Shader (fragSrc): should " +
        "be a String");
    }

    this.#fragSrc = fragSrc;
  }
  // ...

  init() {
    if (this.#program === null) {
      this.#program = GL.createProgram();
      this.#id = Shader.#idCount++;
    }
  }

  delete() {
    if (this.#program !== null) {
      GL.deleteProgram(this.#program);
      this.#program = null;
      this.#id = BigInt(0);
    }
  }

  copy(other) {
    throw new Error("Shader (copy): can't perform a deep copy of " +
     "a Shader - instead create a new instance and copy over " +
     "properties then re-initialise WebGLShader");
  }

  getCopy() {
    let copy = new Shader();
    copy.copy(this);

    return copy;
  }

  compileAndLink() {
    this.init();

    // vertex shader
    let vertAttached = false;
    let vertShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vertShader, this.vertSrc);
    GL.compileShader(vertShader);

    if (GL.getShaderParameter(vertShader, GL.COMPILE_STATUS)) {
      GL.attachShader(this.#program, vertShader);
      vertAttached = true;
    } else {
      throw new Error("Shader (compileAndLink): compilation of the " +
        "vertex shader failed: " + GL.getShaderInfoLog(vertShader));
    }

    // fragment shader
    let fragAttached = false;
    let fragShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fragShader, this.fragSrc);
    GL.compileShader(fragShader);

    if (GL.getShaderParameter(fragShader, GL.COMPILE_STATUS)) {
      GL.attachShader(this.#program, fragShader);
      fragAttached = true;
    } else {
      throw new Error("Shader (compileAndLink): compilation of the " +
        "fragment shader failed: " + GL.getShaderInfoLog(fragShader));
    }

    GL.linkProgram(this.#program);

    // cleanup
    if (vertAttached) {
      GL.detachShader(this.#program, vertShader);
    }

    if (fragAttached) {
      GL.detachShader(this.#program, fragShader);
    }

    GL.deleteShader(vertShader);
    GL.deleteShader(fragShader);

    if (!GL.getProgramParameter(this.#program, GL.LINK_STATUS)) {
      throw new Error("Shader (compileAndLink): linking of the " +
        "program failed: " + GL.getProgramInfoLog(this.#program));
    }
  }

  useProgram() {
    GL.useProgram(this.#program);
  }

  renderCallback() {
    // called when switching to this shader during rendering,
    // using a vbo and the shader, to bind vertex attributes,
    // specify layout and perform any other setup such as
    // specifying uniform matrices
  }
};

export default Shader;
