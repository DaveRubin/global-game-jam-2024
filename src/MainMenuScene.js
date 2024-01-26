
import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {

        const buttonContainer = this.add.container(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2);
        const buttonRect = this.add.rectangle(0, 0, 100, 50, 0xaa00bb);
        const buttonText = this.add.text(0, 0, 'Start playing', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        buttonContainer.add([buttonRect, buttonText]);
        buttonText.x -= buttonText.width/2;
        buttonText.y -= buttonText.height/2;
        
        buttonRect.setInteractive();

        buttonRect.on('pointerdown', () => {
            this.scene.start('game');
        });
    }

}