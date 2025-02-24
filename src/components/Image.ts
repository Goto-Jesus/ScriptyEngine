import { Component } from "../core/Component";

export class Image extends Component {
  protected _strings: string[] = [""];

  get width(): number {
    return 0;
  }

  get height(): number {
    return 0;
  }

  set setImage(image: string[]) {
    this._strings = image;
  }

  render(): string[] {
    return this._strings;
  }
}

export class AsciiImage extends Image {
  constructor(strings: string[] = [""]) {
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
      console.error("setImage expects an array of strings.");
    }
  }

  attach(gameObject: any) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject.image = this;
    }
  }

  render(): string[] {
    return this._strings;
  }
}
