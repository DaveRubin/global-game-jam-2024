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
      atlasURL: "assets/spriteMap/Legends_Level_A.json",
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
    this.load.audio("loop", "loop.mp3");
  }

  create() {
    // this.scene.start('calibrate');
    this.scene.start("game");
  }
}
