import { Vector2D } from "../../utils/Vector2D";

/**
 * @param {string[]} image
 * @param {{ x: number, y: number }} position
 * @param {string[]} viewport
 * @returns
 */
export function drawOnViewport(
  image: string[],
  position: Vector2D,
  viewport: string[],
): [string[], number[][]] {
  return drawOnDisplay(image, position, viewport);
}

function drawOnDisplay(
  image: string[],
  position: Vector2D,
  viewport: string[],
): [string[], number[][]] {
  const _viewport = [...viewport];
  const _ranges = [];

  const { x, y } = position;
  const heightViewport = _viewport.length;
  const heightImage = image.length;
  const heightImageInViewport =
    (y + heightImage <= heightViewport)
      ? heightImage
      : heightImage - (y + heightImage - heightViewport);

  for (
    let i = (y >= 0) 
      ? 0
      : Math.abs(y);
    i < heightImageInViewport;
    i++
  ) {
    const widthImage = image[i].length;
    const currentViewportLine = _viewport[y + i];
    const widthViewport = currentViewportLine.length;

    if (widthImage + x <= 0 || widthViewport < x) {
      continue;
    }

    const emptySpace = widthImage - image[i].trimStart().length;
    const realStartImage = emptySpace + x;
    const cutImage = widthViewport - x - emptySpace;
    const imageCenter =
      x >= 0
        ? image[i].trim().substring(0, cutImage > 0 ? cutImage : 0)
        : image[i]
            .trimEnd()
            .substring(realStartImage < 0 ? Math.abs(x) : emptySpace);

    if (imageCenter.length === 0) {
      continue;
    }

    const xStart =
      (x >= 0)
        ? realStartImage
        : (realStartImage > 0)
          ? realStartImage
          : 0;

    const viewportBefore = currentViewportLine.substring(0, xStart);

    const realEndImage = image[i].trim().length + realStartImage;

    const xEnd =
      (realEndImage > 0)
        ? realEndImage
        : 0;
  
    const viewportAfter = currentViewportLine.substring(xEnd, widthViewport);

    _viewport[y + i] = viewportBefore + imageCenter + viewportAfter;
    _ranges.push([ xStart, xEnd, y + i ]);
  }

  return [_viewport, _ranges];
}
