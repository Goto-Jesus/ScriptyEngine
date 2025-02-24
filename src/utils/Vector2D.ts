export class Vector2D {
  constructor(
    public x = 0,
    public y = 0
  ) { }

  /* Static Properties */

  static up = new Vector2D(0, 1);
  static down = new Vector2D(0, -1);
  static right = new Vector2D(1, 0);
  static left = new Vector2D(-1, 0);
  static zero = new Vector2D();
  static one = new Vector2D(1, 1);

  /* Properties */

  // Свойство, возвращающее длину вектора (модуль)
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // Свойство, возвращающее нормализованный вектор
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0); // Если вектор нулевой, вернуть нулевой вектор
    return new Vector2D(this.x / mag, this.y / mag);
  }

  // Свойство, возвращающее квадрат длины вектора
  sqrMagnitude() {
    return this.x ** 2 + this.y ** 2;
  }

  // Индексный доступ к компонентам вектора
  get(index) {
    if (index === 0) return this.x;
    if (index === 1) return this.y;
    throw new Error("Index out of bounds. Use 0 for 'x' and 1 for 'y'.");
  }

  /* Operators */

  subtract(v = new Vector2D()) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  multiply(scalar = 0) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  divide(scalar = 0) {
    if (scalar === 0) {
      throw new Error("Division by zero is not allowed.");
    }
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  add(v = new Vector2D()) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  equals(v = new Vector2D()) {
    // сравнение векторов
    const epsilon = 0.000001; // Порог для сравнения с учетом погрешности
    return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon;
  }

  // Метод для ограничения длины вектора
  clamp(maxLength) {
    const length = this.magnitude();

    // Если длина вектора больше максимального значения, ограничиваем его
    if (length > maxLength) {
      const normalized = this.normalize(); // Получаем нормализованный вектор (с длиной 1)
      return normalized.multiply(maxLength); // Умножаем на максимальную длину
    }

    return this; // Если длина вектора не превышает maxLength, возвращаем исходный вектор
  }


  maxRadius(v = new Vector2D()) {
    const x = this.x > 0 ? Math.max(this.x) : Math.floor(this.x);
    const y = this.y > 0 ? Math.ceil(this.y) : Math.floor(this.y);
    return new Vector2D(x, y);
  }


  roundRadius() {
    const x = this.x > 0 ? Math.ceil(this.x) : Math.floor(this.x);
    const y = this.y > 0 ? Math.ceil(this.y) : Math.floor(this.y);
    return new Vector2D(x, y);
  }

  round() {
    return new Vector2D(Math.round(this.x), Math.round(this.y));
  }

  floor() {
    return new Vector2D(Math.floor(this.x), Math.floor(this.y));
  }

  ceil() {
    return new Vector2D(Math.ceil(this.x), Math.ceil(this.y));
  }

  negative() {
    return new Vector2D(this.x * -1, this.y * -1);
  }

  /* Public Methods */

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

/* ------------------------------------------------- */

function movement(
  startPosition = Vector2D.zero,
  targetPosition = Vector2D.zero
) {
  // Sx=x-x0;
  return targetPosition.subtract(startPosition);
}
