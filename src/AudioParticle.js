import Phaser from "phaser";
import { instance } from "../audioCheck";


export class AudioParticle extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0, totalHeight) {
    super(scene, x, y);

    const sprite = scene.add.sprite(0, 0, "flares", "red");
    sprite.scale = 0.3;
    this.add(sprite);

    scene.events.on("update", () => {
      sprite.scale = instance.volume * 2;

      if (instance.pitch) {
        sprite.y = (0.5-this.normalizePitch(instance.pitch)) * totalHeight;
      }
    });
  }

  normalizePitch = (pitch) => {
    const min = 45;
    const max = 75;
    const range = max - min;
    const clampedValue = Math.min(Math.max(pitch, min), max);
    return (clampedValue - min) / range;
  };
}
