import { Component } from '../core/Component';
import { Delay } from '../libs/other/Delay';
import { GameObject } from '../objects/GameObject';

export class Animation extends Component {
  private currentFrame: number;
  private loop: boolean;
  private isPaused: boolean;
  private delay: Delay;
  private isReversed: boolean; // або прибрати, якщо не використовується

  constructor(
    public images: string[][] = [],
    public amountDelay: number = 5,
    public reverse: boolean = false,
    public startFrame: number = 0,
  ) {
    super();
    this.images = images;
    this.currentFrame = startFrame;
    this.delay = new Delay(amountDelay);
    this.reverse = reverse;
    this.loop = true;
    this.isPaused = false;
    this.isReversed = false; // або прибрати, якщо не використовується
  }

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject.image = this;
    }
  }

  play(): void {
    this.isPaused = false;
  }

  stop(): void {
    this.isPaused = true;
  }

  setImages(images: string[][]): void {
    if (this.currentFrame >= images.length) {
      this.currentFrame = 0;
    }

    this.images = images;
  }

  render(): string[] {
    if (!this.isPaused) {
      if (!this.reverse) {
        if (this.delay.isActive) {
          this.currentFrame++;
        }

        if (this.currentFrame >= this.images.length) {
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
