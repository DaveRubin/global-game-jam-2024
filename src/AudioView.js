import Phaser from "phaser";
import { instance } from "../audioCheck";
import { Heartbeat } from "./HeartbeatService";
import { AudioParticle } from "./AudioParticle";
import { DARK_COLOR, LIGHT_COLOR } from "./colors";

export class AudioView extends Phaser.GameObjects.Container {
  initialY = 0;
  targetY = 0;
  leftBars = [];
  rightBars = [];

  constructor(scene, x = 0, y = 0, height, isShowBoom = true) {
    super(scene, x, y);
    this.initialY = y;
    this.scene = scene;

    scene.add.existing(this);
    this.isShowBoom = isShowBoom;
    instance.init();

    this.height = height;
    this.particalHeight = this.height * 0.9;
    this.barDistance = 60;
    this.barWidth = 2;
    this.leftBarspeed = this.barDistance / Heartbeat.beatTempo;
    this.createBackground();
    Heartbeat.eventEmitter.addEventListener('beat', () => {
      this.isSucceeded = false;
    });
    Heartbeat.onSuccess = (action) => {
      if (!this.isShowBoom) {
        return;
      }
      this.scene.sound.play('glow', { volume: 0.05 });
      this.successOnCurrent();
      this.audioParticles.showArrow(action, this.scene.scale.gameSize.width / 2);
    };
    Heartbeat.onFail = () => {
      this.isSucceeded = true;
      this.audioParticles.showArrow('fail', this.scene.scale.gameSize.width / 2);
    }
    for (let i = 0; i < 3; i++) {
      const bar = scene.add.rectangle(0, this.height / 2, this.barWidth, this.height, 0xffffff);
      bar.x = i * this.barDistance + (scene.scale.gameSize.width / 2);
      this.add(bar);
      this.leftBars.push(bar);
    }
    for (let i = 0; i < 3; i++) {
      const bar = scene.add.rectangle(0, this.height / 2, this.barWidth, this.height, 0xffffff);
      bar.x = i * this.barDistance + (scene.scale.gameSize.width / 2);
      this.add(bar);
      this.rightBars.push(bar);
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
      this.moveBars(scene, time, delta, this.leftBars, 1);
      this.moveBars(scene, time, delta, this.rightBars, -1);

      [this.leftBars[0], this.rightBars[0]].forEach(x => x.alpha = !this.isSucceeded);
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
    const bars = this.getCurrentBars();
    for(let bar of bars) {
      this.emitter.explode(7, bar.x, bar.y);
      this.isSucceeded = true;
    }
  }

  getCurrentBars() {
    return [this.getCurrentBar(this.leftBars), this.getCurrentBar(this.rightBars)];
  }

  getCurrentBar(bars) {
    return bars.reduce((lowest, current) => {
      // If the current item has a lower value than the lowest found so far, update lowest
      if (Math.abs(this.scene.scale.gameSize.width / 2 - current.x) < Math.abs(this.scene.scale.gameSize.width / 2 - lowest.x)) {
          return current;
      } else {
          return lowest;
      }
    }, bars[0]);
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
      (1 - Heartbeat.offset) * this.scene.scale.gameSize.width / 2,
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

  moveBars(scene, time, delta, bars, direction) {
    if (!this.scene) {
      return;
    }
    bars.forEach((bar, i) => {
      const targetX = this.scene.scale.gameSize.width / 2 + this.barDistance * (i) * direction;
      const startX = this.scene.scale.gameSize.width / 2 + this.barDistance * (i+1) * direction;
      bar.x = Phaser.Math.Linear(startX, targetX, Heartbeat.normalizedModule);
    });
  }
}
