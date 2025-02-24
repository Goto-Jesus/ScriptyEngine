/**
 *
 * @param {number} width
 * @param {number} height
 * @param {string} char
 * @returns {string[]}
 */
export function generateArea(width, height, char = " ") {
  return new Array(height).fill(char.repeat(width));
}
