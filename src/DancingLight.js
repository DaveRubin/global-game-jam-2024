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
  constructor(scene, x = 0, y = 0, offset, module, color = "red") {
    super(scene, x, y, "flares", color);

    const isStart = offset % module === 0;

    this.scale = !isStart ? MIN.scale : MAX.scale;
    this.alpha = !isStart ? MIN.alpha : MAX.alpha;

    this.blendMode = Phaser.BlendModes.ADD;

    Heartbeat.eventEmitter.addEventListener("beat", (e) => {
      if ((e.detail.beatCount + offset) % module === 0) {
        scene.tweens.add({
          targets: [this],
          ...MAX,
          duration: 100,
          ease: Phaser.Math.Easing.Cubic.Out,
        });
      } else {
        scene.tweens.add({
          targets: [this],
          ...MIN,
          duration: 100,
          ease: Phaser.Math.Easing.Cubic.Out,
        });
      }
    });
  }
}
