import {
  Camera,
  viewportSize,
} from "./src/modules/libs/Engine/Components/Camera.js";
import { hero } from "./src/modules/graphics/player/hero.js";
import {
  home as homeImage,
  bicycle as bicycleAnimation,
  water as waterAnimation,
  box_5x5,
  ball as ballImage,
} from "./src/modules/graphics/graphics.js";
import { changeContent } from "./src/modules/changeContent.js";
import { Delay } from "./src/modules/libs/Engine/Other/Delay.js";
import { Animation } from "./src/modules/libs/Engine/Components/Animation.js";
import fpsCounter from "./src/modules/libs/Engine/Other/FPSCounter.js";
import { GameObject } from "./src/modules/libs/Engine/GameObject.js";
import { Vector2D } from "./src/modules/utils/Vector2D.js";

import { AsciiImage } from "./src/modules/libs/Engine/Components/Image.js";
import { BoxCollider2D } from "./src/modules/libs/Engine/Components/Collider.js";
import { Rigidbody2D } from "./src/modules/libs/Engine/Components/RigidBody2D.js";
import { Game } from "./src/modules/libs/Engine/Game.js";
import { Scene } from "./src/modules/libs/Engine/Scene.js";
import { Size } from "./src/modules/utils/Size.js";
import { PhysicMaterial } from "./src/modules/libs/Engine/Physic/PhysicMaterial.js";
import { Animator } from "./src/modules/libs/Engine/Components/Animator.js";

// ---------------------------------------------------------------------------

// Game

const game = new Game();
game.loop(update, render);

const keys = game.keyboard.keys;

// Scene

const scene = new Scene();

// Home
scene.createObject({
  name: "home",
  position: new Vector2D(36, 14),
  image: homeImage,
});

// Bicycle
const bicycle = scene.createObject({
  name: "bicycle",
  position: new Vector2D(27, 27),
  animation: {
    images: bicycleAnimation,
  },
  collider: {
    size: new Size(6, 3),
    localPosition: Vector2D.one,
  },
});

let reverseDirection = false;

// Boxes
// scene.createObject({
//   name: "box",
//   position: new Vector2D(40, 10),
//   image: box_5x5,
//   collider: {
//     size: new Size(9, 5),
//   },
//   rigidbody: true,
// });


// Ball
const ball = scene.createObject({
  name: "ball",
  position: new Vector2D(30, 2),
  image: ballImage,
  collider: {
    size: new Size(4, 2),
    physicMaterial: new PhysicMaterial(0, 1),
  },
  rigidbody: true,
});
// const ball2 = scene.createObject({
//   name: "ball",
//   position: new Vector2D(10, 4),
//   image: ballImage,
//   collider: {
//     size: new Size(4, 2),
//     physicMaterial: new PhysicMaterial(0, 1),
//   },
//   rigidbody: true,
// });
// const ball3 = scene.createObject({
//   name: "ball",
//   position: new Vector2D(20, 2),
//   image: ballImage,
//   collider: {
//     size: new Size(4, 2),
//     physicMaterial: new PhysicMaterial(0, 1),
//   },
//   rigidbody: true,
// });

ball.getComponent(Rigidbody2D).applyForce(new Vector2D(2220, 2220));
// ball2.getComponent(Rigidbody2D).applyForce(new Vector2D(22000, 2220));
// ball3.getComponent(Rigidbody2D).applyForce(new Vector2D(-22000, 990));

// Player
const player = scene.createObject({
  name: "player",
  position: new Vector2D(90, 10),
  collider: {
    size: new Size(5, 3),
    localPosition: Vector2D.one,
  },
  rigidbody: true,
});

const states = ["Idle", "Swim", "Jump", "Run", "Dead", "Crouch"];
player.addComponent(new Animator());
const animator = player.getComponent(Animator);

states.forEach(state => {
  animator.addState(hero[state], state);
});



// Terrain
scene.createArea({
  position: new Vector2D(0, 30),
  size: new Size(70, 10),
});
scene.createArea({
  position: new Vector2D(106, 30),
  size: new Size(22, 10),
});
scene.createArea({
  position: new Vector2D(70, 33),
  size: new Size(36, 7),
});
scene.createArea({
  position: new Vector2D(36, 31),
  size: new Size(36, 7),
});
scene.createArea({
  position: new Vector2D(38, 32),
  size: new Size(36, 7),
});
scene.createArea({
  position: new Vector2D(80, 18),
  size: new Size(36, 7),
});


// Wall
scene.createArea({
  position: new Vector2D(0, 0),
  size: new Size(2, 30),
  // symbol: "X",
});
scene.createArea({
  position: new Vector2D(126, 0),
  size: new Size(2, 30),
  // symbol: "X",
});
scene.createArea({
  position: new Vector2D(0, 0),
  size: new Size(128, 1),
  // symbol: "_",
});

// Water

const water = scene.createObject({
  name: "water",
  position: new Vector2D(-10, 0),
  animation: {
    images: waterAnimation,
    delay: 40,
    reverse: true,
  },
});

// ---------------------------------------------------------------------------

// Camera

const viewport = viewportSize._16x10;
const cameraObject = new GameObject("Camera");
cameraObject.addComponent(new Camera(viewport));
const camera = cameraObject.getComponent(Camera);
const cameraMovingDelay = new Delay(1);

function cameraFollow() {
  const cameraDirection = player.transform.position
    .negative()
    .subtract(cameraObject.transform.position)
    .add(new Vector2D(viewport.width / 2 - 3, 26));

  const cameraMove = cameraDirection.normalize().roundRadius();
  cameraObject.transform.translate(cameraMove);
}

// Speed

const bicycleControllerDelay = new Delay(5);
const playerRb = player.getComponent(Rigidbody2D);

let isGround = false;

function update(deltaTime) {
  scene.rigidbodys.forEach((rb) => rb.update(deltaTime));

  if (cameraMovingDelay.isActive) {
    // cameraFollow();
  }



  // #region (Player Controller)

  isGround = playerRb.overlap.y <= 0;

  if (isGround && !keys.KeyA.pressed && !keys.KeyD.pressed) {
    animator.playState(states[0]);
  }

  if (isGround && keys.KeyW.down) {
    playerRb.applyForce(new Vector2D(0, -200));
  }

  playerRb.velocity.x = 0;

  if (keys.KeyA.pressed) {
    playerRb.velocity.x = -10;
    animator.flipLeft();
    
    if (isGround) {
      animator.playState(states[3]);
    }
  }
  
  if (keys.KeyD.pressed) {
    playerRb.velocity.x = 10;
    animator.flipRight();
    
    if (isGround) {
      animator.playState(states[3]);
    }
  }

  if (keys.KeyS.pressed) {
    animator.playState(states[5]);
    playerRb.collider.setLocalPosition(new Vector2D(1, 2));
    playerRb.collider.setSize(new Size(5, 2));
  } else {
    playerRb.collider.setLocalPosition(Vector2D.one);
    playerRb.collider.setSize(new Size(5, 3));
  }

  if (!isGround) {
    animator.playState(states[2]); // Jump
  }

  //#endregion

  // #region (Player OnBicycle)
  if (
    player
      .getComponent(BoxCollider2D)
      .getColliderTouch(bicycle.getComponent(BoxCollider2D)).y === -1
  ) {
    bicycle.addChild(player);
    bicycle.getComponent(Animation).play();

    if (bicycleControllerDelay.isActive) {
      if (bicycle.transform.position.x < 100 && !reverseDirection) {
        bicycle.transform.translate(Vector2D.right);
      } else {
        reverseDirection = true;
      }

      if (bicycle.transform.position.x > 2 && reverseDirection) {
        bicycle.transform.translate(Vector2D.left);
      } else {
        reverseDirection = false;
      }
    }
  } else {
    bicycle.removeChild(player);
    bicycle.getComponent(Animation).stop();
  }

  // #endregion
}

function render() {
  // Отрисовываем игровое поле и объекты

  changeContent("frames", "FPS:" + fpsCounter.getFPS());

  // #region (Render Camera)
  camera.draw(new AsciiImage().render(), Vector2D.zero);

  const w = water.render();
  const waterPositionX = 70;
  const waterWidth = 6;

  for (let i = 0; i < waterWidth; i++) {
    camera.draw(w, { x: i * 6 + waterPositionX, y: 30 }, camera.currentView);
  }

  scene.gameObjects.forEach(obj => {
    camera.draw(
      obj.render(),
      obj.transform.position,
      camera.currentView
    );
  })

  camera.render("world");
  //#endregion
}

// ---------------------------------------------------------------------------

/* Copy Screen */

document.getElementById("copyButton").addEventListener("click", function () {
  const text = document.getElementById("world").innerText;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const copyButton = document.getElementById("copyButton");
      copyButton.innerText = "Copied!";
      copyButton.classList.add("button--active");

      setTimeout(() => {
        copyButton.innerText = "Copy";
        copyButton.classList.remove("button--active");
      }, 2000); // Через 2 секунды текст кнопки вернется к "Copy"
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});
