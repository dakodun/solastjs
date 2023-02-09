class Sound {
  constructor() {
    this.sndBuffer = null;
  }

  play() {
    let snd = AC.createBufferSource();

    if (this.sndBuffer && this.sndBuffer.buffer) {
      snd.buffer = this.sndBuffer.buffer;
      snd.connect(AC.destination);

      snd.start();
    }

    return snd;
  }
};

export default Sound;
