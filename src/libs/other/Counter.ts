export class Counter {
  constructor(public amount: number = 0) {
    if (!isNaN(amount) && isFinite(amount)) {
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
