import { Component } from '../core/Component';

export abstract class Image extends Component {
  protected _strings: string[] = [''];

  get width(): number {
    return 0;
  }

  get height(): number {
    return this._strings.length;
  }

  set setImage(image: string[]) {
    this._strings = image;
  }

  render(): string[] {
    return this._strings;
  }
}
