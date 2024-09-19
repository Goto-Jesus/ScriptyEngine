import { drawOnViewport } from "../../draw/drawOnViewport.js";
import { generateArea } from "../../draw/generate/generateArea.js";
import { changeContent } from "../../../changeContent.js";
import { Component } from "./Component.js";
import { Vector2D } from "../../../utils/Vector2D.js";

export const viewportSize = {
  _1x1: {
    width: 36 * 2,
    height: 36,
  },
  _4x3: {
    width: 48 * 2,
    height: 36,
  },
  _16x9: {
    width: 64 * 2,
    height: 36,
  },
  _16x10: {
    width: 64 * 2,
    height: 40,
  },
};

export class Camera extends Component {
  constructor(size = viewportSize._1x1) {
    super();
    const { width, height } = size;

    this.viewport = [];
    this.currentView = [];
    this.create(width, height);
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject = gameObject;
  }

  create(width, height) {
    this.viewport = generateArea(width, height, " "); // █▓▒░
  }

  draw(image, position = Vector2D.zero, viewport = this.viewport, styleId) {
    const cameraPosition = this.gameObject.transform.position.add(position);

    this.currentView = drawOnViewport(image, cameraPosition, viewport, styleId);
  }

  render(id) {
    changeContent(id, this.currentView.join("\n"));
  }
}
