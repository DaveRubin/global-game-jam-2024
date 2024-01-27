
import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start');
    }

    create() {

        this.logo = this.add.sprite(0, 0, "character", "logo");
        this.logo.x = this.scale.gameSize.width / 2 - 7;
        this.logo.y = this.scale.gameSize.height / 2;
        this.logo.scale = 0;

        this.startButton = this.add.sprite(0, 0, 'character', 'button');
        this.startButton.alpha = 0;
        this.startButton.scale = 0.75;
        this.startButton.x = this.scale.gameSize.width/2;
        this.startButton.y = 200;
        this.startButton.setInteractive();
        this.startButton.on('pointerup', () => {
            if (!this.isClick) {
                return;
            }
            this.isClick = false;
            this.startButton.setTexture('character', 'button');
            this.loop.stop();
            this.scene.start('calibrate');
        });
        this.startButton.on('pointerdown', () => {
            this.isClick = true;
            this.startButton.setTexture('character', 'button_pressed');
        })

        this.tweens.add({
            targets: this.logo,
            scale: 1,
            ease: Phaser.Math.Easing.Bounce.Out,
            duration: 4000,
        });

        this.time.delayedCall(3700, () => {
            let loops = this.sound.getAll('loop');
            if (!loops.length) {
                this.sound.play("loop", { loop: true, volume: 0.25,  });
                loops = this.sound.getAll('loop');
            } 
            this.loop = loops[0];

            this.tweens.add({
                targets: this.logo,
                y: this.logo.y + 20,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: 2000,
                repeat: -1,
                yoyo: true
            });

            this.tweens.add({
                targets: this.startButton,
                alpha: 1,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: 300,
            });
        })
    }

    start() {
        this.loop.stop();
    }
 
}