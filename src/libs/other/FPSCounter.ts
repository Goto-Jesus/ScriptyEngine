import { Counter } from './Counter';

class FPSCounter {
  constructor(
    private fps = new Counter(),
    private start = 0,
    private remember = 0,
    private result = 0,
  ) {}

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
