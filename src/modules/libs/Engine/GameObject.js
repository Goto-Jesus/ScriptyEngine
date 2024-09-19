import { Component } from "./Components/Component.js";
import { Transform } from "./Components/Transform.js";

export class GameObject {
  constructor(name = "gameObject", tag = "default") {
    this.name = name;
    this.tag = tag;
    this.transform = new Transform();
    this.transform.gameObject = this; // Связываем transform с gameObject
    this.components = [];
    this.parent = null; // Ссылка на родительский объект
    this.children = []; // Массив дочерних объектов
  }

  addChild(child) {
    if (child.parent) {
      child.removeParent();
    }

    child.parent = this;
    this.children.push(child);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);

    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  removeParent() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  /* -------------------------------------------------------------------- */

  resetChildrenPosition(x = 0, y = 0) {
    if (this.children.length) {
      const { _x: parentX, _y: parentY } = this.transform.position;

      this.children.forEach((child) => {
        const { x: childX, y: childY } = child.transform.position;
        const childPosition = {
          x: parentX + childX + x,
          y: parentY + childY + y,
        };

        child.setPosition(childPosition);
      });
    }
  }

  // Метод для вычисления мировой позиции с учетом родительских объектов
  getWorldPosition() {
    if (this.parent) {
      const parentPosition = this.parent.getWorldPosition();

      return {
        x: this.transform.position.x + parentPosition.x,
        y: this.transform.position.y + parentPosition.y,
      };
    }

    return this.transform.position;
  }

  // Обновление позиции всех дочерних объектов при изменении родительской позиции
  updateChildrenPosition(direction) {
    this.children.forEach((child) => {
      child.transform.translate(direction);
    });
  }

  setPosition(position) {
    const oldPosition = this.transform.position;
    this.transform.position = position;

    const direction = {
      x: position.x - oldPosition.x,
      y: position.y - oldPosition.y,
    };

    if (this.children.length) {
      this.updateChildrenPosition(direction);
    }
  }

  /* -------------------------------------------------------------------- */

  addComponent(component = new Component()) {
    component.attach(this);
    this.components.push(component);
  }

  getComponent(type) {
    return this.components.find((component) => component instanceof type);
  }

  getComponents(type) {
    return this.components.filter((component) => component instanceof type);
  }

  /* -------------------------------------------------------------------- */

  render() {
    if (this.image) {
      return this.image.render();
    }

    return [""];
  }
}
