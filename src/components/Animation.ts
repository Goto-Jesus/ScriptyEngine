import { Component } from "../core/Component.ts";
import { Delay } from "../libs/other/Delay.ts";

export class Animation extends Component {
  constructor(
    images: Image[] = [new Image()],
    delay = 5,
    reverse = false,
    startFrame = 0
  ) {
    super();
    this.images = images;
    this.currentFrame = startFrame;
    this.delay = new Delay(delay);
    this.reverse = reverse;
    this.loop = true;
    this.isReversed;
    this.isPaused = false;
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject.image = this;
  }

  play() {
    this.isPaused = false;
  }

  stop() {
    this.isPaused = true;
  }

  setImages(images) {
    if (images.length < this.currentFrame) {
      this.currentFrame = 0;
    }

    this.images = images;
  }

  render() {
    if (!this.isPaused) {
      if (!this.reverse) {
        if (this.delay.isActive) {
          this.currentFrame++;
        }

        if (this.currentFrame === this.images.length) {
          this.currentFrame = 0;
        }
      } else {
        if (this.delay.isActive) {
          this.currentFrame--;
        }

        if (this.currentFrame < 0) {
          this.currentFrame = this.images.length - 1;
        }
      }
    }

    return this.images[this.currentFrame];
  }
}
