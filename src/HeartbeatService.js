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

    this.beatTempo = 1000;
    this.volumeThreshold = 0.035;
    this.offset = 0.5;
    this.graceTime = 500;
    this.currentGrace = 0;
    this.coyote = 0.3;

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
    this.calculateBeat(now);

    if (lastNormalizedModule > this.normalizedModule ) {
      this.canCoyote = !this.skipBeat;
      this.beatCount++;
      this.skipBeat = false;
      this.eventEmitter.dispatch("beat", { beatCount: this.beatCount });
    }
    this.inputAction = this.getCurrentAction();
    this.calculateAction(now);

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
  calculateAction(now) {
    this.currentAction = null;
    if (this.skipBeat) {
      return;
    }

    if (this.currentGrace > now) {
      return;
    }

    if (this.inputAction) {
      this.skipBeat = !this.isCoyote;
      this.currentGrace = this.graceTime + now;
      if (!this.isCoyote && !this.isBeat && !this.isCalibrating) {
        this.onFail?.();
        return null;
      }
      this.currentAction = this.inputAction;
      this.onSuccess?.(this.currentAction, this.isCoyote);
      this.onSuccessLine?.(this.currentAction, this.isCoyote);
      this.onSuccessCalibrate?.(this.currentAction, this.isCoyote);
      return this.currentAction;
    }
  }
  calculateBeat(now) {
    this.module = now % this.beatTempo;
    this.normalizedModule = this.module / this.beatTempo;
    const isWithinBeatWindow = this.normalizedModule > this.offset;
    this.isCoyote = this.canCoyote && this.normalizedModule < this.coyote;
    this.isBeat = isWithinBeatWindow;
    //console.log('what', this.isCoyote, this.isBeat, this.normalizedModule);
  }
  getCurrentAction() {
    if (!this.isKeys || this.keys == null) {
      if (instance.volume < this.volumeThreshold) {
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
