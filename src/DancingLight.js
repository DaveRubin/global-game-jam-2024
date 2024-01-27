import Phaser from "phaser";
import { Heartbeat } from "./HeartbeatService";

export class DancingLight extends Phaser.GameObjects.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, "flares", "red");

    Heartbeat.eventEmitter.addEventListener("beat", (e) => {
      if (e.detail.beatCount % 2) {
        scene.tweens.add({
          targets: [this],
          scale: 1.3,
          alpha: 1,
          duration: 300,
          ease: Phaser.Math.Easing.Circular.Out,
        });
        scene.tweens.add({
          targets: [this],
          scale: 1,
          alpha: 0.5,
          duration: 700,
          delay: 300,
          ease: Phaser.Math.Easing.Circular.In,
        });
      }
    });
  }
}
