import { instance } from '../audioCheck';

class HeartbeatService {
    total;
    constructor() {
        this.hadBeat = false;
        this.isBeat = false;
        this.inputAction = null;
        this.lastInputAction = null;

        this.beatWindowLength = 1000;
        this.beatTempo = 3000;

        this.actions = [
            { window: new Phaser.Math.Vector2(200, 300), name: 'up' },
            { window: new Phaser.Math.Vector2(150, 170), name: 'left' },
            { window: new Phaser.Math.Vector2(150, 170), name: 'right' },
            { window: new Phaser.Math.Vector2(400, 500), name: 'action' },
        ];
    }
    update(now) {
        this.hadBeat = this.isBeat;
        this.lastInputAction = this.inputAction;

        this.isBeat = this.calculateBeat(now);
        this.inputAction = this.getCurrentAction();
        this.calculateAction();
        
        if (this.currentAction) {
            console.log('action: ' + this.currentAction, 'pitch: ', instance.pitch, 'volumne: ', instance.volume);
        }
        console.log('isBeat: ' + this.isBeat);
    }
    calculateAction() {
        if (this.isBeat) {
            if (this.skipBeat) {
                this.currentAction = null;
            }
            else {
                if (this.lastInputAction) {
                    this.skipBeat = true;
                }
                else if (this.inputAction) {
                    this.currentAction = this.inputAction;
                    this.skipBeat = true;    
                }
            }
        }
        else {
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
        for(let action of this.actions) {
            if (action.window.x < instance.pitch && instance.pitch < action.window.y) {
                return action.name;
            }
        }
        return null;
    }
}

export const Heartbeat = new HeartbeatService();
