import { GameEngine } from './core/GameEngine';
import { SceneManager } from './core/SceneManager';

import { Vector2D } from './utils/Vector2D';
import { Size } from './utils/Size';

import { home } from "./libs/graphic/home";
import { box } from "./libs/graphic/box";
import { Delay } from './libs/other/Delay';

import { GameObject } from './objects/GameObject';

import { Camera, viewportSize } from './components/Camera';
import { AsciiImage } from './components/AsciiImage';

import { changeContent } from './libs/changeContent';
import fpsCounter from './libs/other/FPSCounter';
import { water } from './libs/graphic/water';
import { BackFail, Block, Damage, hero, Hit, Kick, Lie, Trick } from './libs/graphic/player';
import { COLORS, Colors } from './utils/colors';
import { Animator } from './components/Animator';
import { Rigidbody2D } from './components/RigidBody2D';

const game = new GameEngine();
const keys = game.keyboard.keys;

// Scene

const scene = new SceneManager();

// Objects
scene.createObject({
  name: "home",
  color: "green",
  position: {x: 82, y: 1},
  image: home.frames[0],
});

scene.createObject({
  name: "box",
  color: "cyan",
  position: {x: 40, y: 5},
  image: box.frames[0],
  rigidbody: true,
  collider: {
    size: {
      width: 9,
      height: 5,
    },
  }
});

scene.createObject({
  name: "box",
  color: "cyan",
  position: {x: 40, y: 1},
  image: box.frames[0],
  rigidbody: true,
  collider: {
    size: {
      width: 9,
      height: 5,
    },
  }
});
scene.createObject({
  name: "box",
  color: "cyan",
  position: {x: 60, y: 1},
  image: box.frames[0],
  rigidbody: true,
  collider: {
    size: {
      width: 9,
      height: 5,
    },
  }
});


// Player

scene.createObject({
  name: "Dead Player",
  position: { x: 32, y: 0 },
  color: "red",
  animation: {
    images: Lie[0],
    // images: Hit[0],
    // images: Damage,
    amountDelay: 7,
    reverse: false,
  },
  rigidbody: true,
  collider: {
    size: {
      width: 10,
      height: 2,
    },
    localPosition: {x: 0, y: 2},
  }
});

const capsule = {
  Idle: [
    "╔─────╗",
    "│┌═══┐│",
    "│║   ║│",
    "│└═══┘│",
    "╚─────╝",
  ],
  Crouch: [
    "",
    "╔─────╗",
    "│┌═══┐│",
    "│└═══┘│",
    "╚─────╝",
  ],
}

const player = scene.createObject({
  name: "Player",
  position: new Vector2D(85, 5),
  collider: {
    size: new Size(5, 3),
    localPosition: Vector2D.one,
  },
  image: capsule.Idle,
  rigidbody: true,
});

const states: (keyof typeof hero)[] = ["Idle", "Swim", "Jump", "Run", "Dead", "Crouch"] as const;

player.addComponent(new Animator());

const animator = player.getComponent(Animator);

if (animator) {
  states.forEach(state => {
    animator.addState(hero[state], state);
  });
}

// Controller

const playerRb = player.getComponent(Rigidbody2D);

let isGround = false;
let isCrouch = false;
let isJumping = false;


function playerController() {
  if (playerRb && animator) {
    // #region (Player Controller)
  
    isGround = playerRb.touchSide.bottom !== 0;
    playerRb.velocity.x = 0;
    playerRb.velocity.y = 0;
  
    if (isGround && !keys.KeyA.pressed && !keys.KeyD.pressed) {
      animator.playState(states[0]);
    }
  
    if (isGround && keys.KeyW.pressed) {
      isJumping = true;
    }

    if (
      isJumping &&
      keys.KeyW.pressed &&
      playerRb.touchSideSecond.top < 1
    ) {
      playerRb.velocity.y = -10;
    }
    
    if (isJumping && !keys.KeyW.pressed || playerRb.touchSideSecond.top > 0) {
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
  
    console.log(
      playerRb.touchSide,
      playerRb.touchSideSecond,
    );
  
    if (keys.KeyS.down) {
      isCrouch = true;
    }
  
  
    if (isCrouch && !keys.KeyS.pressed && playerRb.touchSideSecond.top === 0) {
      playerRb.collider?.setLocalPosition(Vector2D.one);
      playerRb.collider?.setSize(new Size(5, 3));
      // playerRb.gameObject.image.strings = capsule.Idle;
      isCrouch = false;
    }
  
    if (isCrouch) {
      animator.playState(states[5]);
      playerRb.collider?.setLocalPosition(new Vector2D(1, 2));
      playerRb.collider?.setSize(new Size(5, 2));
      // playerRb.gameObject.image.strings = capsule.Crouch;
    }
    
  
  
    if (!isGround) {
      animator.playState(states[2]); // Jump
    }
  }
}

// Terrain
scene.createArea({
  position: {x: 0, y: 30},
  size: {width: 70, height: 10},
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

for (let i = 0; i < 4; i++) {
  scene.createArea({
    position: new Vector2D(79 - i, 19 + i),
    size: new Size(4, 3),
  });
}

for (let i = 0; i < 4; i++) {
  scene.createArea({
    position: new Vector2D(-1 + i, 26 + i),
    size: new Size(4, 3),
  });
}

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
});
scene.createArea({
  position: new Vector2D(126, 0),
  size: new Size(2, 30),
});
scene.createArea({
  position: new Vector2D(0, 0),
  size: new Size(128, 1),
});

// Water
const waterPositionX = 70;
const waterWidth = 6;

for (let i = 0; i < waterWidth; i++) {
  scene.createObject({
    name: "water",
    position: new Vector2D(i * 6 + waterPositionX, 30),
    animation: {
      images: water.frames,
      amountDelay: 25,
      reverse: true,
    },
  });
}



/* 
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
*/

// Camera
/*

const viewport = viewportSize._16x10;
const cameraObject = new GameObject('Camera');
cameraObject.addComponent(new Camera(viewport));
const camera = cameraObject.getComponent(Camera);
const cameraMovingDelay = new Delay(1);

*/

// function cameraFollow() {
//   const cameraDirection = player.transform.position
//     .negative()
//     .subtract(cameraObject.transform.position)
//     .add(new Vector2D(viewport.width / 2 - 3, 26));

//   const cameraMove = cameraDirection.normalize().roundRadius();
//   cameraObject.transform.translate(cameraMove);
// }

/*

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
  
*/

// GameLoop
function update() {
  scene.rigidbodys.forEach((rb) => rb.update());

  playerController();

  /*

  if (cameraMovingDelay.isActive) {
    // cameraFollow();
    controlCamera();
  }
  
  */
}

const heightViewport = 36;
const widthViewport = 64 * 2;

function drawsReversed(
  images: {
    image: string[];
    position: Vector2D;
    color?: keyof Colors,
  }[],
  colors: Colors,
  fonChar = ' ',
) {
  const display = new Array(heightViewport);
  for (let y = 0; y < heightViewport; y++) {
    display[y] = new Array(widthViewport).fill(fonChar);
  }

  for (let i = images.length - 1; i >= 0; i--) {
    const { image, position, color } = images[i];
    const colorCode = color && colors[color] || '';
    const resetCode = color && colors.reset || '';

    for (let dy = 0; dy < image.length; dy++) {
      const y = position.y + dy;
      if (y < 0 || y >= heightViewport) continue;

      const line = image[dy];

      for (let dx = 0; dx < line.length; dx++) {
        const x = position.x + dx;
  
        if (x < 0 || x >= widthViewport) continue;

        const char = line[dx];

        if (char !== ' ' && display[y][x] === fonChar) {
          if (color) {
            display[y][x] = colorCode + char + resetCode;
            continue;
          }
  
          display[y][x] = char;
        }
      }
    }
  }

  return display.map(row => row.join('')).join('\n');
}

function render() {
  changeContent("frames", "FPS:" + fpsCounter.getFPS());

  // #region (Render Camera)
  /*
  
  if (camera) {
    camera.draw(new AsciiImage().render(), Vector2D.zero);

    scene.gameObjects.forEach(obj => {
      camera.draw(
        obj.render(),
        obj.transform.position,
        camera.currentView,
      );
    });

    camera.render('world');
  }

  */

  const images = scene.gameObjects.map(
    (obj) => ({
      image: obj.render(),
      position: obj.transform.position,
      color: obj.color,
    })
  );
  
  changeContent('world', drawsReversed(images, COLORS));
  //#endregion
}

game.loop(update, render);
