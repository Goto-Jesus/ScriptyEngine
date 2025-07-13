export interface Colors {
  white: string,
  black: string,
  red: string,
  green: string,
  blue: string,
  yellow: string,
  magenta: string,
  cyan: string,

  bold: string,
  reverse: string,
  reset: string,

  bgWhite: string,
  bgBlack: string,
  bgRed: string,
  bgGreen: string,
  bgBlue: string,
  bgYellow: string,
  bgMagenta: string,
  bgCyan: string,
}

export const COLORS: Colors = {
  white: `<i id="w">`,
  black: `<i id="bk">`,
  red: `<i id="r">`,
  green: `<i id="g">`,
  blue: `<i id="bl">`,
  yellow: `<i id="y">`,
  magenta: `<i id="m">`,
  cyan: `<i id="c">`,

  bold: `<i id="B">`,
  reverse: `<i id="rv">`,
  reset: "</i>",

  bgWhite: `<i id="bW">`,
  bgBlack: `<i id="bBk">`,
  bgRed: `<i id="bR">`,
  bgGreen: `<i id="bG">`,
  bgBlue: `<i id="bBl">`,
  bgYellow: `<i id="bY">`,
  bgMagenta: `<i id="bM">`,
  bgCyan: `<i id="bC">`,
};

export const ANSI_COLORS: Colors = {
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
