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
import { BackFail, Block, Damage, Hit, Kick, Lie, Trick } from './libs/graphic/player';

const game = new GameEngine();
const keys = game.keyboard.keys;

// Scene

const scene = new SceneManager();

// Objects
scene.createObject({
  name: "home",
  position: {x: 82, y: 1},
  image: home.frames[0],
});

scene.createObject({
  name: "box",
  position: {x: 40, y: 5},
  image: box.frames[0],
  rigidbody: true,
  collider: {
    size: {
      width: 10,
      height: 5,
    },
  }
});

scene.createObject({
  name: "box",
  position: {x: 40, y: 1},
  image: box.frames[0],
  rigidbody: true,
  collider: {
    size: {
      width: 10,
      height: 5,
    },
  }
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

// Player

// scene.createObject({
//   name: "Player",
//   position: { x: 50, y: 25 },
//   animation: {
//     images: BackFail,
//     amountDelay: 5,
//     reverse: false,
//   },
// });

scene.createObject({
  name: "Player",
  position: { x: 32, y: 0 },
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

// Camera

const viewport = viewportSize._16x10;
const cameraObject = new GameObject('Camera');
cameraObject.addComponent(new Camera(viewport));
const camera = cameraObject.getComponent(Camera);
const cameraMovingDelay = new Delay(1);

// function cameraFollow() {
//   const cameraDirection = player.transform.position
//     .negative()
//     .subtract(cameraObject.transform.position)
//     .add(new Vector2D(viewport.width / 2 - 3, 26));

//   const cameraMove = cameraDirection.normalize().roundRadius();
//   cameraObject.transform.translate(cameraMove);
// }

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

// GameLoop
function update() {
  scene.rigidbodys.forEach((rb) => rb.update());

  if (cameraMovingDelay.isActive) {
    // cameraFollow();
    controlCamera();
  }
}

function render() {
  changeContent("frames", "FPS:" + fpsCounter.getFPS());

  // #region (Render Camera)
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
  //#endregion
}

game.loop(update, render);
