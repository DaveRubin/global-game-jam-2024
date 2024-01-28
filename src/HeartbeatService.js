import Phaser from "phaser";
import { instance } from "../audioCheck";

class EventEmitter extends EventTarget {
  dispatch(eventName, additionalData = {}) {
    this.dispatchEvent(new CustomEvent(eventName, { detail: additionalData }));
  }
}

class HeartbeatService {
  total;
  onSuccess;
  onFail;
  onSuccessLine;

  eventEmitter = new EventEmitter();
  onSuccessCalibrate;

  isCalibrating = false;
  isKeys = false;

  constructor() {
    this.beatCount = 0;
    this.hadBeat = false;
    this.isBeat = false;
    this.inputAction = null;
    this.lastInputAction = null;

    this.beatTempo = 800;
    this.offset = 0.40;

    const minHex = 45;
    const maxHex = 75;
    const range = maxHex - minHex;
    const part = range / 10;

    const low = new Phaser.Math.Vector2(minHex, minHex + part * 2);
    const mid = new Phaser.Math.Vector2(low.y, low.y + part * 4);
    const high = new Phaser.Math.Vector2(mid.y, mid.y + part * 4);

    this.actions = [
      { name: 'up', window: mid },
      { name: 'left', window: high },
      { name: 'right', window: low },
    ];
    console.log('ok', JSON.stringify(this.actions));
  }

  update(now, keys) {
    this.hadBeat = this.isBeat;
    this.lastInputAction = this.inputAction;
    this.keys = keys;
    this.now = now;

    const lastNormalizedModule = this.normalizedModule;
    this.isBeat = this.calculateBeat(now);

    if (lastNormalizedModule > this.normalizedModule ) {
      this.beatCount++;
      this.nextFrameBeat = true;
      this.eventEmitter.dispatch("beat", { beatCount: this.beatCount });
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
        if (!this.isCalibrating && this.lastInputAction) {
          this.skipBeat = true;
          this.onFail();
        } else if (this.inputAction) {
          this.currentAction = this.inputAction;
          this.onSuccess?.(this.currentAction);
          this.onSuccessLine?.(this.currentAction);
          this.onSuccessCalibrate?.(this.currentAction);
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
    const isWithinBeatWindow = this.normalizedModule > this.offset;
    //console.log('normalized', this.normalizedModule, 'ok', isWithinBeatWindow)
    return isWithinBeatWindow;
  }
  getCurrentAction() {
    if (!this.isKeys || this.keys == null) {
      if (instance.volume < 0.075) {
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
    }
    else {
      if (this.keys.up) {
        return 'up';
      }
      if (this.keys.down) {
        return 'down';
      }
      if (this.keys.left) {
        return 'left';
      }
      if (this.keys.right) {
        return 'right';
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
    console.log("finished calibrating", JSON.stringify(actions));
  }
}

export const Heartbeat = new HeartbeatService();
