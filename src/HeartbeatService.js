import Phaser from "phaser";
import { instance } from "../audioCheck";

class HeartbeatService {
  total;
  onSuccess;
  constructor() {
    this.beatCount = 0;
    this.hadBeat = false;
    this.isBeat = false;
    this.inputAction = null;
    this.lastInputAction = null;

    this.beatWindowLength = 750;
    this.beatTempo = 1000;

    this.actions = [
      { window: new Phaser.Math.Vector2(100, 200), name: "up" },
      { window: new Phaser.Math.Vector2(300, 400), name: "left" },
      { window: new Phaser.Math.Vector2(200, 300), name: "right" },
    ];
  }

  update(now) {
    this.hadBeat = this.isBeat;
    this.lastInputAction = this.inputAction;

    this.isBeat = this.calculateBeat(now);

    if (!this.hadBeat && this.isBeat) {
      this.beatCount++;
    }

    this.inputAction = this.getCurrentAction();
    this.calculateAction();

    if (this.currentAction != null) {
      console.log(
        "isBeat: " + this.isBeat,
        "count: " + this.beatCount,
        "action: " + this.currentAction,
        "pitch: ",
        instance.pitch,
        "volumne: ",
        instance.volume
      );
    }
  }
  calculateAction() {
    if (this.isBeat) {
      if (this.skipBeat) {
        this.currentAction = null;
      } else {
        if (this.lastInputAction) {
          this.skipBeat = true;
        } else if (this.inputAction) {
          this.currentAction = this.inputAction;
          this.onSuccess?.(this.currentAction);
          this.skipBeat = true;
        }
      }
    } else {
      this.skipBeat = false;
      this.currentAction = null;
    }
  }
  calculateBeat(now) {
    const module = now % this.beatTempo;
    const isWithinBeatWindow = module < this.beatWindowLength;
    return isWithinBeatWindow;
  }
  getCurrentAction() {
    if (instance.volume < 0.1) {
      return null;
    }
    for (let action of this.actions) {
      if (
        action.window.x < instance.pitch &&
        instance.pitch < action.window.y
      ) {
        return action.name;
      }
    }
    return null;
  }
}

export const Heartbeat = new HeartbeatService();
