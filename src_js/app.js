import {
  Camera,
  viewportSize,
} from "./modules/libs/Engine/Components/Camera.js";
import { hero } from "./modules/graphics/player/hero.js";
import {
  home as homeImage,
  bicycle as bicycleAnimation,
  water as waterAnimation,
  box_5x5,
  ball as ballImage,
} from "./modules/graphics/graphics.js";
import { changeContent } from "./modules/changeContent.js";
import { Delay } from "./modules/libs/Engine/Other/Delay.js";
import { Animation } from "./modules/libs/Engine/Components/Animation.js";
import fpsCounter from "./modules/libs/Engine/Other/FPSCounter.js";
import { GameObject } from "./modules/libs/Engine/GameObject.js";
import { Vector2D } from "./modules/utils/Vector2D.js";

import { AsciiImage } from "./modules/libs/Engine/Components/Image.js";
import { BoxCollider2D } from "./modules/libs/Engine/Components/Collider.js";
import { Rigidbody2D } from "./modules/libs/Engine/Components/RigidBody2D.js";
import { Game } from "./modules/libs/Engine/Game.js";
import { Scene } from "./modules/libs/Engine/Scene.js";
import { Size } from "./modules/utils/Size.js";
import { PhysicMaterial } from "./modules/libs/Engine/Physic/PhysicMaterial.js";
import { Animator } from "./modules/libs/Engine/Components/Animator.js";

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
  position: new Vector2D(82, 1),
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

// if (true) {
// Boxes
scene.createObject({
  name: "box",
  position: new Vector2D(40, 10),
  image: box_5x5,
  collider: {
    size: new Size(9, 5),
  },
  rigidbody: true,
});


// Ball
  const ball = scene.createObject({
    name: "ball1",
    position: new Vector2D(30, 6),
    image: [
      "/1‾\\",
      "\\__/",
    ],
    collider: {
      size: new Size(4, 2),
      physicMaterial: new PhysicMaterial(0, 1),
    },
    rigidbody: true,
  });
  const ball2 = scene.createObject({
    name: "ball2",
    position: new Vector2D(10, 4),
    image: [
      "/2‾\\",
      "\\__/",
    ],
    collider: {
      size: new Size(4, 2),
      physicMaterial: new PhysicMaterial(0, 1),
    },
    rigidbody: true,
  });
  const ball3 = scene.createObject({
    name: "ball3",
    position: new Vector2D(20, 2),
    image: [
      "/3‾\\",
      "\\__/",
    ],
    collider: {
      size: new Size(4, 2),
      physicMaterial: new PhysicMaterial(0, 1),
    },
    rigidbody: true,
  });
  
  ball.getComponent(Rigidbody2D).applyForce(new Vector2D(2220, 2000));
  ball2.getComponent(Rigidbody2D).applyForce(new Vector2D(12000, 2000));
  ball3.getComponent(Rigidbody2D).applyForce(new Vector2D(-22000, 2000));
// }


const idle = [
    "┌─────┐",
    "│╔═══╗│",
    "│║###║│",
    "│╚═══╝│",
    "└─────┘",
];

const crouch = [
    "",
    "┌─────┐",
    "│╔═══╗│",
    "│╚═══╝│",
    "└─────┘",
];

// Player
const player = scene.createObject({
  name: "player",
  position: new Vector2D(85, 5),
  collider: {
    size: new Size(5, 3),
    localPosition: Vector2D.one,
  },
  image: idle,
  rigidbody: true,
});

const states = ["Idle", "Swim", "Jump", "Run", "Dead", "Crouch"];
player.addComponent(new Animator());
const animator = player.getComponent(Animator);

// const animator = new Animator();

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

scene.createArea({
  position: new Vector2D(80, 18),
  size: new Size(36, 7),
});


for(let i = 0; i < 4; i++) {
  scene.createArea({
    position: new Vector2D(79 - i, 19 + i),
    size: new Size(4, 3),
  });
}

for(let i = 0; i < 4; i++) {
  scene.createArea({
    position: new Vector2D(-1 + i, 26 + i),
    size: new Size(4, 3),
  });
}

/*  */

scene.createArea({
  position: new Vector2D(15, 25),
  size: new Size(1, 4),
});

scene.createArea({
  position: new Vector2D(25, 24),
  size: new Size(1, 4),
});

scene.createArea({
  position: new Vector2D(35, 23),
  size: new Size(1, 4),
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

function controlCamera() {
    if (keys.ArrowUp.pressed) {
      cameraObject.transform.translate(Vector2D.up);
    }
    if (keys.ArrowDown.pressed) {
      cameraObject.transform.translate(Vector2D.down);
    }
    if (keys.ArrowLeft.pressed) {
      cameraObject.transform.translate(Vector2D.right);
    }
    if (keys.ArrowRight.pressed) {
      cameraObject.transform.translate(Vector2D.left);
    }
}

// Speed

const bicycleControllerDelay = new Delay(5);
const playerRb = player.getComponent(Rigidbody2D);

let isGround = false;
let isCrouch = false;
let isJumping = false;

function update(deltaTime) {
  scene.rigidbodys.forEach((rb) => rb.update(deltaTime));

  // console.log("1", ball.transform.position);
  // console.log("2", ball2.transform.position);

  if (cameraMovingDelay.isActive) {
    // cameraFollow();
    controlCamera();
  }

  // #region (Player Controller)

  isGround = playerRb.touchSide.bottom !== 0;
  playerRb.velocity.x = 0;
  playerRb.velocity.y = 0;

  if (isGround && !keys.KeyA.pressed && !keys.KeyD.pressed) {
    animator.playState(states[0]);
  }

  // if (isGround && keys.KeyW.pressed) {
  //   playerRb.applyForce(new Vector2D(0, -100));
  // }

  if (keys.KeyW.pressed) {
    playerRb.velocity.y = -10;
    isJumping = true;
  }
  
  if (isJumping && !keys.KeyW.pressed) {
    playerRb.velocity.y = 0;
    isJumping = false;
  }

  if (keys.KeyS.pressed) {
    playerRb.velocity.y = 10;
  }


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

  console.log(playerRb.touchSide);

  if (isCrouch && !keys.KeyS.pressed && playerRb.touchSideSecond.top === 0) {
    playerRb.collider.setLocalPosition(Vector2D.one);
    playerRb.collider.setSize(new Size(5, 3));
    playerRb.gameObject.image.strings = idle;
    isCrouch = false;
  }

  if (keys.KeyS.down) {
    isCrouch = true;
  }
  
  
  if (isCrouch) {
    animator.playState(states[5]);
    playerRb.collider.setLocalPosition(new Vector2D(1, 2));
    playerRb.collider.setSize(new Size(5, 2));
    playerRb.gameObject.image.strings = crouch;
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
