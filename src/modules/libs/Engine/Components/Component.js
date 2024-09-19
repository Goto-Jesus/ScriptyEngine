export class Component {
  constructor() {
    this.gameObject = null;
  }

  attach(gameObject) {
    this.gameObject = gameObject;
  }
}
