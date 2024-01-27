import Phaser from "phaser";
import { DancingLight } from "./DancingLight";

export class Foreground extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    const dance = new DancingLight(scene, 0, scene.scale.gameSize.height / 2);
    this.add(dance);
  }
}
