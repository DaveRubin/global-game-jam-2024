import Phaser from "phaser";
import { DARK_COLOR } from "./colors";

export class Foreground extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    // const rect = scene.add.rectangle(
    //   scene.scale.gameSize.width / 2,
    //   scene.scale.gameSize.height / 2,
    //   scene.scale.gameSize.width,
    //   scene.scale.gameSize.height * 2,
    //   DARK_COLOR
    // );
    // rect.alpha = 0.6;
    // rect.blendMode = Phaser.BlendModes.MULTIPLY;

    const sprite = scene.add.sprite(
      0,
      scene.scale.gameSize.height / 2,
      "flares",
      "red"
    );
    sprite.scale = 3;
    // sprite.alpha = 0.5;
    sprite.blendMode = Phaser.BlendModes.SCREEN;

    this.add(sprite);
    // this.add(rect);
  }
}
