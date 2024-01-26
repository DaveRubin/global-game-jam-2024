import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
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

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/Untitled.png");
    this.load.image("red", "assets/particles/red.png");

    this.load.image("tiles", "assets/Tilemap.png");
    this.load.audio("loop", "loop.mp3");
  }

  create() {
    this.sound.play("loop", { loop: true });

    const level = [
      [0, 15, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 3, 0, 0],
      [0, 0, 5, 6, 7, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 14, 13, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 14, 14, 14, 14],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 35, 36, 37, 0, 0, 0],
      [0, 35, 36, 37, 0, 0, 0],
      [0, 35, 36, 37, 0, 0, 0],
      [0, 35, 36, 37, 0, 0, 0],
      [0, 39, 39, 39, 39, 39, 39],
    ];

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = this.make.tilemap({
      data: level,
      tileWidth: 16,
      tileHeight: 16,
    });
    const tiles = map.addTilesetImage("tiles");
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.scale = 32 / 16;
    layer.originY = 0;
    const layerHeight = layer.layer.heightInPixels * layer.scale;
    layer.y = -layerHeight + this.scale.gameSize.height - 10;
    layer.x =
      this.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;

    new AudioView(this, 0, 0);

    this.add.existing(new Character(this, 100, 200));
  }

  update(time, delta) {
    Heartbeat.update(time);
  }
}
