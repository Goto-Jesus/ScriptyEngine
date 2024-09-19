export class Counter {
  constructor(amount = 0) {
    if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
      this.amount = amount;
    } else {
      this.amount = 0;
    }
  }

  increment() {
    this.amount++;
  }

  reset() {
    this.amount = 0;
  }
}
