class ResourceLoader {
	constructor() {
		this.status = 0;
	}

  loadImage(src, width, height) {
    let img = new Image();
    img.src = src;

    if (width != undefined) {
      img.width = width;
    }

    if (height != undefined) {
      img.height = height;
    }

    ++this.status;
    img.addEventListener("load",
        (e) => {--this.status;}, true);
    img.addEventListener("abort",
        (e) => {--this.status;}, true);
    img.addEventListener("error",
        (e) => {--this.status;}, true);

    return img;
  }

  isWorking() {
    if (this.status == 0) {
      return false;
    }

    return true;
  }
};

export default ResourceLoader;
