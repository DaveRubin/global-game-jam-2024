import Phaser from "phaser";

import GameScene from "./GameScene";
import MainMenuScene from "./MainMenuScene";
import YouLoseScene from "./YouLoseScene";
import CalibrateScene from "./CalibrateScene";
import LoaderScene from "./LoaderScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 192,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [LoaderScene, CalibrateScene, MainMenuScene, GameScene, YouLoseScene],
};

export default new Phaser.Game(config);
