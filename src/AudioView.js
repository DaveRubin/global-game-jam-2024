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

    this.barDistance = 150;
    this.barWidth = 30;
    this.barSpeed = this.barDistance / Heartbeat.beatTempo;
    
    const wid = scene.scale.gameSize.width * 0.8;
    this.topLine = scene.add.rectangle(scene.scale.gameSize.width/2, this.initialY, wid, 10, 0xffffff);
    this.middleLine = scene.add.rectangle(scene.scale.gameSize.width/2, this.initialY + 40, wid, 10, 0xffffff);
    this.bottomLine = scene.add.rectangle(scene.scale.gameSize.width/2, this.initialY + 80, wid, 10, 0xffffff);

    for (let i = 0; i < 100; i++) {
      const bar = scene.add.rectangle(0, 0, this.barWidth, 150, 0xffffff);
      bar.x = i * this.barDistance;
      this.add(bar);
      this.bars.push(bar);
    }
    this.add([this.topLine, this.middleLine, this.bottomLine, ...this.bars]);

    scene.events.on("update", (time, delta) => {
      this.doParticles(scene);
      this.moveBars(scene, time, delta);
    });
  }
  moveBars(scene, time, delta) {
    for(let bar of this.bars) {
      bar.x -= delta * this.barSpeed;

      const distance = Math.abs(bar.x) / 200;
      const val = 1 - Math.max(0, Math.min(1, distance));
    }
    
    const leftThreshold = -500;
    if (this.bars[0].x < leftThreshold) {
      const replacedBar = this.bars.shift();
      replacedBar.x = this.bars[this.bars.length - 1].x + this.barDistance;
      this.bars.push(replacedBar);
    }
  }
  doParticles(scene) {
    
  }
}
