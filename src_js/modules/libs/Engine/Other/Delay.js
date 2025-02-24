import { Counter } from "./Counter.js";

export class Delay {
  active = false;

  constructor(value = 0) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
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
