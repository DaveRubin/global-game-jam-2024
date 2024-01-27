import Phaser from "phaser";
import { instance } from "../audioCheck";
import { Heartbeat } from "./HeartbeatService";
import { AudioParticle } from "./AudioParticle";
import { DARK_COLOR, LIGHT_COLOR } from "./colors";

export class AudioView extends Phaser.GameObjects.Container {
  initialY = 0;
  targetY = 0;
  bars = [];

  constructor(scene, x = 0, y = 0, height, isShowBoom = true) {
    super(scene, x, y);
    this.initialY = y;
    this.scene = scene;

    scene.add.existing(this);
    this.isShowBoom = isShowBoom;
    instance.init();

    this.height = height;
    this.particalHeight = this.height * 0.9;
    this.barDistance = this.height;
    this.barWidth = 2;
    this.barSpeed = this.barDistance / Heartbeat.beatTempo;
    this.createBackground();
    Heartbeat.onSuccess = (action) => {
      if (!this.isShowBoom) {
        return;
      }
      this.successOnCurrent();
      const bar = this.getCurrentBar();
      const targetX = bar ? bar.x : 0;
      this.audioParticles.showArrow(action, targetX);
    };
    for (let i = 0; i < 3; i++) {
      const bar = scene.add.rectangle(0, this.height / 2, this.barWidth, this.height, 0xffffff);
      bar.x = i * this.barDistance + (scene.scale.gameSize.width / 2);
      this.add(bar);
      this.bars.push(bar);
    }
    const particlesEngine = this.scene.add.particles("flares");

    this.emitter = particlesEngine.createEmitter({
      frame: "blue",
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, -this.height / 2, 2, this.height),
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
    this.audioParticles = new AudioParticle(
      scene,
      this.scene.scale.gameSize.width / 2,
      this.height / 2,
      this.particalHeight
    );
    this.add(this.audioParticles);
  }

  successOnCurrent() {
    const bar = this.getCurrentBar();
    if (bar) {
      this.emitter.explode(7, bar.x, bar.y);
    }
  }

  getCurrentBar() {
    return this.bars.find(
      (bar) => Math.abs(this.scene.scale.gameSize.width / 2 - bar.x) < 32
    );
  }

  createBackground() {
    const background = this.scene.add.rectangle(
      this.scene.scale.gameSize.width / 2,
      this.height / 2,
      this.scene.scale.gameSize.width,
      this.height,
      DARK_COLOR
    );
    const background2 = this.scene.add.rectangle(
      this.scene.scale.gameSize.width / 2,
      this.height / 2,
      40,
      this.height,
      LIGHT_COLOR
    );
    this.add(background);
    this.add(background2);
  }

  createHidingGradients = () => {
    const graphics = this.scene.add.graphics();
    const color = [DARK_COLOR, DARK_COLOR, DARK_COLOR, DARK_COLOR];
    graphics.fillGradientStyle(...color, 1, 0, 1, 0);
    graphics.fillRect(0, 0, 256 / 2, this.height);
    graphics.fillGradientStyle(...color, 0, 1, 0, 1);
    graphics.fillRect(256 / 2, 0, 256 / 2, this.height);
    this.add(graphics);
  };

  moveBars(scene, time, delta) {
    if (!this.scene) {
      return;
    }
    this.bars.forEach((bar, i) => {
      const targetX = 0 + this.barDistance * (i - 2) + this.scene.scale.gameSize.width/2;
      const startX = this.barDistance * (i - 1) + this.scene.scale.gameSize.width/2;
      bar.x = Phaser.Math.Linear(startX, targetX, Heartbeat.normalizedModule);
    });
  }
}
