import { Size } from "../../../utils/Size.js";
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
    size = new Size(1, 1),
    localPosition = new Vector2D(),
    physicMaterial = null
  ) {
    super(localPosition, physicMaterial);
    this.size = size;
    this.globalPosition = new Vector2D();
    this.colliderPosition = new Vector2D();
    this.isStatic = true;
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

  getColliderTouch(other, expand = 1) {
    if (!this.checkCollision(other, expand)) {
      return Vector2D.zero;
    }

    return this.getOverlap(other, expand).rollback;
  }
}


/* 

  



*/