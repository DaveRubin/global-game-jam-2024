export default class LoaderScene extends Phaser.Scene {
  constructor() {
    super("loader");
  }

  preload() {
    this.load.spritesheet({
      key: "coin",
      url: "assets/coins/coins.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
        startFrame: 0,
        endFrame: 20,
      },
    });

    this.load.atlas({
      key: "temp",
      textureURL: "assets/spriteMap/Legends_Level_A.png",
      atlasURL: "assets/spriteMap/Legends__A.json",
    });
    this.load.atlas({
      key: "character",
      textureURL: "assets/character/character.png",
      atlasURL: "assets/character/character.json",
    });
    this.load.atlas({
      key: "flares",
      textureURL: "assets/particles/flares.png",
      atlasURL: "assets/particles/flares.json",
    });

    this.load.atlas({
      key: "stage",
      textureURL: "assets/stage.png",
      atlasURL: "assets/stage.json",
    });

    this.load.image("tiles", "assets/Tilemap.png");
    this.load.image("arrow", "assets/arrow.png");
    this.load.image("no", "assets/angry.png");
    this.load.image("helper-text", "assets/help-text.png");

    this.load.image("end-clock", "assets/end/clock.png");
    this.load.image("end-coins", "assets/end/coins.png");
    this.load.image("end-steps", "assets/end/steps.png");


    this.load.audio("loop", "Mono/Monoschtrugel music loop.wav");
    this.load.audio("coin-collect", "Mono/coin collect.wav");
    this.load.audio("death-pit", "Mono/Fall into pit.wav");
    this.load.audio("death-electric", "Mono/electric zap.wav");
    this.load.audio("glow", "Mono/top glow shimmer.wav");
    this.load.audio("lose", "Mono/Lose.wav");
    this.load.audio("win", "Mono/Win.wav");
  }

  create() {
    this.scene.start('start');
    //this.scene.start("game");
    //this.scene.start("calibrate");
  }
}
