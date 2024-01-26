import Phaser from "phaser";
import { instance } from "../audioCheck";
import { Heartbeat } from "./HeartbeatService";
import { AudioParticle } from "./AudioParticle";

const DARK_COLOR = 0x220022;
const LIGHT_COLOR = 0x440044;

export class AudioView extends Phaser.GameObjects.Container {
  initialY = 0;
  targetY = 0;
  bars = [];

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.initialY = y;
    this.scene = scene;

    scene.add.existing(this);
    instance.init();

    this.barDistance = 96;
    this.barWidth = 2;
    this.barSpeed = this.barDistance / Heartbeat.beatTempo;
    this.createBackground();
    Heartbeat.onSuccess = () => {
      this.successOnCurrent();
    };
    for (let i = 0; i < 3; i++) {
      const bar = scene.add.rectangle(0, 96 / 2, this.barWidth, 96, 0xffffff);
      bar.x = i * this.barDistance;
      this.add(bar);
      this.bars.push(bar);
    }
    const particlesEngine = this.scene.add.particles("flares");

    this.emitter = particlesEngine.createEmitter({
      frame: "blue",
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, -96 / 2, 2, 96),
      },
      x: 0,
      y: 0,
      quantity: 0,
      lifespan: 500,
      speed: { min: 10, max: 50 },
      scale: { start: 0.4, end: 0 },
      gravityY: 2,
      blendMode: "ADD",
      emitting: false,
    });

    scene.events.on("update", (time, delta) => {
      this.moveBars(scene, time, delta);
    });
    this.createHidingGradients();
    const particle = new AudioParticle(
      scene,
      this.scene.scale.gameSize.width / 2,
      96 / 2
    );
    this.add(particle);
  }

  successOnCurrent() {
    const bar = this.bars.find(
      (bar) => Math.abs(this.scene.scale.gameSize.width / 2 - bar.x) < 32
    );
    if (bar) {
      this.emitter.explode(100, bar.x, bar.y);
    }
  }

  createBackground() {
    const background = this.scene.add.rectangle(
      this.scene.scale.gameSize.width / 2,
      96 / 2,
      this.scene.scale.gameSize.width,
      96,
      DARK_COLOR
    );
    const background2 = this.scene.add.rectangle(
      this.scene.scale.gameSize.width / 2,
      96 / 2,
      40,
      96,
      LIGHT_COLOR
    );
    this.add(background);
    this.add(background2);
  }

  createHidingGradients = () => {
    const graphics = this.scene.add.graphics();
    const color = [DARK_COLOR, DARK_COLOR, DARK_COLOR, DARK_COLOR];
    graphics.fillGradientStyle(...color, 1, 0, 1, 0);
    graphics.fillRect(0, 0, 192 / 2, 96);
    graphics.fillGradientStyle(...color, 0, 1, 0, 1);
    graphics.fillRect(192 / 2, 0, 192 / 2, 96);
    this.add(graphics);
  };

  moveBars(scene, time, delta) {
    this.bars.forEach((bar, i) => {
      const targetX = 0 + this.barDistance * i;
      const startX = this.barDistance * (i+1);
      bar.x = Phaser.Math.Linear(startX, targetX, Heartbeat.normalizedModule);
    });
  }
}
