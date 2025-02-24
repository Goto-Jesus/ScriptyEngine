import { Size } from "../utils/Size.ts";
import { Vector2D } from "../utils/Vector2D.ts";

import { generateArea } from "../ilbs/generates/generateArea.ts";

import { GameObject } from "./GameObject.js";

import { AsciiImage } from "./Components/Image.js";
import { Animation } from "./Components/Animation.js";
import { BoxCollider2D } from "./components/Collider.js";
import { Rigidbody2D } from "./Components/RigidBody2D.js";

export class SceneManager {
  constructor() {
    this.gameObjects = [];
    this.colliders = [];
    this.rigidbodys = [];
  }

  addObject(gameObject = new GameObject()) {
    this.gameObjects.push(gameObject);
  }

  removeObject(gameObject = new GameObject()) {
    const index = this.gameObjects.indexOf(gameObject);

    if (index > -1) {
      this.gameObjects = this.gameObjects.filter((_, i) => i !== index);
    }
  }

  createObject(config = {}) {
    const {
      name = "gameObject",
      position = Vector2D.zero,
      animation = null,
      collider = null,
      rigidbody = null,
      image = null,
      customComponents = [],
    } = config;

    const newObject = new GameObject(name);

    newObject.setPosition(position);

    if (image) {
      newObject.addComponent(new AsciiImage(image));
    }

    if (animation) {
      const { images, delay = 15, reverse = false } = animation;

      newObject.addComponent(new Animation(images, delay, reverse));
    }

    if (collider) {
      const { size, localPosition, physicMaterial } = collider;

      const newCollider = new BoxCollider2D(
        size,
        localPosition || Vector2D.zero,
        physicMaterial,
      );

      newObject.addComponent(newCollider);
      this.colliders.push(newCollider);
    }

    if (rigidbody) {
      const newRb = new Rigidbody2D();
      newRb.colliders = this.colliders;
      this.rigidbodys.push(newRb);
      newObject.addComponent(newRb);
    }

    if (customComponents) {
      customComponents.forEach((component) =>
        newObject.addComponent(component)
      );
    }

    this.gameObjects.push(newObject);

    return newObject;
  }

  createArea(config = {}) {
    const {
      name = "boxArea",
      position = Vector2D.zero,
      size = new Size(),
      symbol = "█",
      rigidbody = null,
    } = config;
    const { width, height } = size;

    const newObject = new GameObject(name);
    const newCollider = new BoxCollider2D(size);

    newObject.setPosition(position);
    newObject.addComponent(new AsciiImage(generateArea(width, height, symbol)));
    
    newObject.addComponent(newCollider);
    this.colliders.push(newCollider);

    if (rigidbody) {
      const newRb = new Rigidbody2D();
      newRb.colliders = this.colliders;
      this.rigidbodys.push(newRb);
      newObject.addComponent(newRb);
    }

    this.gameObjects.push(newObject);

    return newObject;
  }
}
