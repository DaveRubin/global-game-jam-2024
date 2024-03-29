
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
            'left',
            'up',
            'right'
        ];

        this.pitchBuffer = 2;

        this.audioView = new AudioView(this, 0, 0, this.scale.gameSize.height, false);
        this.audioView.scaleX = 1.5;
        this.audioView.x = -this.scale.gameSize.width / 2;
        Heartbeat.startCalibrate();


        this.loadDonnie();
        this.loadSigns();


        this.instructionText = this.add.text(0, 125, '');

        this.characterYPosition = this.scale.gameSize.height - 60;
        this.character = new Character(this, this.scale.gameSize.width * 0.25, this.characterYPosition, 100);
        this.add.existing(this.character);
        this.character.jump();
        this.character.onMoveComplete = () => this.onCharacterMoveComplete();
        this.pitches = [];

        Heartbeat.onSuccessCalibrate = (action) => this.onHeartbeatCalibrateSuccess(action);

        this.getNextStage();
    }

    loadDonnie() {
        const baseY = this.scale.gameSize.height / 2;
        const container = this.add.container(this.scale.gameSize.width / 2, baseY);
        const donny = this.add.sprite(0, 0, "character", "intro_donnie");

        const donny2 = this.add.sprite(0, 0, "character", "intro_donnie2");
        donny2.visible = false;
        container.add(donny);
        container.add(donny2);

        this.time.addEvent({
            delay: 1200,
            callback: () => {
                donny.visible = !donny.visible;
                donny2.visible = !donny2.visible;
            },
            loop: true
        });

        this.time.addEvent({
            delay: 10,
            callback: () => {
                container.y = (baseY + 10) + 10 * Math.sin(this.time.now / 200);
            },
            loop: true
        });


    }
    loadSigns() {
        const baseY = this.scale.gameSize.height / 2;
        const baseX = this.scale.gameSize.width / 2;

        const hello = this.add.sprite(baseX, baseY, "character", "intro_hello");
        const left = this.add.sprite(baseX, baseY, "character", "intro_lefft");
        const up = this.add.sprite(baseX, baseY, "character", "intro_up");
        const right = this.add.sprite(baseX, baseY, "character", "intro_right");
        const great = this.add.sprite(baseX, baseY, "character", "intro_great");
        const try_again = this.add.sprite(baseX, baseY, "character", "intry_try_again");

        this.signs = {
            hello,
            left,
            up,
            right,
            great,
            try_again,
        }

        Object.values(this.signs).forEach(s => s.visible = false);
        this.signs.hello.visible = true;
    }

    update(time, delta) {
        Heartbeat.update(time);
    }

    getNextStage() {
        this.stage = this.stages.shift();
        if (this.stage == null) {

            Heartbeat.finishCalibrate(Heartbeat.actions);
            this.character.destroy();
            this.time.delayedCall(1000, () => {
                this.scene.start('game');
            })
            return;
        }
        Object.values(this.signs).forEach(s => s.visible = false);
        this.signs[this.stage].visible = true;
        this.waitingForPitch = true;
    }

    onHeartbeatCalibrateSuccess(action) {
        if (!this.waitingForPitch) {
            return;
        }
        // if (action !== this.stage) {
        //     Object.values(this.signs).forEach(s => s.visible = false);
        //     this.signs.try_again.visible = true;
        //     return;
        // }

        this.createArrowOnPitch(this.stage, instance.pitch);
        this.cameras.main.shake(450);
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
        Object.values(this.signs).forEach(s => s.visible = false);
        this.signs.great.visible = true;

        this.time.delayedCall(1500, () => {
            this.character.x = this.scale.gameSize.width * 0.25;
            this.character.y = this.characterYPosition;
            this.waitingForPitch = true;
            this.getNextStage();
        });
    }

    createArrowOnPitch(stage, pitch) {
        const rect = this.add.sprite(0, 0, 'arrow');
        rect.x = this.scale.gameSize.width / 2 - rect.width / 2 + this.random(-10, 10) - 45;
        const normalized = this.audioView.audioParticles.normalizePitch(pitch);
        rect.y = 140;
        rect.alpha = 0.9;
        rect.scale = 0;
        rect.blendMode = "ADD";
        const angle = {
          'up': 90,
          'left': 0,
          'right': 180,
        };
        rect.setAngle(angle[stage]);
    
        this.tweens.add({
          targets: rect,
          scale: 1.75,
          ease: Phaser.Math.Easing.Bounce.Out,
          duration: 400,
        });
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: rect,
            scale: 0,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 300,
            onComplete: () => rect.destroy()
          });
        });
      }

    random(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

}