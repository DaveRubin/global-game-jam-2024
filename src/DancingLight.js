import Phaser from "phaser";
import { Heartbeat } from "./HeartbeatService";

export class DancingLight extends Phaser.GameObjects.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, "flares", "red");

    Heartbeat.eventEmitter.addEventListener("beat", (e) => {
      if (e.detail.beatCount % 2) {
        console.log("beat");
      }
    });
  }
}
