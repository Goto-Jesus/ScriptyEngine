export function changeContent(id, string) {
  const viewport = changeCharsEasy(string);

  document.getElementById(id).innerHTML = viewport;
}


function changeCharsEasy(string) {
  return string
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
}

function changeChars(string) {
  return string
    .replace(/<(\/?i\s+id="[^"]+"|\/i)>/g, (match) =>
      match.replace(/</g, "##LEFT##").replace(/>/g, "##RIGHT##")
    )
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/##LEFT##/g, "<")
    .replace(/##RIGHT##/g, ">");
}
