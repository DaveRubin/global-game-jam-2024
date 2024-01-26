import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";
import constants from './Constants';

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

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/Untitled.png");
    this.load.image("red", "assets/particles/red.png");

    this.load.image("tiles", "assets/Tilemap.png");
  }

  create() {

    this.gameMap = [
      [constants.nothing, constants.path, constants.playerGoal, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.path, constants.path, constants.path, constants.nothing,],
      [constants.nothing, constants.nothing, constants.playerStartingPoint, constants.nothing, constants.nothing,],
    ];
    this.totalHeight = this.gameMap.length;
    this.totalWidth = this.gameMap[0].length;


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
    this.floor = 10;
    layer.y = -layerHeight + this.scale.gameSize.height - this.floor;
    layer.x =
      this.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;
    this.layer = layer;

    const enemy = this.add.rectangle(0, 0, 32, 32, 0xff0000);
    this.positionAnything(enemy, 2, 2);
    this.worldContainer = this.add.container(0, 0, [layer]);
    this.worldContainer.add(enemy);

    this.character = new Character(this, 0, 0);
    this.add.existing(this.character);
    this.positionAnything(this.character, 2, 0);

    new AudioView(this, 0, 0);
  }

  update(time, delta) {
    Heartbeat.update(time);

    if (Heartbeat.currentAction) {
      if (Heartbeat.currentAction === 'up') {
        this.character.up();
        // this.worldContainer.y += 32;
        // this.layer.y += 32;
      }
      if (Heartbeat.currentAction === 'down') {
        this.character.down();
      }
      if (Heartbeat.currentAction === 'left') {
        this.character.left();
      }
      if (Heartbeat.currentAction === 'right') {
        this.character.right();
      }
    }
  }

  moveVertical(direction) {
    
  }

  positionAnything(sprite, x, y) {
    const position = this.getPositionOnScreen(x, y);
    sprite.x = position.x;
    sprite.y = position.y;
  }

  getPositionOnScreen(x, y) {
    return new Phaser.Math.Vector2(x * 32, 8 * 32 - y * 32);
  }
}
