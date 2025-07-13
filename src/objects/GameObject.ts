import { Vector2D } from '../utils/Vector2D';
import { Component } from '../core/Component';
import { Transform } from '../components/Transform';
import { Image } from '../components/Image';
import { Animation } from '../components/Animation';
import { Animator } from '../components/Animator';
import { Colors } from '../utils/colors';

type ImageTypes = Image | Animation | Animator;

export class GameObject {
  public image?: ImageTypes | null = null;
  public transform: Transform;
  public color?: keyof Colors;

  constructor(
    public name = 'gameObject',
    public tag = 'default',
    private components: Component[] = [],
    private parent: GameObject | null = null,
    public children: GameObject[] = [],
  ) {
    this.transform = new Transform(new Vector2D(), this);
  }

  addChild(child: GameObject) {
    if (child.parent) {
      child.removeParent();
    }

    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: GameObject) {
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

  resetChildrenPosition(x_ = 0, y_ = 0) {
    if (this.children.length) {
      const { x: parentX, y: parentY } = this.transform.position;

      this.children.forEach((child) => {
        const { x: childX, y: childY } = child.transform.position;
        const childPosition = new Vector2D(
          parentX + childX + x_,
          parentY + childY + y_,
        );

        child.setPosition(childPosition);
      });
    }
  }

  // Метод для вычисления мировой позиции с учетом родительских объектов
  getWorldPosition(): Vector2D {
    if (this.parent) {
      const parentPosition = this.parent.getWorldPosition();

      return new Vector2D(
        this.transform.position.x + parentPosition.x,
        this.transform.position.y + parentPosition.y,
      );
    }

    return this.transform.position;
  }

  // Обновление позиции всех дочерних объектов при изменении родительской позиции
  updateChildrenPosition(direction: Vector2D) {
    this.children.forEach((child) => {
      child.transform.translate(direction);
    });
  }

  setPosition(position = new Vector2D()) {
    const oldPosition = this.transform.position;
    this.transform.position = position;

    const direction = new Vector2D(
      position.x - oldPosition.x,
      position.y - oldPosition.y,
    );

    if (this.children.length) {
      this.updateChildrenPosition(direction);
    }
  }

  /* -------------------------------------------------------------------- */

  addComponent(component: Component) {
    component.attach(this);
    this.components.push(component);
  }

  /* 
    new (...args: never[]) – підходить, якщо компоненти не мають параметрів конструктора

    new (...args: any[]) – якщо компоненти можуть мати параметри

    unknown[] не підходить, бо несумісний з параметрами конструктора  
  */
  getComponent<T extends Component>(
    type: { new (...args: never[]): T },
  ): T | null {
    return this.components.find(
      (component): component is T => component instanceof type,
    ) || null;
  }

  getComponents<T extends Component>(
    type: { new (...args: never[]): T },
  ): T[] {
    return this.components.filter(
      (component): component is T => component instanceof type,
    );
  }

  /* -------------------------------------------------------------------- */

  render(): string[] {
    if (this.image) {
      return this.image.render();
    }

    return [''];
  }
}
