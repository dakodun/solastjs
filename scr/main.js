import APP from './init.js';
import TestScene from './testscene.js';

function main() {
  try {
    APP.init("canvas");
    APP.sceneManager.requestChange(new TestScene());
    APP.sceneManager.change();
    APP.run();
  } catch (e) {
    console.error(e.message);
  }
}

window.onload = function() {
  main();
}
