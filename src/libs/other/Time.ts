export class Time {
  constructor() {
    Time.lastFrameTime = performance.now(); // Время предыдущего кадра
    Time.deltaTime = 0; // Время между кадрами (в секундах)
    Time.fixedDeltaTime = 0.02; // Фиксированное время между обновлениями (20 мс)
    Time.timeScale = 1; // Масштаб времени ( замедлять ускорять)
    Time.time = 0; // Общее время с начала игры
    Time.unscaledTime = 0; // Время без учета timeScale (не учитывает замедление или ускорение)
    Time.frameTime = 0;
  }

  update() {
    const now = performance.now(); // Текущее время
    Time.frameTime = now - Time.lastFrameTime; // Время, прошедшее с момента последнего кадра
    const interval = Time.frameTime / 1000;

    Time.deltaTime = interval * Time.timeScale; // Время между кадрами, учитывая масштаб времени

    Time.time += Time.deltaTime; // Увеличиваем общее игровое время

    Time.unscaledTime += interval; // Обновляем время без учета масштаба времени

    Time.lastFrameTime = now; // Сохраняем текущее время для следующего кадра
  }
}
