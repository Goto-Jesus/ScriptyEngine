type KeyCode = string;

interface KeyState {
  down: boolean;
  pressed: boolean;
  up: boolean;
}

export class KeyControls {
  public keys: Record<KeyCode, KeyState>;

  constructor(public keyList: KeyCode[] = ['KeyW', 'KeyA', 'KeyS', 'KeyD']) {
    this.keys = {};

    keyList.forEach((keyItem: KeyCode) => {
      this.keys[keyItem] = {
        down: false,
        pressed: false,
        up: false,
      };
    });

    addEventListener('keydown', (event: KeyboardEvent) =>
      this.changeState(event),
    );
    addEventListener('keyup', (event: KeyboardEvent) =>
      this.changeState(event),
    );
  }

  private changeState(event: KeyboardEvent): void {
    if (!this.keyList.includes(event.code)) return;

    const keyState = this.keys[event.code];

    if (event.type === 'keydown') {
      if (!keyState.pressed) {
        keyState.down = true;
        keyState.pressed = true;
        keyState.up = false;
      }
    } else if (event.type === 'keyup') {
      keyState.down = false;
      keyState.pressed = false;
      keyState.up = true;
    }
  }

  public update(): void {
    Object.values(this.keys).forEach((keyState: KeyState) => {
      keyState.down = false;
      keyState.up = false;
    });
  }
}
