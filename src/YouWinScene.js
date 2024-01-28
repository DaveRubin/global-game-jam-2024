
import Phaser from 'phaser';
import { Stats } from './GameStats';

export default class YouWinScene extends Phaser.Scene {
    constructor() {
        super('you-win');
    }

    create() {

        this.sound.get('loop').stop();
        this.sound.play('win', { volume: 0.5 });

        const baseY = this.scale.gameSize.height / 2;
        const container = this.add.container(this.scale.gameSize.width / 2, baseY + 16);
        const donny = this.add.sprite(0, 0, "character", "win");
        const button = this.add.sprite(0, 0, "character", "button");
        const pressed = this.add.sprite(0, 0, "character", "button_pressed");

        button.alpha = 0;
        this.tweens.add({
            targets: button,
            alpha: 1,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 300,
            delay: 4000
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
            delay: 4000
        });

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
        container.add(donny);
        container.add(button);
        container.add(pressed);
        // container.add(loser);
        this.time.addEvent({
            delay: 10,
            callback: () => {
                donny.x = (2) + 2 * Math.sin(this.time.now / 200);
                donny.y = (2) + 2 * Math.sin((this.time.now + 200) / 200);

            },
            loop: true
        });

        const particlesEngine = this.add.particles("character");

        this.emitter = particlesEngine.createEmitter({
            frame: "dollar",
            emitZone: {
                //  create new Phaser.Geom.Rectangle ref here and make it wide as the screen
                source: new Phaser.Geom.Rectangle(0, -200, this.scale.gameSize.width, 200),
            },
            x: 0,
            y: 0,
            quantity: 1,
            frequency: 100,
            lifespan: 2000,
            angle: { min: 0, max: 180 },
            speed: { min: 10, max: 10 },
            scale: { start: 0.5, end: 0.5 },
            opacity: { start: 1, end: 1 },
            rotate: { start: 0, end: -180 },
            gravityY: 200,
            // blendMode: "ADD",
        });
    }

}