export function generatePuzzleTiles(width = 1, height = 1): string[] {
  const array: string[] = [];

  array.push(`   ` + `_( )__ `.repeat(width));

  for (let i = 1; i <= height; i++) {
    if (i % 2 !== 0) {
      array.push(
        ` _|` + `     _|`.repeat(width),
        `(_ ` + `  _ (_ `.repeat(width),
        ` |` + `__( )_|`.repeat(width) + ` `,
      );
      continue;
    }

    array.push(
      ` |_` + `     |_`.repeat(width),
      `  _)` + ` _   _)`.repeat(width),
      ` |` + `__( )_|`.repeat(width) + ` `,
    );
  }

  return array;
}
