import { GameObject } from '../objects/GameObject';
import { Image } from './Image';

export class AsciiImage extends Image {
  constructor(
    public strings: string[] = [''],
  ) {
    super();
    this._strings = strings;
  }

  get width(): number {
    return this._strings.reduce((max, str) => Math.max(max, str.length), 0);
  }

  get height(): number {
    return this._strings.length;
  }

  set setImage(strings: string[]) {
    if (Array.isArray(strings)) {
      this._strings = strings;
    } else {
      console.error('setImage expects an array of strings.');
    }
  }

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject.image = this;
    }
  }

  // render(): string[] {
  //   return this._strings;
  // }
}
