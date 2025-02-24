export function drawOnViewport(image, position, viewport, styleId = "") {
  return drawOnDisplay_MY(image, position, viewport, styleId);
  // return drawOnDisplay_GPT(image, position, viewport, styleId);
}

/**
 * @param {string[]} image
 * @param {{ x: number, y: number }} position
 * @param {string[]} viewport
 * @returns
 */
function drawOnDisplay_MY(image, position, viewport, styleId = "") {
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

/* */
function drawOnDisplay_GPT(image, position, viewport, styleId = "") {
  const wrapper = styleId
    ? { start: `<i id="${styleId}">`, end: `</i>` }
    : { start: ``, end: `` };

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
    const realEndImage = image[i].trim().length + realStartImage;
    const cutImage = widthViewport - xPosition - emptySpace;

    // ---------

    // const regex = /<i\s+id="[^"]*">|<\/i>/g;

    // const regexStart = /<i\s+id="[^"]*">/g;
    // const regexEnd = /<\/i>/g;

    // const matches = currentViewportLine.match(regex);
    // let matchLength = 0;

    // if (matches) {
    //   matchLength = matches[0].length;
    //   console.log(`Match: ${matches[0]}, Length: ${matchLength}`);
    //   console.log(matches);

    //   currentViewportLine = currentViewportLine.replace(regexStart, "@");
    //   currentViewportLine = currentViewportLine.replace(regexEnd, "$");
    // }

    // ---------

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

    const viewportAfter = currentViewportLine.substring(
      realEndImage > 0 ? realEndImage : 0,
      widthViewport
    );

    // ---------

    _viewport[yPosition + i] =
      viewportBefore +
      (wrapper.start + imageCenter + wrapper.end) +
      viewportAfter;
  }

  return _viewport;
}
/* */