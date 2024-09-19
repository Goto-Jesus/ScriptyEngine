import { Vector2D } from "../../../utils/Vector2D.js";

export class Transform {
  constructor(position = new Vector2D()) {
    this.position = position;
  }

  translate(direction = new Vector2D()) {
    this.position.x += direction.x;
    this.position.y += direction.y;

    // Если этот объект привязан к игровому объекту с дочерними элементами, обновляем их
    if (this.gameObject && this.gameObject.children.length > 0) {
      this.gameObject.updateChildrenPosition(direction);
    }
  }
}
