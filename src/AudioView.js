import Phaser from "phaser";
import { instance } from "../audioCheck";
import { Heartbeat } from "./HeartbeatService";

export class AudioView extends Phaser.GameObjects.Container {
  initialY = 0;
  targetY = 0;
  bars = [];

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.initialY = y;

    scene.add.existing(this);
    instance.init();

    const particles = scene.add.particles("logo");

    this.emitter = particles.createEmitter({
      speed: 5,
      gravityX: -700,
      gravityY: 0,
      scale: { start: 0.2, end: 0 },
      blendMode: "ADD",
    });

    this.speed = 0.01;
    this.amplitude = 1;

    for (let i = 0; i < 10; i++) {
      const bar = scene.add.rectangle(0, 0, 5, 60, 0xffffff);
      bar.x = i * 20;
      this.add(bar);
      this.bars.push(bar);
    }

    this.emitterContainer = scene.add.container(x, y);
    this.add(this.emitterContainer);
    this.emitter.startFollow(this.emitterContainer);

    scene.events.on("update", () => {
      this.doParticles(scene);
    });
  }
  doParticles(scene) {
    if (instance.pitch) {
      this.targetY = this.initialY + (instance.pitch - 200) * 2;
    } else {
      this.targetY = this.initialY;
    }

    this.emitter.setQuantity(Math.floor(instance.volume * 100));
    this.emitter.setScale({ start: instance.volume * 3, end: 0 });

    const delta = (this.emitterContainer.y - this.targetY) * 0.3;
    const offsetX = Math.sin(scene.time.now * this.speed) * this.amplitude;
    this.emitterContainer.y = this.initialY + delta + offsetX;
  }
}
