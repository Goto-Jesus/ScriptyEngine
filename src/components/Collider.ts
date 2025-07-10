import { Size } from '../utils/Size';
import { Vector2D } from '../utils/Vector2D';
import { Component } from '../core/Component';
import { PhysicMaterial } from '../core/physic/PhysicMaterial';
import { GameObject } from '../objects/GameObject';


  // onCollisionEnter() {
  //   console.log("Collision Enter");
  // }

  // onCollisionStay() {
  //   console.log("Collision Stay");
  // }

  // onCollisionExit() {
  //   console.log("Collision Exit");
  // }
abstract class Collider2D extends Component {
  constructor(
    public localPosition: Vector2D,
    public physicMaterial: PhysicMaterial | null = null,
    public isTrigger: boolean = false,
  ) {
    super();
  }

  checkCollision() {}
}

export class BoxCollider2D extends Collider2D {
  private globalPosition = new Vector2D();
  private colliderPosition = new Vector2D();
  public isStatic = true;

  constructor(
    public size = new Size(1, 1),
    public localPosition = new Vector2D(),
    public physicMaterial: PhysicMaterial | null = null,
  ) {
    super(localPosition, physicMaterial);
  }

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.globalPosition = this.gameObject.transform.position;
    }
  }

  setLocalPosition(localPosition: Vector2D) {
    this.localPosition = localPosition;
  }

  setSize(size: Size) {
    this.size = size;
  }

  updateColliderPosition() {
    this.colliderPosition = this.globalPosition.add(this.localPosition);
  }

  checkCollision(other: BoxCollider2D = new BoxCollider2D(), expand = 0) {
    this.updateColliderPosition();
    other.updateColliderPosition();

    const expandedOther = {
      x: other.colliderPosition.x - expand,
      y: other.colliderPosition.y - expand,
      width: other.size.width + expand * 2,
      height: other.size.height + expand * 2,
    };

    return (
      this.colliderPosition.x < expandedOther.x + expandedOther.width &&
      this.colliderPosition.x + this.size.width > expandedOther.x &&
      this.colliderPosition.y < expandedOther.y + expandedOther.height &&
      this.colliderPosition.y + this.size.height > expandedOther.y
    );
  }

  getOverlap(other = new BoxCollider2D(), expand = 0) {
    const expanded = {
      x: other.colliderPosition.x - expand,
      y: other.colliderPosition.y - expand,
      width: other.size.width + expand * 2,
      height: other.size.height + expand * 2,
    };

    // Вычисляем смещения по осям
    const right = expanded.x + expanded.width - this.colliderPosition.x; // справа
    const left = this.colliderPosition.x + this.size.width - expanded.x; // слева
    const bottom = expanded.y + expanded.height - this.colliderPosition.y; // снизу
    const top = this.colliderPosition.y + this.size.height - expanded.y; // сверху

    // Определяем минимальные пересечения по осям
    const overlapX = right < left ? right : -left;
    const overlapY = bottom < top ? bottom : -top;

    // Если сталкиваемся с углом (есть пересечение по обеим осям)
    const rollback = {
      x: overlapX,
      y: overlapY,
    };

    const overlap = {
      x: overlapX,
      y: overlapY,
    };

    // Проверка для "чистого" столкновения по одной оси
    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      rollback.x = 0; // Столкновение по Y
    }
    if (Math.abs(overlapY) > Math.abs(overlapX)) {
      rollback.y = 0; // Столкновение по X
    }

    // my -------------
    if (Math.abs(overlapX) > Math.round(this.size.width)) {
      overlap.x = 0;
    }
    if (Math.abs(overlapY) > Math.round(this.size.height)) {
      overlap.y = 0;
    }

    // В случае равных пересечений, оставить откат по обеим осям (например, для углов)
    return {
      rollback: new Vector2D(rollback.x, rollback.y),
      overlap: new Vector2D(overlap.x, overlap.y),
    };
  }

  getColliderTouch(other: BoxCollider2D, expand: number = 1) {
    if (!this.checkCollision(other, expand)) {
      return Vector2D.zero;
    }

    return this.getOverlap(other, expand).rollback;
  }
}
