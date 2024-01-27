
import Phaser from 'phaser';
import { AudioView } from './AudioView';
import { Character } from './Character';
import { Heartbeat } from './HeartbeatService';
import { instance } from "../audioCheck";

export default class CalibrateScene extends Phaser.Scene {

    arrowAngles = {
        'up': 90,
        'left': 0,
        'right': 180,
    }

    constructor() {
        super('calibrate');
    }

    create() {

        this.stages = [
            'up',
            'left',
            'right'
        ];

        this.pitchBuffer = 2.5;

        this.audioView = new AudioView(this, 0, 0, this.scale.gameSize.height);
        Heartbeat.startCalibrate();

        this.add.text(0, 100, 'this is little donny');
        this.instructionText = this.add.text(0, 125, '');

        this.characterYPosition = this.scale.gameSize.height - 60;
        this.character = new Character(this, this.scale.gameSize.width / 2, this.characterYPosition, 100);
        this.add.existing(this.character);
        this.character.jump();
        this.character.onMoveComplete = () => this.onCharacterMoveComplete();
        this.pitches = [];

        Heartbeat.onSuccessCalibrate = () => this.onHeartbeatCalibrateSuccess();

        this.getNextStage();
    }

    update(time, delta) {
        Heartbeat.update(time);
    }

    workOnPitches() {
        const ordered = this.pitches.sort((a, b) => a.window.x - b.window.x);
        ordered[0].window.x = 0;
        ordered[1].window.x = ordered[0].window.y;
        ordered[1].window.y = ordered[2].window.x;
        ordered[2].window.y = 1000;
        console.log('workon', JSON.stringify(ordered));
        return ordered;
    }

    getNextStage() {
        this.stage = this.stages.shift();
        if (this.stage == null) {

            Heartbeat.finishCalibrate(this.workOnPitches());
            this.character.destroy();
            this.time.delayedCall(1000, () => {
                this.scene.start('game');
            })
            return;
        }
        this.instructionText.text = 'Tell him to go ' + this.stage + '!';
        this.waitingForPitch = true;
    }

    onHeartbeatCalibrateSuccess() {
        if (!this.waitingForPitch) {
            return;
        }
        console.log('registered', instance.pitch, instance.volume, JSON.stringify(this.pitches));
        const window = new Phaser.Math.Vector2(instance.pitch - this.pitchBuffer, instance.pitch + this.pitchBuffer);
        for (let pitch of this.pitches) {
            if ((window.x < pitch.window.x && window.y > pitch.window.x) ||
                (window.x < pitch.window.y && window.y > pitch.window.y)) {
                this.waitingForPitch = true;
                this.instructionText.text = 'too similar, try again';
                return;
            }
        }

        this.createArrowOnPitch(this.stage, instance.pitch);
        this.pitches.push({ name: this.stage, window: window });
        if (this.stage === 'up') {
            this.character.up();
        }
        else if (this.stage === 'left') {
            this.character.left();
        }
        else {
            this.character.right();
        }
        this.waitingForPitch = false;
    }

    onCharacterMoveComplete() {
        this.instructionText.text = 'Great!';

        this.time.delayedCall(500, () => {
            this.character.x = this.scale.gameSize.width / 2;
            this.character.y = this.characterYPosition;
            this.waitingForPitch = true;
            this.getNextStage();
        });
    }

    createArrowOnPitch(stage, pitch) {
        const arrow = this.add.sprite(0, 0, 'arrow');
        arrow.setAngle(this.arrowAngles[stage]);
        arrow.x = this.scale.gameSize.width / 2 - arrow.width / 2 + this.random(-10, 10);

        const normalized = this.audioView.audioParticles.normalizePitch(pitch);
        arrow.y = this.scale.gameSize.height * (1 - normalized);
    }

    random(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

}