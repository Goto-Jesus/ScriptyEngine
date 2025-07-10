export function changeContent(id: string, string: string) {
  const viewport = changeCharsEasy(string);
  const el = document.getElementById(id);

  if (!el) {
    console.warn(`Element with id "${id}" not found.`);
    return;
  }

  el.innerHTML = viewport;
}

function changeCharsEasy(string: string) {
  return string.replace(/</g, '&#60;').replace(/>/g, '&#62;');
}

// function changeChars(string: string) {
//   return string
//     .replace(/<(\/?i\s+id="[^"]+"|\/i)>/g, (match) =>
//       match.replace(/</g, '##LEFT##').replace(/>/g, '##RIGHT##'),
//     )
//     .replace(/</g, '&#60;')
//     .replace(/>/g, '&#62;')
//     .replace(/##LEFT##/g, '<')
//     .replace(/##RIGHT##/g, '>');
// }
