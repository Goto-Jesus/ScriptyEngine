import { Counter } from './Counter';

export class Delay {
  active = false;

  constructor(
    public value: number = 0,
    private count = new Counter(),
  ) {
    if (!isNaN(value) && isFinite(value)) {
      this.value = value;
    } else {
      this.value = 0;
    }

    this.count = new Counter();
  }

  get isActive() {
    return this.update();
  }

  update() {
    this.count.increment();

    if (this.count.amount - 1 >= this.value) {
      this.count.reset();
      this.active = true;
    } else {
      this.active = false;
    }

    return this.active;
  }
}
