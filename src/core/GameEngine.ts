import { KeyControls } from "../keyboard/KeyControls.js";

export class GameEngine {
  constructor() {
    this.isPaused = false;
    this.goalFps = 60;
    this.keyboard = new KeyControls([
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyE",
      "Escape",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ]);
    Game.frameTime = 0;
    Game.lastTime = 0;
  }

  update(func) {
    func(Game.frameTime);
    this.keyboard.update();
  }

  render(func) {
    func(Game.frameTime);
  }

  loop(update, render) {
    const fps = this.goalFps;
    const interval = 1000 / fps; // Время между кадрами в миллисекундах
    Game.lastTime = performance.now();

    const next = () => {
      const now = performance.now();
      Game.frameTime = now - Game.lastTime;

      if (!this.isPaused && Game.frameTime >= interval) {
        Game.lastTime = now - (Game.frameTime % interval); // Синхронизируем время
        this.update(update); // Обновляем состояние игры
        this.render(render); // Отрисовываем игру
      }

      setTimeout(next, 1); // Запускаем следующий кадр
    };

    next(); // Запуск игрового цикла
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (!this.isPaused) {
      Game.lastTime = performance.now(); // Обновляем время при отключении паузы
    }
  }
}
