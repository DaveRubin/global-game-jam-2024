import Phaser from "phaser";
import { Heartbeat } from "./HeartbeatService";


const MAX = {
  scale: 1,
  alpha: 0.5,
}

const MIN = {
  scale: 0.1,
  alpha: 0.2,
}

export class DancingLight extends Phaser.GameObjects.Sprite {
  constructor(scene, x = 0, y = 0, isOffset = false) {
    super(scene, x, y, "flares", "red");
    const offset = isOffset ? 1 : 0;

    this.scale = offset ? MIN.scale : MAX.scale;
    this.alpha = offset ? MIN.alpha : MAX.alpha;

    this.blendMode = Phaser.BlendModes.ADD;

    Heartbeat.eventEmitter.addEventListener("beat", (e) => {
      if ((e.detail.beatCount + offset) % 2) {
        scene.tweens.add({
          targets: [this],
          ...MAX,
          duration: 200,
          ease: Phaser.Math.Easing.Cubic.Out,
        });
        scene.tweens.add({
          targets: [this],
          ...MIN,
          duration: 700,
          delay: 300,
          ease: Phaser.Math.Easing.Cubic.In,
        });
      }
    });
  }
}
