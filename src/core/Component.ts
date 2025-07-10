import { GameObject } from '../objects/GameObject';

export abstract class Component {
  constructor(public gameObject: GameObject | null = null) {}

  attach(gameObject: GameObject) {
    this.gameObject = gameObject;
  }
}
