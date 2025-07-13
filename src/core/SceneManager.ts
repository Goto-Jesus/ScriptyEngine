import { Size } from '../utils/Size';
import { Vector2D } from '../utils/Vector2D';

import { generateArea } from '../libs/generates/generateArea';

import { GameObject } from '../objects/GameObject';
import { AsciiImage } from '../components/AsciiImage';
import { Animation } from '../components/Animation';
import { BoxCollider2D } from '../components/Collider';
import { Rigidbody2D } from '../components/RigidBody2D';

import { Component } from './Component';
import { PhysicMaterial } from './physic/PhysicMaterial';
import { Colors } from '../utils/colors';

interface AreaConfig {
  name?: string;
  position?: { x: number; y: number } | Vector2D;
  size?: { height: number; width: number } | Size;
  symbol?: string;
  rigidbody?: boolean;
}

interface AnimConfig {
  images: string[][];
  amountDelay: number;
  reverse?: boolean | false;
}

interface ObjectConfig {
  name?: string;
  color?: keyof Colors;
  position?: { x: number; y: number } | Vector2D;
  animation?: AnimConfig;
  collider?: {
    size?: { height: number; width: number } | Size;
    localPosition?: { x: number; y: number } | Vector2D;
    physicMaterial?: PhysicMaterial;
  };
  rigidbody?: boolean;
  image?: string[];
  customComponents?: Component[];
}

export class SceneManager {
  constructor(
    public gameObjects: GameObject[] = [],
    public colliders: BoxCollider2D[] = [],
    public rigidbodys: Rigidbody2D[] = [],
  ) {}

  addObject(gameObject = new GameObject()) {
    this.gameObjects.push(gameObject);
  }

  removeObject(gameObject = new GameObject()) {
    const index = this.gameObjects.indexOf(gameObject);

    if (index > -1) {
      this.gameObjects = this.gameObjects.filter((_, i) => i !== index);
    }
  }

  createObject(config: ObjectConfig) {
    const {
      name = 'gameObject',
      position: { x = 0, y = 0 } = Vector2D.zero,
      animation = null,
      color = null,
      collider = null,
      rigidbody = null,
      image = null,
      customComponents = [],
    } = config;

    const newObject = new GameObject(name);

    newObject.setPosition(new Vector2D(x, y));

    if (color) {
      newObject.color = color;
    }

    if (image) {
      newObject.addComponent(new AsciiImage(image));
    }

    if (animation) {
      const { images, amountDelay = 15, reverse = false } = animation;

      newObject.addComponent(new Animation(images, amountDelay, reverse));
    }

    if (collider) {
      const {
        size: { width, height } = {},
        localPosition: { x = 0, y = 0 } = {},
        physicMaterial,
      } = collider;

      const newCollider = new BoxCollider2D(
        new Size(width, height),
        new Vector2D(x, y),
        physicMaterial || null,
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
        newObject.addComponent(component),
      );
    }

    this.gameObjects.push(newObject);

    return newObject;
  }

  createArea(config: AreaConfig) {
    const {
      name = 'boxArea',
      position = { x: 0, y: 0 },
      size = new Size(),
      symbol = '█',
      rigidbody = false,
    } = config;
    const { width, height } = size;

    const newObject = new GameObject(name);
    const newCollider = new BoxCollider2D(size);

    newObject.setPosition(new Vector2D(position.x, position.y));
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
