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
  onSuccessLine;

  eventEmitter = new EventEmitter();
  onSuccessCalibrate;

  isCalibrating = false;

  constructor() {
    this.beatCount = 0;
    this.hadBeat = false;
    this.isBeat = false;
    this.inputAction = null;
    this.lastInputAction = null;

    this.beatTempo = 900;
    this.startOffset = 0.35;
    this.endOffset = 0.35;

    this.actions = [{"name":"left","window":{"x":0,"y":51.76910971401293}},{"name":"right","window":{"x":51.76910971401293,"y":63.732644862303005}},{"name":"up","window":{"x":63.732644862303005,"y":1000}}]
  }

  update(now) {
    this.hadBeat = this.isBeat;
    this.lastInputAction = this.inputAction;

    this.isBeat = this.calculateBeat(now);

    if (!this.hadBeat && this.isBeat) {
      this.beatCount++;
      this.eventEmitter.dispatch("beat", { beatCount: this.beatCount });
      // create an event emitter and emit an event
      // this.events.emit("beat", this.beatCount);
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
    const isWithinBeatWindow = this.normalizedModule > (1 - this.startOffset) || this.normalizedModule < this.endOffset;

    return isWithinBeatWindow;
  }
  getCurrentAction() {
    if (instance.volume < 0.075) {
      return null;
    }

    if (this.isCalibrating) {
      if (instance.pitch) {
        return "calibrate";
      } else {
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
    console.log("finished calibrating", JSON.stringify(actions));
  }
}

export const Heartbeat = new HeartbeatService();
