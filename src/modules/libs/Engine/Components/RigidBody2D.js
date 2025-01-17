import { Delay } from "../Other/Delay.js";
import { Vector2D } from "../../../utils/Vector2D.js";
import { BoxCollider2D } from "./Collider.js";
import { Component } from "./Component.js";
import { PhysicMaterial } from "../Physic/PhysicMaterial.js";

class ForceMode {
  // F = ma           =    Force = mass * acceleration
  // a = F/m          =    acceleration = Force / mass
  // p = F*t          =    impulse = Force * time
  // v = (F/m) * t    =    velocity = (Force / mass) * time

  get Force() {}
  get Acceleration() {}
  get Impulse() {}
  get Velocity() {}
}

export class Rigidbody2D extends Component {
  constructor() {
    super();
    this.mass = 10;
    this.drag = 0;
    this.useGravity = true;
    this.isKinematic = false; // Если true, объект не будет подвержен физике

    this.speed = 0;
    this.velocity = Vector2D.zero; // Текущая скорость
    this.acceleration = Vector2D.zero; // Текущее ускорение
    this.force = Vector2D.zero; // Текущая сила
    this.gravity = Vector2D.up.multiply(10); // Гравитация (ускорение вниз)
    this.touchSide = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    this.collider = null;
    this.colliders = [];

    this.delayX = new Delay(0); // Изначально максимальная скорость
    this.delayY = new Delay(0); // Изначально максимальная скорость
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject = this.gameObject;
    this.collider = this.gameObject.getComponent(BoxCollider2D);
    this.collider.isStatic = false;
  }

  applyForce(force = new Vector2D()) {
    this.acceleration = this.acceleration.add(force.divide(this.mass)).round();
  }

  update(deltaTime) {
    const inAir = this.touchSide.bottom === 0;
    const onEdge =
      this.touchSide.bottom === -1 &&
      (this.touchSide.right === -1 || this.touchSide.left === 1);

    if (!this.isKinematic) {
      if ((this.useGravity && inAir) || onEdge) {
        this.applyForce(this.gravity);
      }

      this.velocity = this.velocity.add(this.acceleration);
      this.speed = this.velocity.magnitude();
      const speedX = new Vector2D(this.velocity.x, 0).magnitude();
      const speedY = new Vector2D(0, this.velocity.y).magnitude();

      this.delayY.value = 1 || Math.round(200 / speedX);
      this.delayY.value = 1 || Math.round(200 / speedY);

      if (this.delayX.isActive) {
        this.gameObject.transform.translate(
          new Vector2D(this.velocity.normalize().roundRadius().x, 0)
        );
      }

      if (this.delayY.isActive) {
        this.gameObject.transform.translate(
          new Vector2D(0, this.velocity.normalize().roundRadius().y)
        );
      }
    }

    // Проверка коллизий и корректировка позиции
    if (this.collider) {
      this.checkCollisions();
    }
  }

  checkCollisions() {
    // Получить список всех других коллайдеров в сцене
    const colliders = this.getColliders();
    const overlapSpace = 1;
    const collisionColliders = [];

    this.touchSide = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    this.touchSideSecond = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    for (const collider of colliders) {
      if (
        // collider.isStatic &&
        collider !== this.collider &&
        this.collider.checkCollision(collider, overlapSpace)
      ) {
        const { rollback, overlap } = this.collider.getOverlap(
          collider,
          overlapSpace
        );

        getTouch(this.touchSide, rollback);
        getTouch(this.touchSideSecond, overlap);

        collisionColliders.push(collider);
      }
    }

    if (
      this.touchSide.bottom !== 0 ||
      this.touchSide.right !== 0 ||
      this.touchSide.left !== 0 ||
      this.touchSide.top !== 0
    ) {
      this.resolveCollision();

      const mySet = new Set();

      collisionColliders.forEach((c) => {
        mySet.add(this.calculatePhysicCollision(c));
      });

      const bounciness = [...mySet][0];

      // Горизонтальное столкновение
      if (
        this.touchSideSecond.left >= 1 ||
        this.touchSideSecond.right <= -1 ||
        this.touchSide.left >= 1 ||
        this.touchSide.right <= -1
      ) {
        this.velocity.x = 0;
        this.acceleration.x *= bounciness;
      }

      // Вертикальное столкновение
      if (
        this.touchSideSecond.top >= 1 ||
        this.touchSideSecond.bottom <= -2 ||
        this.touchSide.top >= 1 ||
        this.touchSide.bottom <= -2
      ) {
        this.velocity.y = 0;
        this.acceleration.y *= bounciness;
      }
    }
  }

  resolveCollision() {
    let currentOverlap = new Vector2D();

    // ygol
    if (
      this.touchSide.top >= 1 &&
      this.touchSide.bottom < 0 &&
      (this.touchSide.left >= 2 || this.touchSide.right <= -2)
    ) {
      this.gameObject.transform.position.y--;
    }

    // fff
    if (this.touchSide.bottom === -2 && this.touchSide.top >= 1) {
      if (this.touchSide.left === 0 && this.touchSideSecond.left >= 1) {
        this.gameObject.transform.position.x++;
      }
      if (this.touchSide.right === 0 && this.touchSideSecond.right <= -1) {
        this.gameObject.transform.position.x--;
      }
    }

    // simple
    if (this.touchSide.top > 0) {
      this.gameObject.transform.position.y--;
    }
    if (this.touchSide.bottom < 0) {
      this.gameObject.transform.position.y++;
    }
    if (this.touchSide.left > 0) {
      this.gameObject.transform.position.x--;
    }
    if (this.touchSide.right < 0) {
      this.gameObject.transform.position.x++;
    }

    currentOverlap.x = this.touchSide.right + this.touchSide.left;
    currentOverlap.y = this.touchSide.bottom + this.touchSide.top;

    // if (this.gameObject.name === "player") {
    //   console.log("rollback", this.touchSide);
    //   console.log("overlap_", this.touchSideSecond);
    // }

    this.gameObject.transform.translate(currentOverlap);
  }

  calculatePhysicCollision(otherCollider = new BoxCollider2D()) {
    const { physicMaterial } = this.collider;

    let bounciness = 0;

    if (physicMaterial) {
      let otherPM = otherCollider.physicMaterial || new PhysicMaterial();
      bounciness = -physicMaterial.combineBounciness(otherPM);
    }

    return bounciness;
  }

  getColliders() {
    return this.colliders;
  }
}

function getTouch(touch, vector) {
  if (vector.y > touch.top) {
    touch.top = vector.y;
  }
  if (vector.y < touch.bottom) {
    touch.bottom = vector.y;
  }
  if (vector.x > touch.left) {
    touch.left = vector.x;
  }
  if (vector.x < touch.right) {
    touch.right = vector.x;
  }
}
