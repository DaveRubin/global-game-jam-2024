import Phaser from "phaser";
import constants from "./Constants";

const gameMap = [
  ["wall", "wall", "wall", "wall", "wall"],
  ["path", "path", "path", "path", "path"],
  ["path", "path", "plgo", "path", "path"],
  ["path", "path", "path", "path", "path"],
  ["path", "path", "path", "path", "path"],
  ["path", "path", "path", "path", "path"],
  ["path", "path", "path", "path", "path"],
  ["path", "pits", "pits", "pits", "path"],
  ["path", "path", "pits", "path", "path"],
  ["path", "path", "path", "path", "path"],
  ["path", "path", "plsp", "path", "path"],
  ["path", "path", "path", "path", "path"],
];

export class StageBackground extends Phaser.GameObjects.Container {
  scene;

  isWall = (x, y) => gameMap[y][x] !== constants.wall;
  columns = gameMap[0].length;
  rows = gameMap.length;

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    this.totalHeight = gameMap.length;
    this.totalWidth = gameMap[0].length;

    const convert = {};
    convert["pits"] = 16;
    convert["plsp"] = 0;
    convert["plgo"] = 14;
    convert["path"] = 0;
    convert["wall"] = 36;

    const level = [];
    for (let y = 0; y < gameMap.length; y++) {
      level.push([36, 0, 0, 0, 0, 0, 36]);
      for (let x = 0; x < gameMap[0].length; x++) {
        level[y][x + 1] = convert[gameMap[y][x]];
      }
    }
    level.push([36, 36, 36, 36, 36, 36, 36]);

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({
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
    layer.y = -layerHeight + scene.scale.gameSize.height - this.floor + 32;
    layer.x =
      scene.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;
    this.add(layer);
  }

  findOnGameMap(predicate) {
    for (let y = 0; y < gameMap.length; y++) {
      for (let x = 0; x < gameMap[y].length; x++) {
        if (predicate(gameMap[y][x])) {
          return new Phaser.Math.Vector2(x, y);
        }
      }
    }
    return new Phaser.Math.Vector2(-1, -1);
  }

  getTile(x, y) {
    return gameMap[y][x];
  }

  getTileVector(vector) {
    return gameMap[vector.y][vector.x];
  }

  getStartingPoint() {
    return this.findOnGameMap((tile) => tile === constants.start);
  }
}
