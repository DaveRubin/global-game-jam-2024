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
      textureURL: "public/assets/particles/flares.png",
      atlasURL: "public/assets/particles/flares.json",
    });

    this.load.atlas({
      key: "stage",
      textureURL: "public/assets/stage.png",
      atlasURL: "public/assets/stage.json",
    });

    this.load.image("tiles", "assets/Tilemap.png");
    this.load.image("arrow", "assets/arrow.png");

    this.load.audio("loop", "Mono/Monoschtrugel music loop.wav");
    this.load.audio("coin-collect", "Mono/coin collect.wav");
    this.load.audio("death-pit", "Mono/Fall into pit.wav");
    this.load.audio("death-electric", "Mono/electric zap.wav");
    this.load.audio("glow", "Mono/top glow shimmer.wav");
  }

  create() {
    // this.scene.start('you-lose');
    this.scene.start("game");
    //this.scene.start("calibrate");
  }
}
