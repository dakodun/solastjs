import SoundBuffer from './soundbuffer.js';

class ResourceLoader {
	constructor() {
		this.status = 0;

    this.ac = new OfflineAudioContext(1, 8000, 8000);
	}

  async loadImage(src, width, height) {
    let img = new Image();
    ++this.status;

    img.src = src;
    if ( width !== undefined) {  img.width =  width; }
    if (height !== undefined) { img.height = height; }

    try {
      await img.decode();

      --this.status;
    } catch(e) {
      --this.status;
    }

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

  async loadFontFace(src, family) {
    let font = new FontFace(family, src);
    ++this.status;

    try {
      await font.load();
      document.fonts.add(font);

      --this.status;
    } catch(e) {
      --this.status;
    }

    return font;
  }

  isWorking() {
    if (this.status === 0) {
      return false;
    }

    return true;
  }
};

export default ResourceLoader;
