
import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {

        const playButtonContainer = this.add.container(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2);
        const playButtonRect = this.add.rectangle(0, 0, 100, 50, 0xaa00bb);
        const playButtonText = this.add.text(0, 0, 'Start playing', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        playButtonContainer.add([playButtonRect, playButtonText]);
        playButtonText.x -= playButtonText.width/2;
        playButtonText.y -= playButtonText.height/2;
        playButtonRect.setInteractive();
        playButtonRect.on('pointerdown', () => {
            this.scene.start('game');
        });

        const calibrateButtonContainer = this.add.container(this.scale.gameSize.width / 2, this.scale.gameSize.height / 2 + 100);
        const calibrateButtonRect = this.add.rectangle(0, 0, 100, 50, 0xaa00bb);
        const calibrateButtonText = this.add.text(0, 0, 'Calibrate', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        calibrateButtonContainer.add([calibrateButtonRect, calibrateButtonText]);
        calibrateButtonText.x -= calibrateButtonText.width/2;
        calibrateButtonText.y -= calibrateButtonText.height/2;
        calibrateButtonRect.setInteractive();
        calibrateButtonRect.on('pointerdown', () => {
            this.scene.start('calibrate');
        });
    }

}