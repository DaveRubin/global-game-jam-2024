import Phaser from "phaser";
import { instance } from "../audioCheck";

class HeartbeatService {
  total;
  onSuccess;
  onSuccessCalibrate;

  isCalibrating = false;

  constructor() {
    this.beatCount = 0;
    this.hadBeat = false;
    this.isBeat = false;
    this.inputAction = null;
    this.lastInputAction = null;

    this.beatTempo = 750;
    this.startOffset = 0.35;
    this.endOffset = 0.35;

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
          this.onSuccessCalibrate?.();
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
    this.normalizedModule = this.module / this.beatTempo;
    console.log('normnalized', this.normalizedModule, 'now', now, 'module', this.module);
    const isWithinBeatWindow = this.normalizedModule > (1 - this.startOffset) || this.normalizedModule < this.endOffset;

    return isWithinBeatWindow;
  }
  getCurrentAction() {
    if (instance.volume < 0.1) {
      return null;
    }

    if (this.isCalibrating) {
      if (instance.pitch) {
        return 'calibrate';
      }
      else {
        return null;
      }
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
  startCalibrate() {
    Heartbeat.isCalibrating = true;
  }
  finishCalibrate(actions) {
    this.actions = actions;
    Heartbeat.isCalibrating = false;
    Heartbeat.onSuccessCalibrate = null;
    console.log('finished calibrating', JSON.stringify(actions));
  }
}

export const Heartbeat = new HeartbeatService();
