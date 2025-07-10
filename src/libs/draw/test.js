/**
 * 
 * @param {string[]} image
 * @param {{ x: number, y: number }} position
 * @param {string[]} viewport
 * @returns {[newViewport: string[], [x0: number, x1: number, y: number][]]}
 */
function drawImageOnViewport(
  image,
  position,
  viewport,
) {
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

/**
 * @param {string} str
 * @param {number} start
 * @param {number} deleteCount
 * @param {string} insertText
 * @returns {string}
 */
function stringSplice(str, start, deleteCount = 0, insertText = '') {
  return str.slice(0, start) + insertText + str.slice(start + deleteCount);
}

/**
 * Draw Symbols
 * @param {{
      image: string[];
      position: {
        x: number;
        y: number;
      };
      color: string;
    }[]} images
 * @returns {[
      viewport: string[],
      ranges: [
        [
          x0: number,
          x1: number,
          color: string,
        ]
      ]
    ]}
 */
function drawsAllImages(images) {
  // init
  let display = new Array(10).fill('~'.repeat(20)); // viewport 10x20
  const rangesOfAllImages = Array.from({ length: display.length }, () => []);

  display = drawImageOnViewport(
    [''],
    { x: 0, y: 0 },
    display
  );
  
  // - draw all images
  for (let i = 0; i < images.length; i++) {
    const [viewport, rangesOfImage] = drawImageOnViewport(
      images[i].image,
      images[i].position,
      display[0],
    );
    
    display = [viewport];
    
    // ----------------------------------------------------
    for(let j = 0; j < rangesOfImage.length; j++) {
      const [x0, x1, y] = rangesOfImage[j];
      let index = 0;
      let toPush = null;

      if (rangesOfAllImages[y].length > 0) {
        for(let k = 0; k < rangesOfAllImages[y].length; k++) {
          const z = rangesOfAllImages[y][k];
          
          //  012345678    012345678
          // [0█x1 z0▒1]  [0▒z1 x0█1] //- nothing
          if (x1 < z[0] || z[1] < x0) {
            continue;
          }
          
          //  01234567890123
          // [x0██z0▄▄z1██x1] //! delete
          if (x0 <= z[0] && z[1] <= x1) {
            rangesOfAllImages[y].splice(k, 1);
            continue;
          }

          //  01234567890123
          // [z0▒▒x0██x1▒▒z1] //~ make two
          if (z[0] < x0 && x1 < z[1]) {
            toPush = [x1, rangesOfAllImages[y][k][1], rangesOfAllImages[y][k][2]]
            rangesOfAllImages[y][k][1] = x0; // z1
            index = k + 1;
            continue;
          }
          
          //  01234567890123
          // [x0██z0▄▄x1▒▒z1] //+ left
          if (x0 <= z[0] && z[0] <= x1) {
            rangesOfAllImages[y][k][0] = x1; // z0
            index = k;
            continue;
          }

          //  01234567890123
          // [z0▒▒x0▄▄z1██x1] //+ right
          if (z[0] <= x0 && x0 <= z[1]) {
            rangesOfAllImages[y][k][1] = x0; // z1
            index = k + 1;
            continue;
          }
        }
      }
      
      if (toPush) {
        rangesOfAllImages[y].splice(index, 0, [x0, x1, images[i].color], toPush);
        toPush = null;
      } else {
        rangesOfAllImages[y].splice(index, 0, [x0, x1, images[i].color]);
      }
    }
    // ----------------------------------------------------
  }
  return [display[0], rangesOfAllImages];
}

/**
 * 
 * @param {[
 *    viewport: string[],
 *    ranges: [
 *      [
 *        x0: number,
 *        x1: number,
 *        color: string,
 *      ]
 *    ]]} drawArray
 *    {{
 *      key: string,
 *    }} colors
 * @returns {string}
 */
function addColor(drawArray, colors) {
  const [viewport, object] = drawArray;

  for (let y = 0; y < object.length; y++) {
    if (!object[y].length) continue

    let length = 0;

    for (let x = 0; x < object[y].length; x++) {
      const xStart = object[y][x][0];
      const xEnd = object[y][x][1];
      const color = colors[object[y][x][2]];

      viewport[y] = stringSplice(viewport[y], length + xStart, 0, color);
      length += color.length;
      viewport[y] = stringSplice(viewport[y], length + xEnd, 0, colors.reset);
      length += colors.reset.length;
    }
  }

  return viewport.join('\n');
}

// objects
const gameObjects = [
  {
    image: [
      " ######",
      "########",
      "########",
      " ######",
    ],
    position: {x: 6, y: 2},
    color: 'green',
  },
  {
    image: [
      "@@@@@@@@",
      "@@@@@@@@",
      "@@@@@@@@",
      "@@@@@@@@",
    ],
    position: {x: 4, y: 4},
    color: 'blue',
  },
  {
    image: [
      "  ,,,,  ",
      " (o.o)  ",
      "/(___)\\",
      "  1.1.  ",
    ],
    position: {x: 5, y: 4},
    color: 'red',
  },
];

const result = drawsAllImages(gameObjects);

const ANSI_COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

console.log(addColor(result, ANSI_COLORS));

// node src/libs/draw/test.js
