
import Phaser from 'phaser';

export default class YouLoseScene extends Phaser.Scene {
    constructor() {
        super('you-lose');
    }

    create() {
        const loseText = this.add.text(0, 0, 'LOSER!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        loseText.originX = loseText.originY = 0.5;
        loseText.x = this.scale.gameSize.width / 2 - loseText.width / 2;
        loseText.y = 50;

        const buttonContainer = this.add.container(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2);
        const buttonRect = this.add.rectangle(0, 0, 100, 50, 0xaa00bb);
        const buttonText = this.add.text(0, 0, 'Try again', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        buttonContainer.add([buttonRect, buttonText]);
        buttonText.x -= buttonText.width/2;
        buttonText.y -= buttonText.height/2;
        
        buttonRect.setInteractive();

        buttonRect.on('pointerdown', () => {
            this.scene.start('game');
        });
    }

}