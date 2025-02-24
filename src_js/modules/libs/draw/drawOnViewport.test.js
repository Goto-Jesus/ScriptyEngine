import { generateArea } from "./generate/generateArea.js";
import { drawOnViewport } from "./drawOnViewport.js";

const box4x7 = [
  "XXXXXXX",
  "X     X",
  "X     X",
  "XXXXXXX",
];

const human = [
  ` ,,,,   `,
 `\\(o.o)/ `,
  ` (___)  `,
  `  <.<.  `,
];

describe("drawOnDisplay.js", () => {
  it("should position 0 0", () => {
    let viewport = generateArea(15, 7);
    viewport = drawOnViewport(box4x7, { x: 0, y: 0 }, viewport);
    expect(viewport).toEqual([
      "XXXXXXX        ",
      "X     X        ",
      "X     X        ",
      "XXXXXXX        ",
      "               ",
      "               ",
      "               ",
    ]);
  });

  it("should position 2 5", () => {
    let viewport = generateArea(15, 7);
    viewport = drawOnViewport(box4x7, { x: 2, y: 5 }, viewport);
    expect(viewport).toEqual([
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "  XXXXXXX      ",
      "  X     X      ",
    ]);
  });

  it("should position -2 1", () => {
    // it.only
    let viewport = generateArea(15, 7);
    viewport = drawOnViewport(human, { x: -2, y: 1 }, viewport);
    expect(viewport).toEqual([
      "               ",
      ",,,            ",
      "o.o)/          ",
      "___)           ",
      "<.<.           ",
      "               ",
      "               ",
    ]);
  });

  it("should 2 objects", () => {
    // it.only
    let viewport = generateArea(15, 7);
    viewport = drawOnViewport(box4x7, { x: 0, y: 0 }, viewport);
    viewport = drawOnViewport(human, { x: -2, y: 1 }, viewport);
    expect(viewport).toEqual([
      "XXXXXXX        ",
      ",,,   X        ",
      "o.o)/ X        ",
      "___)XXX        ",
      "<.<.           ",
      "               ",
      "               ",
    ]);
  });

  // it("should id hero", () => {
  //   // it.only
  //   let viewport = generateArea(15, 7);
  //   viewport = drawOnViewport(box4x7, { x: 0, y: 0 }, viewport);
  //   viewport = drawOnViewport(hero, { x: -2, y: 1 }, viewport, "hero");
  //   expect(viewport).toEqual([
  //     "XXXXXXX        ",
  //     '<i id="hero">,,,</i>   X        ',
  //     '<i id="hero">o.o)/</i> X        ',
  //     '<i id="hero">___)</i>XXX        ',
  //     '<i id="hero"><.<.</i>           ',
  //     "               ",
  //     "               ",
  //   ]);
  // });

  // it("should id hero and box", () => {
  //   // it.only
  //   let viewport = generateArea(15, 7);
  //   viewport = drawOnViewport(box4x7, { x: 0, y: 0 }, viewport, "box");
  //   viewport = drawOnViewport(hero, { x: -2, y: 1 }, viewport, "hero");
  //   expect(viewport).toEqual([
  //     '<i id="box">XXXXXXX</i>        ',
  //     '<i id="box"><i id="hero">,,,</i>   X</i>        ',
  //     '<i id="box"><i id="hero">o.o)/</i> X</i>        ',
  //     '<i id="box"><i id="hero">___)</i>XXX</i>        ',
  //     '<i id="hero"><.<.</i>           ',
  //     "               ",
  //     "               ",
  //   ]);
  // });
});
