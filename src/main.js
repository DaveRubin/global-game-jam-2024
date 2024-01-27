import Phaser from "phaser";

import GameScene from "./GameScene";
import MainMenuScene from "./MainMenuScene";
import YouLoseScene from "./YouLoseScene";
import CalibrateScene from "./CalibrateScene";
import LoaderScene from "./LoaderScene";
import YouWinScene from "./YouWinScene";
import StartScene from "./StartScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 256,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [LoaderScene, CalibrateScene, MainMenuScene, GameScene, YouLoseScene, YouWinScene, StartScene],
};

export default new Phaser.Game(config);
