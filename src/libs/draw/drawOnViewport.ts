export function drawOnViewport(image, position, viewport, styleId = "") {
  return drawOnDisplay_MY(image, position, viewport, styleId);
}

/**
 * @param {string[]} image
 * @param {{ x: number, y: number }} position
 * @param {string[]} viewport
 * @returns
 */
function drawOnDisplay_MY(image: string[], position, viewport, styleId = "") {
  const wrapper = styleId ? { start: ``, end: `` } : { start: ``, end: `` };

  const _viewport = [...viewport];
  const { x: xPosition, y: yPosition } = position;
  const heightViewport = _viewport.length;
  const heightImage = image.length;
  const heightImageInViewport =
    yPosition + heightImage <= heightViewport
      ? heightImage
      : heightImage - (yPosition + heightImage - heightViewport);

  for (
    let i = yPosition >= 0 ? 0 : Math.abs(yPosition);
    i < heightImageInViewport;
    i++
  ) {
    const widthImage = image[i].length;
    const currentViewportLine = _viewport[yPosition + i];
    const widthViewport = currentViewportLine.length;

    if (widthImage + xPosition <= 0 || widthViewport < xPosition) {
      continue;
    }

    const emptySpace = widthImage - image[i].trimStart().length;
    const realStartImage = emptySpace + xPosition;
    const cutImage = widthViewport - xPosition - emptySpace;
    const imageCenter =
      xPosition >= 0
        ? image[i].trim().substring(0, cutImage > 0 ? cutImage : 0)
        : image[i]
            .trimEnd()
            .substring(realStartImage < 0 ? Math.abs(xPosition) : emptySpace);

    if (imageCenter.length === 0) {
      continue;
    }

    const viewportBefore = currentViewportLine.substring(
      0,
      xPosition >= 0 ? realStartImage : realStartImage > 0 ? realStartImage : 0
    );

    const realEndImage = image[i].trim().length + realStartImage;
    const viewportAfter = currentViewportLine.substring(
      realEndImage > 0 ? realEndImage : 0,
      widthViewport
    );

    _viewport[yPosition + i] =
      viewportBefore +
      (wrapper.start + imageCenter + wrapper.end) +
      viewportAfter;
  }

  return _viewport;
}