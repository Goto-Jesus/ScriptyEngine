import { Counter } from "./Counter.js";

class FPSCounter {
  constructor() {
    this.fps = new Counter();
    this.start = undefined;
    this.remember = 0;
    this.result = 0;
  }

  getFPS() {
    this.fps.increment();

    const frames = this.fps.amount;
    const end = this.start;
    const date = new Date();
    this.start = date.getSeconds();

    const seconds = this.start - end; // замыкает

    if (seconds) {
      this.result = frames - this.remember;
      this.remember = frames;
    }

    return this.result;
  }
}

const fpsCounter = new FPSCounter();
export default fpsCounter;
