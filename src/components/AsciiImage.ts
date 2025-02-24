import { Component } from "../core/Component.ts";

export class Image extends Component {
  get width() {}
  get height() {}
  set setImage(image) {}
  render() {}
}

export class AsciiImage extends Image {
  constructor(strings = [""]) {
    super();
    this.strings = strings;
  }

  get width() {
    let result = 0;

    this.strings.forEach((str) => {
      if (result < str.length) {
        result = str.length;
      }
    });

    return result;
  }

  get height() {
    return this.strings.length;
  }

  set setImage(strings = new AsciiImage()) {
    this.strings = strings;
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject.image = this;
  }

  render() {
    return this.strings;
  }
}
