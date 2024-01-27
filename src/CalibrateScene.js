
import Phaser from 'phaser';
import { AudioView } from './AudioView';
import { Character } from './Character';
import { Heartbeat } from './HeartbeatService';
import { instance } from "../audioCheck";

export default class CalibrateScene extends Phaser.Scene {

    constructor() {
        super('calibrate');
    }

    create() {

        this.stages = [
            'up',
            'left',
            'right'
        ];

        new AudioView(this, 0, 0);
        Heartbeat.isCalibrating = true;

        console.log('this is donny shtrugal');
        this.character = new Character(this, this.scale.gameSize.width / 2, this.scale.gameSize.height - 26, 100);
        this.add.existing(this.character);
        this.character.jump();
        this.character.onMoveComplete = () => this.onCharacterMoveComplete();

        console.log('tell them to go up!');
        this.waitingForPitch = true;
        this.getNextStage();
    }

    update(time, delta) {
        Heartbeat.update(time);

        if (!this.waitingForPitch) {
            return;
        }
        if (instance.pitch) {
            this.pitches.push(instance.pitch);
        }
    }

    getNextStage() {
        this.stage = this.stages.shift();
        this.pitches = [];
        Heartbeat.onSuccess = () => {
            if (!this.waitingForPitch) {
                return;
            }
            console.log('what');
            this.character.up();
            this.waitingForPitch = false;
        }
    }

    onCharacterMoveComplete() {
        this.waitingForPitch = true;
    }

}