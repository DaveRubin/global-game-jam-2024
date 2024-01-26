import Phaser from "phaser";
import { instance } from "../audioCheck";

const normalizePitch = (pitch) => {
  const clampedValue = Math.min(Math.max(pitch, 100), 350);
  return (clampedValue - 225) / 225;
};

export class AudioParticle extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);

    const sprite = scene.add.sprite(0, 0, "flares", "red");
    sprite.scale = 0.3;
    this.add(sprite);

    scene.events.on("update", () => {
      sprite.scale = instance.volume * 2;
      if (instance.pitch) {
        sprite.y = normalizePitch(instance.pitch) * -64;
      }
    });
  }
}