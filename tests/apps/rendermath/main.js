import APP from './init.js';
import LoadScene from './loadscene.js';

function main() {
  try {
    APP.init("canvas");
    APP.sceneManager.requestChange(new LoadScene());
    APP.sceneManager.change();
    APP.run();
  } catch (e) {
    console.error(e.message);
  }
}

window.onload = function() {
  main();
}
