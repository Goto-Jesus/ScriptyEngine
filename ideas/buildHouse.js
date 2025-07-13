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

const roof = `
          ████          
       ██████████       
    ████████████████    
 ██████████████████████ `;
const floor = `
  █                  █  
  █     ▌▀▀▀▀▀▀▐     █  
  █     ▌      ▐     █  
  █     ▌▄▄▄▄▄▄▐     █  
  █                  █  
  ████████████████████  `;
const firstFloor = `
  █                  █  
  █     █▀▀▀▀▀▀█     █  
  █     █      █     █  
  █     █    ▄ █     █  
  ███████      ███████  
  ███████▄▄▄▄▄▄███████  `;

/**
 * @param {number} numberOfFloors
 * @param {string} color
 * @param {boolean} atNight
 * @returns {string}
 */
function buildHouse(
  numberOfFloors = 1,
  color = ANSI_COLORS.black,
  atNight = false,
) {
  let house = `${color}`;

  if (atNight) {
    house += ANSI_COLORS.BGblack;
  }

  if (numberOfFloors <= 0) {
    numberOfFloors = 1;
  } else if (numberOfFloors >= 1) {
    house += roof;
  }

  for (let i = 0; numberOfFloors > i; i++) {
    if (i === numberOfFloors - 1) {
      house += firstFloor;
    } else {
      house += floor;
    }
  }

  return house;
}

const smallHouse = buildHouse(2, ANSI_COLORS.red);
const bigHouse = buildHouse(4, ANSI_COLORS.cyan);

console.log(smallHouse);
console.log(bigHouse);
