const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Code

const scripty = [
  '  ,,,,',
  ' (o.o)',
  '/(___)\\',
  '  1.1.',
];

context.font = '20px monospace';

const position = {
  x: 0,
  y: 0,
}

procedura(scripty, position);

function procedura(strings, position = {x: 50, y: 50}, height = 22) {
  for (let i = 0; i < strings.length; i++) {
    context.fillText(strings[i], position.x, position.y + (height * i));
  }
}

// const canvas = document.getElementById('canvas');
// const context = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Code

// const scripty2 = [
//   '  ,,,,',
//   ' (o.o)',
//   '/(___)\\',
//   '  1.1.',
// ];

// context.font = '20px monospace';

// const position2 = {
//   x: 10,
//   y: 10,
// }

// procedura(scripty2, position2);

// function procedura(strings, position = {x: 10, y: 10}, height = 22) {
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   for (let i = 0; i < strings.length; i++) {
//     context.fillText(strings[i], position.x, position.y + (height * i));
//   }
// }

// function calculateWidth(height, aspectWidth = 3, aspectHeight = 4) {
//   return (height * aspectWidth) / aspectHeight;
// }