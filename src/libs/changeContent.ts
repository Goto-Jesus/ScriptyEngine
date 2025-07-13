export function changeContent(id: string, string: string) {
  const viewport = changeCharsEasy(string);
  const el = document.getElementById(id);

  if (!el) {
    console.warn(`Element with id "${id}" not found.`);
    return;
  }

  el.innerHTML = viewport;
}

// function changeCharsEasyOld(string: string) {
//   return string.replace(/</g, '&#60;').replace(/>/g, '&#62;');
// }

function changeCharsEasy(string: string): string {
  // 1. Сховати теги <i ...> і </i>
  const placeholders: string[] = [];
  const protectedString = string.replace(/<i[^>]*?>|<\/i>/g, (match) => {
    placeholders.push(match);
    return `%%PLACEHOLDER_${placeholders.length - 1}%%`;
  });

  // 2. Замінити < і > на HTML-коди
  const escaped = protectedString
    .replace(/</g, '&#60;')
    .replace(/>/g, '&#62;');
    // .replace(/ф/g, '\u00A0');

  // 3. Вставити назад збережені теги <i ...> і </i>
  const restored = escaped.replace(/%%PLACEHOLDER_(\d+)%%/g, (_, index) => placeholders[+index]);

  return restored;
}
