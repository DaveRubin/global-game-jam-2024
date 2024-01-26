import Phaser from "phaser";
import constants from "./Constants";

const nameToIndex = {
  floor: 0,
  "wall-l": 1,
  hole: 2,
  plsp: 2,
  "wall-ml": 3,
  "wall-m": 4,
  "wall-mr": 5,
  "wall-mm": 6,
  "wall-r": 7,
  "wall-b": 8,
  "wall-bl": 9,
  "wall-tm": 10,
  "wall-br": 11,
  "wall-tl": 12,
  "wall-tr": 13,
};

const gameMap = [
  ["wall-l", "wall-l", "wall-l", "wall-l", "wall-l"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "plgo", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "hole", "hole", "hole", "floor"],
  ["floor", "floor", "hole", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "plsp", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor"],
];

const TOP_WALL = ["floor", "floor", "floor", "floor", "floor"].map(
  (x) => nameToIndex[x]
);

const BOTTOM_WALL = [
  "wall-m",
  "wall-m",
  "wall-m",
  "wall-m",
  "wall-m",
  "wall-m",
  "wall-m",
].map((x) => nameToIndex[x]);
console.log("🚀 ~ BOTTOM_WALL:", BOTTOM_WALL);

const preMadeLevel = [
  TOP_WALL,
  ...gameMap.map((row) => row.map((x) => nameToIndex[x])),
  BOTTOM_WALL,
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

    const level = [];
    for (let y = 0; y < gameMap.length; y++) {
      level.push([
        nameToIndex["wall-l"],
        ...TOP_WALL.map((x) => {
          return gameMap[y][x];
        }),
        nameToIndex["wall-l"],
      ]);

      for (let x = 0; x < gameMap[0].length; x++) {
        level[y][x + 1] = nameToIndex[gameMap[y][x]];
      }
    }
    level.push(BOTTOM_WALL);

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({
      data: level,
      tileWidth: 34,
      tileHeight: 34,
    });

    const tiles = map.addTilesetImage("stage");
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.scale = 32 / 34;
    const layerHeight = layer.layer.heightInPixels * layer.scale;
    this.floor = 10;
    layer.y = -layerHeight + scene.scale.gameSize.height - this.floor + 32;
    layer.x =
      scene.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;
    this.add(layer);
    this.layer = layer;
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
    return this.findOnGameMap((tile) => tile === constants.playerStartingPoint);
  }
}
