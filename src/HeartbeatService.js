import Phaser from "phaser";
import { instance } from "../audioCheck";

class HeartbeatService {
  total;
  onSuccess;

  isCalibrating = false;

  constructor() {
    this.beatCount = 0;
    this.hadBeat = false;
    this.isBeat = false;
    this.inputAction = null;
    this.lastInputAction = null;

    this.beatTempo = 750;
    this.offset = 0.35;

    this.actions = [
      { window: new Phaser.Math.Vector2(0, 200), name: "up" },
      { window: new Phaser.Math.Vector2(200, 400), name: "left" },
      { window: new Phaser.Math.Vector2(400, 600), name: "right" },
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
    this.module = now % this.beatTempo;
    const isWithinBeatWindow = this.normalizedModule < this.offset || this.normalizedModule > 1-this.offset;
    this.normalizedModule = this.module / this.beatTempo;

    return isWithinBeatWindow;
  }
  getCurrentAction() {
    if (instance.volume < 0.1) {
      return null;
    }

    if (this.isCalibrating) {
      return 'calibrate';
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
  calibrate() {
    if (this.latestCalibratedBeat === this.beatCount) {
      return;
    }
    if (!instance.pitch) {
      return;
    }
    this.latestCalibratedBeat = this.beatCount;
    const list = ['up', 'left', 'right'];
    for(let action of list) {
      if (this.actions.map(x => x.name).includes(action)) {
        continue;
      }
      this.actions.push({name: action, window: new Phaser.Math.Vector2(instance.pitch - 100, instance.pitch + 100)})
      break;
    }
    console.log('calibrating', JSON.stringify(this.actions));
    this.isCalibrating = list.length !== this.actions.length;
  }
}

export const Heartbeat = new HeartbeatService();
