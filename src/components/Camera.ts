import { drawOnViewport } from '../libs/draw/drawOnViewport';
import { generateArea } from '../libs/generates/generateArea';
import { changeContent } from '../libs/changeContent';
import { Component } from '../core/Component';
import { Vector2D } from '../utils/Vector2D';
import { Size } from '../utils/Size';
import { GameObject } from '../objects/GameObject';

const _1x1 =    new Size(36 * 2, 36);
const _4x3 =    new Size(48 * 2, 36);
const _16x9 =   new Size(64 * 2, 36);
const _16x10 =  new Size(64 * 2, 40);

export const viewportSize = {
  _1x1,
  _4x3,
  _16x9,
  _16x10,
};

export class Camera extends Component {
  private viewport: string[];
  public currentView: string[];

  constructor(size: Size = viewportSize._1x1) {
    super();
    const { width, height } = size;

    this.viewport = [];
    this.currentView = [];
    this.create(width, height);
  }

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject = gameObject;
    }
  }

  create(width: number, height: number) {
    this.viewport = generateArea(width, height, ' ');
  }

  draw(
    image: string[] = [],
    position = Vector2D.zero,
    viewport: string[] = this.viewport,
  ) {
    if (this.gameObject) {
      const cameraPosition = this.gameObject.transform.position.add(position);
      this.currentView = drawOnViewport(
        image,
        cameraPosition,
        viewport,
      )[0];
    }
  }

  render(id: string) {
    changeContent(id, this.currentView.join('\n'));
  }
}
