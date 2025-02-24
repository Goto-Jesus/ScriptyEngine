import { Animation } from "./Animation.js";
import { Component } from "./Component.js";

const Directions = {
  RIGHT: 0,
  LEFT: 1,
};

class AnimationState {
  constructor(images = [[new Image()], [new Image()]], name) {
    this.name = name;
    this.images = images;
    this.facingDirection = Directions.RIGHT;
    this.animation = new Animation(this.images[this.facingDirection]); // Экземпляр класса Animation
  }

  flipLeft() {
    this.facingDirection = 1;
    this.animation.setImages(this.images[this.facingDirection]);
  }

  flipRight() {
    this.facingDirection = 0;
    this.animation.setImages(this.images[this.facingDirection]);
  }
}

export class Animator extends Component {
  constructor() {
    super();
    this.facingDirection = 0;
    this.states = {}; // Хранилище состояний
    this.currentState = null; // Текущее состояние
    this.defaultState = null; // Состояние по умолчанию
  }

  attach(gameObject) {
    super.attach(gameObject);
    this.gameObject.image = this;
  }

  setDefaultState(name) {
    const state = this.states[name];
    this.defaultState = state;
  }

  addState(imagesState, name) {
    const state = new AnimationState(imagesState, name);
    this.states[name] = state;

    if (!this.defaultState) {
      this.defaultState = state; // Устанавливаем первое добавленное состояние как состояние по умолчанию
      this.currentState = state;
    }
  }

  playState(name) {
    if (this.currentState.name !== name) {
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
    this.facingDirection = 1;
    this.currentState.flipLeft();
  }
  
  flipRight() {
    this.facingDirection = 0;
    this.currentState.flipRight();
  }

  stop() {
    if (this.currentState) {
      this.currentState.animation.stop(); // Останавливаем текущую анимацию
    }
  }

  render() {
    if (this.currentState) {
      return this.currentState.animation.render(); // Возвращаем текущий кадр анимации
    }
    return [""];
  }
}
