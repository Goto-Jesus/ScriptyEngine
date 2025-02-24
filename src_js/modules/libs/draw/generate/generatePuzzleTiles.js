export function puzzleTiles(width = 1, height = 1) {
  const array = [];

  array.push(`   ` + `_( )__ `.repeat(width));

  for (let i = 1; i <= height; i++) {
    if (i % 2 !== 0) {
      array.push(` _|` + `     _|`.repeat(width));
      array.push(`(_ ` + `  _ (_ `.repeat(width));
      array.push(` |` + `__( )_|`.repeat(width) + ` `);
      continue;
    } 

    array.push(` |_` + `     |_`.repeat(width));
    array.push(`  _)` + ` _   _)`.repeat(width));
    array.push(` |` + `__( )_|`.repeat(width) + ` `);
  }

  return array;
}
