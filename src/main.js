import Phaser from "phaser";

import GameScene from "./GameScene";
import MainMenuScene from "./MainMenuScene";
import YouLoseScene from "./YouLoseScene";

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
  scene: [GameScene, YouLoseScene, MainMenuScene],
};

export default new Phaser.Game(config);
