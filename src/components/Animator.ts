import { Animation } from './Animation';
import { Component } from '../core/Component';
import { GameObject } from '../objects/GameObject';

enum Directions {
  RIGHT = 0,
  LEFT = 1,
}

class AnimationState {
  public facingDirection: Directions = Directions.RIGHT;
  public animation: Animation;

  constructor(
    public images: [string[][], string[][]],
    public name: string,
  ) {
    this.animation = new Animation(images[this.facingDirection]); // Экземпляр класса Animation
  }

  flipLeft() {
    this.facingDirection = Directions.LEFT;
    this.animation.setImages(this.images[this.facingDirection]);
  }

  flipRight() {
    this.facingDirection = Directions.RIGHT;
    this.animation.setImages(this.images[this.facingDirection]);
  }
}

export class Animator extends Component {
  constructor() {
    super();
  }
  public facingDirection: Directions = Directions.RIGHT;
  public states: Record<string, AnimationState> = {}; // Хранилище состояний
  public currentState: AnimationState | null = null; // Текущее состояние
  public defaultState: AnimationState | null = null; // Состояние по умолчанию

  attach(gameObject: GameObject) {
    super.attach(gameObject);

    if (this.gameObject) {
      this.gameObject.image = this;
    }
  }

  setDefaultState(name: string) {
    const state = this.states[name];
    this.defaultState = state;
  }

  addState(imagesState: [string[][], string[][]], name: string) {
    const state = new AnimationState(imagesState, name);
    this.states[name] = state;

    if (!this.defaultState) {
      this.defaultState = state; // Устанавливаем первое добавленное состояние как состояние по умолчанию
      this.currentState = state;
    }
  }

  playState(name: string) {
    if (this.currentState && this.currentState.name !== name) {
      if (this.states[name]) {
        this.currentState = this.states[name];
        this.currentState.animation.play(); // Запускаем анимацию в новом состоянии

        if (this.facingDirection === 1) {
          this.currentState.flipLeft();
        } else {
          this.currentState.flipRight();
        }
      }
    }
  }

  flipLeft() {
    this.facingDirection = Directions.LEFT;

    if (this.currentState) {
      this.currentState.flipLeft();
    }
  }

  flipRight() {
    this.facingDirection = Directions.RIGHT;

    if (this.currentState) {
      this.currentState.flipRight();
    }
  }

  stop() {
    if (this.currentState) {
      this.currentState.animation.stop(); // Останавливаем текущую анимацию
    }
  }

  render(): string[] {
    if (this.currentState) {
      return this.currentState.animation.render(); // Возвращаем текущий кадр анимации
    }
    return [''];
  }
}
