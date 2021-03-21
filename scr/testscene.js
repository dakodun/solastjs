import APP, {eng, GLStates, GL} from './init.js';

class TestScene extends eng.Scene {
	constructor(name) {
		super(name);

    this.shader = new eng.Shader();

    let vertSrc = `
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

    let fragSrc = `
precision mediump float;

uniform sampler2D fragBaseTex;

varying mediump vec4 fragRGBA;
varying mediump vec2 fragST;
varying mediump float fragTextured;

void main() {
  vec4 texColour = clamp(texture2D(fragBaseTex, fragST) +
      (1.0 - fragTextured), 0.0, 1.0);
  gl_FragColor = texColour * vec4(fragRGBA.x, fragRGBA.y, fragRGBA.z, 1.0);
  
  // gl_FragColor = vec4(fragRGBA.x, fragRGBA.y, fragRGBA.z, 1.0);
}
`;

    this.shader.setVertexSrc(vertSrc);
    this.shader.setFragmentSrc(fragSrc);
    this.shader.linkProgram();
    this.shader.initCallback();

    let tex = APP.resourceManager.textureStore.
        addResource(new eng.Texture(), "res/tst.png");
    tex.resource.loadImage("res/tst.png");

    this.shape = new eng.Shape();
    
    this.shape.depth = -1.0;
    this.shape.color = new eng.Vec3(255, 255, 255);
    this.shape.alpha = 255;

    this.shape.pushVert(new eng.Vec2( 0.0,  0.0));
    this.shape.pushVert(new eng.Vec2(50.0,  0.0));
    this.shape.pushVert(new eng.Vec2(50.0, 50.0));
    this.shape.pushVert(new eng.Vec2( 0.0, 50.0));

    this.shape.setPosition(new eng.Vec2(50.0, 50.0));
    this.shape.setOrigin(new eng.Vec2(25.0, 25.0));
    this.shape.setRotation(Math.PI / 4);
    this.shape.setScale(new eng.Vec2(2.0, 2.0));

    this.shape.pushFrameStrip(tex.resource, 4, 2, 2, 0);

    this.shape.setAnimation([0.5], 0, 3, 1);
    
    this.batch = new eng.RenderBatch();
    this.batch.add(this.shape);
    this.batch.upload();

    this.store = new eng.ResourceStore();
	}

  render(pass) {
    if (pass == 0) {
      GL.clearColor(0.0, 0.0, 0.0, 1.0);
      GL.clearDepth(1.0);
      GL.enable(GL.DEPTH_TEST);
      GL.depthFunc(GL.LEQUAL);

      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

      GLStates.projectionMatrix.ortho(0.0, GL.canvas.clientWidth,
          GL.canvas.clientHeight, 0.0, 0.1, 1000.0);

      GLStates.modelMatrix.identity();
      GLStates.viewMatrix.identity();
    }

    this.batch.draw(this.shader, pass);
	}
	
	input() {
		
	}
	
	process(dt) {
    if (this.shape.process(dt)) {
      this.batch.add(this.shape);
      this.batch.upload();
    }
	}
	
	postProcess(dt, count) {
		
	}
};

export default TestScene;

