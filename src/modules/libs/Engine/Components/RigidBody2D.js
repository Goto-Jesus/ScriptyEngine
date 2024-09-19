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

  get Force () {}
  get Acceleration () {}
  get Impulse () {}
  get Velocity () {}
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
    this.overlap = Vector2D.zero;

    this.collider = null;
    this.colliders = [];

    this.delayX = new Delay(0); // Изначально максимальная скорость
    this.delayY = new Delay(0); // Изначально максимальная скорость
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject = this.gameObject;
    this.collider = this.gameObject.getComponent(BoxCollider2D);
  }

  applyForce(force = new Vector2D()) {
    this.acceleration = this.acceleration.add(force.divide(this.mass)).round();
  }

  update(deltaTime) {
    if (this.gameObject.name === "player") {
      console.log("player", this.overlap);
    }

    this.overlap = Vector2D.zero;

    if (!this.isKinematic) {
      // Применяем гравитацию
      if (this.useGravity) {
        this.applyForce(this.gravity);
      }

      this.velocity = this.velocity.add(this.acceleration);
      this.speed = this.velocity.magnitude();
      const speedX = new Vector2D(this.velocity.x, 0).magnitude();
      const speedY = new Vector2D(0, this.velocity.y).magnitude();

      this.delayY.value = Math.round((deltaTime * 10) / speedX);
      this.delayY.value = Math.round((deltaTime * 10) / speedY);

      if (this.delayX.isActive) {
        this.gameObject.transform.translate( new Vector2D(
          this.velocity.normalize().roundRadius().x,
          0,
        ));
      }

      if (this.delayY.isActive) {
        this.gameObject.transform.translate( new Vector2D(
          0,
          this.velocity.normalize().roundRadius().y,
        ));
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

    for (const collider of colliders) {
      if (
        collider !== this.collider &&
        this.collider.checkCollision(collider)
      ) {
        this.resolveCollision(collider);
      }
    }
  }

  resolveCollision(otherCollider = new BoxCollider2D()) {
    // Простая обработка коллизий: остановить движение по оси, на которой произошло столкновение
    const space = 1;
    const { physicMaterial } = this.collider;
    this.overlap = this.collider.getOverlap(otherCollider, space);

    let bounciness = 0;

    if (physicMaterial) {
      let otherPhysicMaterial =
        otherCollider.physicMaterial || new PhysicMaterial();
      bounciness = -physicMaterial.combineBounciness(otherPhysicMaterial);
    }

    if (Math.abs(this.overlap.x) < Math.abs(this.overlap.y)) {
      // Вертикальное столкновение
      this.velocity.y = 0;
      this.acceleration.y *= bounciness;
      this.gameObject.transform.position.y +=
        this.overlap.y > 0 ? this.overlap.y - space : this.overlap.y + space;
    } else {
      // Горизонтальное столкновение
      this.velocity.x = 0;
      this.acceleration.x *= bounciness;
      this.gameObject.transform.position.x +=
        this.overlap.x > 0 ? this.overlap.x - space : this.overlap.x + space;
    }
  }

  getColliders() {
    return this.colliders;
  }
}
