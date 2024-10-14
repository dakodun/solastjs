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
    
    if (width != undefined) {
      img.width = width;
    }

    if (height != undefined) {
      img.height = height;
    }

    img.decode() // returns a promise
      .then(() => { --this.status; });

    return img;
  }

  loadSoundBuffer(src) {
    let soundBuffer = new SoundBuffer();

    ++this.status;

   fetch(src) // returns a promise
      .then((response) => { return response.arrayBuffer(); })
      .then((arrBuffer) => {
        return this.ac.decodeAudioData(
          arrBuffer, (buffer) => { soundBuffer.buffer = buffer; }
        );
      })
      .then(() => { --this.status; });

    return soundBuffer;
  }

  isWorking() {
    if (this.status == 0) {
      return false;
    }

    return true;
  }
};

export default ResourceLoader;
