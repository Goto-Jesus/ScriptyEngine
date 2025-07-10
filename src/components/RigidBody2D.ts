import { Delay } from '../libs/other/Delay';
import { Vector2D } from '../utils/Vector2D';
import { BoxCollider2D } from '../components/Collider';
import { Component } from '../core/Component';
import { PhysicMaterial } from '../core/physic/PhysicMaterial';
import { GameObject } from '../objects/GameObject';

/*
class ForceMode {
  ~ F = ma           =    Force = mass * acceleration
  ~ a = F/m          =    acceleration = Force / mass
  ~ p = F*t          =    impulse = Force * time
  ~ v = (F/m) * t    =    velocity = (Force / mass) * time

  get Force() {}
  get Acceleration() {}
  get Impulse() {}
  get Velocity() {}
}
*/

interface TouchSide {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export class Rigidbody2D extends Component {
  constructor() {
    super();
  }
  public mass = 10;
  public drag = 0;
  public useGravity = true;
  public isKinematic = false; // Если true, объект не будет подвержен физике

  public speed = 0;
  public velocity = Vector2D.zero; // Текущая скорость
  public acceleration = Vector2D.zero; // Текущее ускорение
  public force = Vector2D.zero; // Текущая сила
  public gravity = Vector2D.up.multiply(10); // Гравитация (ускорение вниз)

  public touchSide: TouchSide = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  public touchSideSecond: TouchSide = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  public collider: BoxCollider2D | null = null;
  public colliders: BoxCollider2D[] = [];

  public delayX = new Delay(0); // Изначально максимальная скорость
  public delayY = new Delay(0); // Изначально максимальная скорость

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject = gameObject;

      this.collider = this.gameObject.getComponent(BoxCollider2D) || null;

      if (this.collider) {
        this.collider.isStatic = false;
      }
    }
  }

  applyForce(force = new Vector2D()) {
    this.acceleration = this.acceleration.add(force.divide(this.mass)).round();
  }

  update(deltaTime?: number) {
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

      // const speedX = new Vector2D(this.velocity.x, 0).magnitude();
      // const speedY = new Vector2D(0, this.velocity.y).magnitude();

      this.delayY.value = 1; // || Math.round(200 / speedX);
      this.delayY.value = 1; // || Math.round(200 / speedY);

      if (!this.gameObject) {
        return;
      }

      if (this.delayX.isActive) {
        this.gameObject.transform.translate(
          new Vector2D(this.velocity.normalize().roundRadius().x, 0),
        );
      }

      if (this.delayY.isActive) {
        this.gameObject.transform.translate(
          new Vector2D(0, this.velocity.normalize().roundRadius().y),
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
    const collisionColliders: BoxCollider2D[] = [];

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
        this.collider?.checkCollision(collider, overlapSpace)
      ) {
        const { rollback, overlap } = this.collider.getOverlap(
          collider,
          overlapSpace,
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

      const mySet = new Set<number>();

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
    const currentOverlap = new Vector2D();

    if (!this.gameObject) {
      return;
    }

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

  calculatePhysicCollision(otherCollider = new BoxCollider2D()): number {
    if (!this.collider) {
      return 0;
    }

    const { physicMaterial } = this.collider;

    let bounciness = 0;

    if (physicMaterial) {
      const otherPM = otherCollider.physicMaterial || new PhysicMaterial();
      bounciness = -physicMaterial.combineBounciness(otherPM);
    }

    return bounciness;
  }

  getColliders(): BoxCollider2D[] {
    return this.colliders;
  }
}

function getTouch(touch: TouchSide, vector: Vector2D) {
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
