
import Phaser from 'phaser';
import { Stats } from './GameStats';

export default class YouLoseScene extends Phaser.Scene {
    constructor() {
        super('you-lose');
    }

    create() {

        this.sound.get('loop').stop();
        this.sound.play('lose', { volume: 0.5 });

        const baseY = this.scale.gameSize.height / 2;
        const container = this.add.container(this.scale.gameSize.width / 2, baseY);
        const donny = this.add.sprite(0, 0, "character", "Ending-1");
        const loser = this.add.sprite(0, 0, "character", "Ending-2");
        container.add(donny);
        container.add(loser);
        this.time.addEvent({
            delay: 10,
            callback: () => {
                donny.x = (2) + 2 * Math.sin(this.time.now / 100);
                donny.y = (2) + 2 * Math.sin((this.time.now + 200) / 100);

                loser.y = (20) + 20 * Math.sin((this.time.now + 200) / 500);
                loser.angle = 10 * Math.sin((this.time.now + 700) / 500);
            },
            loop: true
        });

        const stats = this.add.container(50, 20);
        const statsClock = this.add.sprite(0, 0, 'end-clock');
        const statsClockText = this.add.text(-73, 0-6, Stats.getTotalTime(), { align: 'right', fixedWidth: 50 });
        const statsSteps = this.add.sprite(0, 40, 'end-steps');
        const statsStepsText = this.add.text(-73, 40-6, Stats.moves.toString(), { align: 'right', fixedWidth: 50 });
        const statsCoins = this.add.sprite(0, 80, 'end-coins');
        const statsCoinsText = this.add.text(-73, 80-6, Stats.coins.toString(), { align: 'right', fixedWidth: 50 });
        stats.scale = 0.5;
        stats.alpha = 0;
        stats.add([statsClock, statsCoins, statsSteps, statsClockText, statsCoinsText, statsStepsText, ]);
        this.tweens.add({
            targets: stats,
            alpha: 1,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 300,
            delay: 2000
        });

        const buttonContainer = this.add.container(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2 + 16);
        const button = this.add.sprite(0, 0, "character", "button");

        button.alpha = 0;
        this.tweens.add({
            targets: button,
            alpha: 1,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 300,
            delay: 2000
        });
        

        const pressed = this.add.sprite(0, 0, "character", "button_pressed");
        pressed.alpha = 0;
        pressed.setInteractive().on('pointerup', () => {
            pressed.alpha = 0;
            button.alpha = 1;
            this.scene.start('game');
        });
        button.setInteractive().on('pointerdown', () => {

            pressed.alpha = 1;
            button.alpha = 0;
        }).on('pointerup', () => {


            pressed.alpha = 0;
            button.alpha = 1;
            this.scene.start('game');
        })
        buttonContainer.add(button);
        buttonContainer.add(pressed);
        // const buttonRect = this.add.rectangle(0, 0, 100, 50, 0xaa00bb);
        // const buttonText = this.add.text(0, 0, 'Try again', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        // buttonContainer.add([buttonRect, buttonText]);
        // buttonText.x -= buttonText.width / 2;
        // buttonText.y -= buttonText.height / 2;

        // buttonRect.setInteractive();

        // buttonRect.on('pointerdown', () => {
        //     this.scene.start('game');
        // });
    }

}