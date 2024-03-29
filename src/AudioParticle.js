import Phaser from "phaser";
import { instance } from "../audioCheck";

export class AudioParticle extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0, totalHeight) {
    super(scene, x, y);

    this.sprite = scene.add.sprite(0, 0, "flares", "red");
    this.sprite.scale = 0.3;
    this.add(this.sprite);

    scene.events.on("update", () => {
      this.sprite.scale = instance.volume * 3;

      if (instance.pitch) {
        this.sprite.y = (0.5-this.normalizePitch(instance.pitch)) * totalHeight;
      }
    });
  }

  showArrow(action, x) {
    const isFail = action === 'fail';
    const rect = this.scene.add.sprite(0, this.y + this.sprite.y, isFail ? 'no' : 'arrow');
    rect.alpha = 0.9;
    rect.scale = 0;
    rect.blendMode = "ADD";
    const angle = {
      'up': 90,
      'left': 0,
      'right': 180,
      'no': 0,
    };
    rect.setAngle(angle[action]);
    rect.x = isFail ? this.scene.scale.gameSize.width / 2 : x;
    rect.y = Math.max(rect.y, rect.height * 0.5);

    this.scene.tweens.add({
      targets: rect,
      scale: 1,
      ease: Phaser.Math.Easing.Bounce.Out,
      duration: 300,
    });
    this.scene.time.delayedCall(400, () => {
      this.scene.tweens.add({
        targets: rect,
        scale: 0,
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: 100,
        onComplete: () => rect.destroy()
      });
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
