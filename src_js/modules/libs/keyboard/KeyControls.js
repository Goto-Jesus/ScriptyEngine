export class KeyControls {
  constructor(keyList = ["KeyW", "KeyA", "KeyS", "KeyD"]) {
    this.keyList = keyList;
    this.keys = {};

    keyList.forEach((keyItem) => {
      this.keys[keyItem] = {
        down: false,
        pressed: false,
        up: false,
      };
    });

    addEventListener("keydown", (event) => this.changeState(event));
    addEventListener("keyup", (event) => this.changeState(event));
  }

  changeState(event) {
    if (!this.keyList.includes(event.code)) return;

    const keyState = this.keys[event.code];

    if (event.type === "keydown") {
      if (!keyState.pressed) {
        // Если клавиша не была уже нажата
        keyState.down = true;
        keyState.pressed = true;
        keyState.up = false;
      }
    } else if (event.type === "keyup") {
      keyState.down = false;
      keyState.pressed = false;
      keyState.up = true;
    }
  }

  // Этот метод нужно вызывать в конце каждого кадра, чтобы сбрасывать состояния down и up
  update() {
    Object.values(this.keys).forEach((keyState) => {
      keyState.down = false; // Сброс состояния down после его обработки
      keyState.up = false; // Сброс состояния up после его обработки
    });
  }
}
