export class Component {
  constructor(
    private gameObject = null,
  ) { }

  attach(gameObject) {
    this.gameObject = gameObject;
  }
}
