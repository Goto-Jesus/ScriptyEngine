import { KeyControls } from './keyboard/KeyControls';

type FrameCallback = (frameTime: number) => void;

export class GameEngine {
  static frameTime: number = 0;
  static lastTime: number = 0;

  constructor(
    private isPaused = false,
    private goalFps = 60, // 60
    public keyboard = new KeyControls([
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyE',
      'Escape',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ]),
  ) {
    GameEngine.frameTime = 0;
    GameEngine.lastTime = 0;
  }

  update(func: FrameCallback) {
    func(GameEngine.frameTime);
    this.keyboard.update();
  }

  render(func: FrameCallback) {
    func(GameEngine.frameTime);
  }

  loop(update: FrameCallback, render: FrameCallback) {
    const fps = this.goalFps;
    const interval = 1000 / fps; // Время между кадрами в миллисекундах
    GameEngine.lastTime = performance.now();

    const next = () => {
      const now = performance.now();
      GameEngine.frameTime = now - GameEngine.lastTime;

      if (!this.isPaused && GameEngine.frameTime >= interval) {
        GameEngine.lastTime = now - (GameEngine.frameTime % interval); // Синхронизируем время
        this.update(update); // Обновляем состояние игры
        this.render(render); // Отрисовываем игру
      }

      setTimeout(next, 0); // Запускаем следующий кадр
    };

    next(); // Запуск игрового цикла
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (!this.isPaused) {
      GameEngine.lastTime = performance.now(); // Обновляем время при отключении паузы
    }
  }
}
