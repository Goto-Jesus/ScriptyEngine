import { Vector2D } from "../../../utils/Vector2D.js";
import { Component } from "./Component.js";

class Collider2D extends Component {
  constructor(localPosition = new Vector2D(), physicMaterial = null) {
    super();
    this.localPosition = localPosition;
    this.isTrigger = false;
    this.physicMaterial = physicMaterial;
  }

  checkCollision(other = new Collider2D()) {}

  // onCollisionEnter() {
  //   console.log("Collision Enter");
  // }

  // onCollisionStay() {
  //   console.log("Collision Stay");
  // }

  // onCollisionExit() {
  //   console.log("Collision Exit");
  // }
}

export class BoxCollider2D extends Collider2D {
  constructor(
    size = {
      width: 1,
      height: 1,
    },
    localPosition = new Vector2D(),
    physicMaterial = null
  ) {
    super(localPosition, physicMaterial);
    this.size = size;
    this.globalPosition = new Vector2D();
    this.colliderPosition = new Vector2D();
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.globalPosition = this.gameObject.transform.position;
  }

  setLocalPosition(localPosition) {
    this.localPosition = localPosition;
  }

  setSize(size) {
    this.size = size;
  }

  updateColliderPosition() {
    this.colliderPosition = this.globalPosition.add(this.localPosition);
  }

  checkCollision(other = new BoxCollider2D(), expand = 0) {
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
    const expandedOther = {
      x: other.colliderPosition.x - expand,
      y: other.colliderPosition.y - expand,
      width: other.size.width + expand * 2,
      height: other.size.height + expand * 2,
    };

    // Вычисляем смещения по осям
    const right =
      expandedOther.x + expandedOther.width - this.colliderPosition.x; // справа
    const left = this.colliderPosition.x + this.size.width - expandedOther.x; // слева
    const bottom =
      expandedOther.y + expandedOther.height - this.colliderPosition.y; // снизу
    const up = this.colliderPosition.y + this.size.height - expandedOther.y; // сверху

    // Определяем минимальные пересечения по осям
    const overlapX = right < left ? right : -left;
    const overlapY = bottom < up ? bottom : -up;

    // Выбираем меньшую величину пересечения и обнуляем другую
    const rollback =
      Math.abs(overlapX) < Math.abs(overlapY)
        ? { x: overlapX, y: 0 } // Столкновение по оси X
        : { x: 0, y: overlapY }; // Столкновение по оси Y

    return new Vector2D(rollback.x, rollback.y); // Возвращаем откат
  }

  getColliderTouch(other, expand = 1) {
    if (!this.checkCollision(other, expand)) {
      return Vector2D.zero;
    }

    return this.getOverlap(other, expand);
  }
}
