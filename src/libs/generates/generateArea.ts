/**
 * @param {number} width
 * @param {number} height
 * @param {string} char
 * @returns {string[]}
 */
export function generateArea(
  width: number,
  height: number,
  char = ' ',
): string[] {
  return new Array(height).fill(char.repeat(width));
}
