import Phaser from "phaser";
import { instance } from "../audioCheck";

export class AudioView extends Phaser.GameObjects.Container {
  initialY = 0;
  targetY = 0;
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.initialY = y;

    scene.add.existing(this);
    instance.init();

    const particles = scene.add.particles("logo");

    const emitter = particles.createEmitter({
      speed: 5,
      gravityX: -700,
      gravityY: 0,
      scale: { start: 0.2, end: 0 },
      blendMode: "ADD",
    });

    const speed = 0.01;
    const amplitude = 1;

    for (let i = 0; i < 4; i++) {
      const bar = scene.add.rectangle(0, 0, 5, 60, 0xffffff);
      bar.x = i * 20;
      this.add(bar);
    }

    const emitterContainer = scene.add.container(x, y);
    this.add(emitterContainer);
    emitter.startFollow(emitterContainer);

    scene.events.on("update", () => {
      if (instance.pitch) {
        this.targetY = this.initialY + (instance.pitch - 200) * 2;
        emitter;
      } else {
        this.targetY = this.initialY;
      }

      emitter.setQuantity(Math.floor(instance.volume * 100));
      emitter.setScale({ start: instance.volume * 3, end: 0 });

      const delta = (emitterContainer.y - this.targetY) * 0.3;
      const offsetX = Math.sin(scene.time.now * speed) * amplitude;
      emitterContainer.y = y + delta + offsetX;
    });
  }
}
