import Font from './font.js';
import SoundBuffer from './soundbuffer.js';

class ResourceLoader {
	constructor() {
		this.status = 0;

    this.ac = new OfflineAudioContext(1, 8000, 8000);
	}

  loadImage(src, width, height) {
    let img = new Image();
    ++this.status;

    img.src = src;
    if ( width !== undefined) {  img.width =  width; }
    if (height !== undefined) { img.height = height; }

    img.decode()
      .then(() => { --this.status; })
      .catch((error) => {
        console.log(error);
        --this.status;
      });

    return img;
  }

  loadSoundBuffer(src) {
    let soundBuffer = new SoundBuffer();
    ++this.status;

   fetch(src)
      .then((response) => { return response.arrayBuffer(); })
      .then((arrBuffer) => {
        return this.ac.decodeAudioData(
          arrBuffer, (buffer) => { soundBuffer.buffer = buffer; }
        );
      })
      .then(() => { --this.status; })
      .catch((error) => {
        console.log(error);
        --this.status;
      });

    return soundBuffer;
  }

  /* loadFont(src, family) {
    let font = new Font();
    ++this.status;

    font.family = family,
    font.face = new FontFace(family, src);

    font.face.load()
      .then(() => {
        document.fonts.add(font.face);
        --this.status;
      })
      .catch((error) => {
        console.log(error);
        --this.status;
      });
    
    return font;
  } */

  isWorking() {
    if (this.status === 0) {
      return false;
    }

    return true;
  }
};

export default ResourceLoader;
