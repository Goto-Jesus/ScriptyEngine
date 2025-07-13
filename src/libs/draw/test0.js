const heightViewport = 360;
const widthViewport = 64 * 20;
// const heightViewport = 20;
// const widthViewport = 40;

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
  const _ranges = [];

  const { x, y } = position;
  const heightViewport = viewport.length;
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
    const widthLineOfImage = image[i].length;
    const currentViewportLine = viewport[y + i];
    const widthLineViewport = currentViewportLine.length;

    if (widthLineOfImage + x <= 0 || widthLineViewport < x) {
      continue;
    }

    const emptySpace = widthLineOfImage - image[i].trimStart().length;
    const realStartImage = emptySpace + x;
    const cutImage = widthLineViewport - x - emptySpace;
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
  
    const viewportAfter = currentViewportLine.substring(xEnd, widthLineViewport);

    viewport[y + i] = viewportBefore + imageCenter + viewportAfter;
    _ranges.push([ xStart, xEnd, y + i ]);
  }

  return viewport;
}

/**
 * Draw Symbols
 * @param {{
 *     image: string[];
 *     position: {
 *       x: number;
 *       y: number;
 *     };
 *     color: string;
 *   }[]} images
 * @returns { string }
 */
function drawsAllImages(images) {
  let display = new Array(heightViewport).fill('~'.repeat(widthViewport));
  
  for (let i = 0; i < images.length; i++) {
    drawImageOnViewport(
      images[i].image,
      images[i].position,
      display,
    );
  }

  return display.join('\n');
}

// ----------------------------------------------------------------------------------------------

function drawsReversed(images, colors) {
  const fonChar = '~';
  const display = Array(heightViewport).fill().map(() => Array(widthViewport).fill(fonChar));

  for (let i = images.length - 1; i >= 0; i--) {
    const { image, position, color } = images[i];
    const colorCode = colors[color] || '';
    const resetCode = colors.reset || '';

    for (let dy = 0; dy < image.length; dy++) {
      const y = position.y + dy;
      if (y < 0 || y >= heightViewport) continue;

      const line = image[dy];

      for (let dx = 0; dx < line.length; dx++) {
        const x = position.x + dx;
  
        if (x < 0 || x >= widthViewport) continue;

        const char = line[dx];

        if (char !== ' ' && display[y][x] === fonChar) {
          display[y][x] = colorCode + char + resetCode;
        }
      }
    }
  }

  return display.map(row => row.join('')).join('\n');
}

function drawsReversed2(images, colors) {
  const fonChar = '~';
  const display = new Array(heightViewport);
  for (let y = 0; y < heightViewport; y++) {
    display[y] = new Array(widthViewport).fill(fonChar);
  }

  for (let i = images.length - 1; i >= 0; i--) {
    const { image, position, color } = images[i];
    const colorCode = colors[color] || '';
    const resetCode = colors.reset || '';

    for (let dy = 0; dy < image.length; dy++) {
      const y = position.y + dy;
      if (y < 0 || y >= heightViewport) continue;

      const line = image[dy];

      for (let dx = 0; dx < line.length; dx++) {
        const x = position.x + dx;
  
        if (x < 0 || x >= widthViewport) continue;

        const char = line[dx];

        if (char !== ' ' && display[y][x] === fonChar) {
          display[y][x] = colorCode + char + resetCode;
        }
      }
    }
  }

  return display.map(row => row.join('')).join('\n');
}

// ----------------------------------------------------------------------------------------------

/**
 *
 * @param {string[]} image
 * @param {{ x: number, y: number }} position
 * @param {string[]} diplay
 * @returns {[newViewport: string[], [x0: number, x1: number, y: number][]]}
 */
function drawImageOnViewport_(image, position, viewport) {
  const _ranges = [];
  const _viewport = [...viewport]

  const { x, y } = position;
  const heightViewport = _viewport.length;
  const heightImage = image.length;
  const heightImageInViewport =
    y + heightImage <= heightViewport
      ? heightImage
      : heightImage - (y + heightImage - heightViewport);

  for (let i = y >= 0 ? 0 : Math.abs(y); i < heightImageInViewport; i++) {
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
      x >= 0 ? realStartImage : realStartImage > 0 ? realStartImage : 0;

    const viewportBefore = currentViewportLine.substring(0, xStart);

    const realEndImage = image[i].trim().length + realStartImage;

    const xEnd = realEndImage > 0 ? realEndImage : 0;

    const viewportAfter = currentViewportLine.substring(xEnd, widthViewport);

    _viewport[y + i] = viewportBefore + imageCenter + viewportAfter;
    _ranges.push([xStart, xEnd, y + i]);
  }

  return [_viewport, _ranges];
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
function drawsAllImages_(images) {
  // init
  let display = new Array(heightViewport).fill('~'.repeat(widthViewport)); // viewport 10x20
  const rangesOfAllImages = Array.from({ length: display.length }, () => []);

  display = drawImageOnViewport_([''], { x: 0, y: 0 }, display);

  // - draw all images
  for (let i = 0; i < images.length; i++) {
    const [viewport, rangesOfImage] = drawImageOnViewport_(
      images[i].image,
      images[i].position,
      display[0],
    );

    display = [viewport];

    // ----------------------------------------------------
    for (let j = 0; j < rangesOfImage.length; j++) {
      const [x0, x1, y] = rangesOfImage[j];
      let index = 0;
      let toPush = null;

      for (let k = 0; k < rangesOfAllImages[y].length; k++) {
        const z = rangesOfAllImages[y][k];

        //  012345678    012345678
        // [0█x1 z0▒1]  [0▒z1 x0█1] //- nothing
        if (x1 < z[0]) {
          index = k;
          continue;
        } else if ( z[1] < x0) {
          index = k + 1;
          continue;
        }

        //  01234567890123
        // [x0██z0▄▄z1██x1] //! delete
        if (x0 <= z[0] && z[1] <= x1) {
          rangesOfAllImages[y].splice(k, 1);
          k--;
          continue;
        }

        //  01234567890123
        // [z0▒▒x0██x1▒▒z1] //~ make two
        if (z[0] < x0 && x1 < z[1]) {
          toPush = [
            x1,
            rangesOfAllImages[y][k][1],
            rangesOfAllImages[y][k][2],
          ];
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

      if (toPush) {
        rangesOfAllImages[y].splice(
          index,
          0,
          [x0, x1, images[i].color],
          toPush,
        );
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
 *      red string,
 *      green: string,
 *      blue: string,
 *    }} colors
 * @returns {string}
 */
function addColor_(drawArray, colors) {
  const [viewport, object] = drawArray;

  for (let y = 0; y < object.length; y++) {
    if (!object[y].length) continue

    let length = 0;

    for (let x = 0; x < object[y].length; x++) {
      const xStart = object[y][x][0];
      const xEnd = object[y][x][1];
      const color = colors[object[y][x][2]];

      viewport[y] = viewport[y].slice(0, length + xStart) + color + viewport[y].slice(length + xStart);
      length += color.length;
      viewport[y] = viewport[y].slice(0, length + xEnd) + colors.reset + viewport[y].slice(length + xEnd);
      length += colors.reset.length;
    }
  }

  return viewport.join('\n');
}

// ----------------------------------------------------------------------------------------------

const circle = [
  " ######",
  "########",
  "########",
  " ######",
];

const box = [
  "@@@@@@@@",
  "@@@@@@@@",
  "@@@@@@@@",
  "@@@@@@@@",
];

const scripty = [
  "  ,,,,",
  " (o.o)",
  "/(___)\\",
  "  1.1.",
];

function getRandomNumber(number) {
  return Math.floor(Math.random() * number);
}

const gameObjects = [
  {
    image: circle,
    position: {x: 13, y: 4},
    color: 'green',
  },
  {
    image: box,
    position: {x: 8, y: 4},
    color: 'blue',
  },
  {
    image: scripty,
    position: {x: 19, y: 4},
    color: 'red',
  },
  {
    image: scripty,
    position: {x: 15, y: 4},
    color: 'yellow',
  },
];

for (let i = 0; i < 0; i++) {
  const greenCircle = {
    image: circle,
    position: {x: getRandomNumber(widthViewport), y: getRandomNumber(heightViewport)},
    color: 'green',
  };
  
  const blueBox = {
    image: box,
    position: {x: getRandomNumber(widthViewport), y: getRandomNumber(heightViewport)},
    color: 'blue',
  };
  
  const redBoy = {
    image: scripty,
    position: {x: getRandomNumber(widthViewport), y: getRandomNumber(heightViewport)},
    color: 'red',
  };

  gameObjects.push(greenCircle);
  gameObjects.push(blueBox);
  gameObjects.push(redBoy);
}

const ANSI_COLORS = {
  white: "\x1b[37m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",

  bold: "\x1b[1m",
  reverse: "\x1b[7m",
  reset: "\x1b[0m",

  bgWhite: "\x1b[47m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgBlue: "\x1b[44m",
  bgYellow: "\x1b[43m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
};

//
async function benchmark(fn, iterations = 1000) {
    // Разогрев (в отдельном блоке чтобы не влиять на основной замер)
    for (let i = 0; i < 100; i++) await fn;
    
    // Основной замер
    const start = performance.now();
    for (let i = 0; i < iterations; i++) await fn;
    const end = performance.now();
    
    return (end - start) / iterations;
}

async function compareBenchmarks(name, fn1, fn2, iterations = 1000) {
    // Запускаем оба теста параллельно в отдельных "транзакциях"
    const [time1, time2] = await Promise.all([
        (async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            return benchmark(fn1, iterations);
        })(),
        (async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            return benchmark(fn2, iterations);
        })()
    ]);

    console.log(name);
    console.log(`First Function: ${time1.toFixed(4)}ms per operation`);
    console.log(`Second Function: ${time2.toFixed(4)}ms per operation`);
    console.log(`Difference: ${time1 > time2 ? 'First' : 'Second'} is slower by ${(Math.max(time1, time2) / Math.min(time1, time2)).toFixed(2)}x\n`);
}
//

console.time("total time");
console.log(drawsReversed(gameObjects, ANSI_COLORS));

compareBenchmarks(
  'text 1',
  drawsReversed(gameObjects, ANSI_COLORS),
  drawsReversed2(gameObjects, ANSI_COLORS),
  1000,
);

compareBenchmarks(
  'text 2',
  drawsReversed2(gameObjects, ANSI_COLORS),
  drawsReversed(gameObjects, ANSI_COLORS),
  1000,
);

console.timeEnd("total time");
