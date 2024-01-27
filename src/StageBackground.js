import Phaser from "phaser";
import constants from "./Constants";
import { DARK_COLOR } from "./colors";

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
  ["wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "plgo", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "hole", "hole", "hole", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "hole", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "floor", "plsp", "floor", "floor", "wall-l"],
  ["wall-l", "floor", "wall-r", "floor", "floor", "floor", "wall-l"],
  ["wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m"],
];

const above = [
  ["wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-r", "wall-l"],
  ["wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m"],
];

const preMadeLevel = gameMap.map((row) => row.map((x) => nameToIndex[x]));
const elements = above.map((row) =>
  row.map((x) => (x === "floor" ? undefined : nameToIndex[x]))
);

export class StageBackground extends Phaser.GameObjects.Container {
  scene;

  isWall = (x, y) => gameMap[y][x] !== constants.wall;
  columns = gameMap[0].length;
  rows = gameMap.length;

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    const layer = this.createLayer(scene, "base", preMadeLevel);
    const layer2 = this.createLayer(scene, "base2", elements);

    this.layer = layer;
    this.layer2 = layer2;

    const rect = scene.add.rectangle(
      scene.scale.gameSize.width / 2,
      scene.scale.gameSize.height / 2,
      scene.scale.gameSize.width,
      scene.scale.gameSize.height,
      DARK_COLOR
    );
    rect.alpha = 0.6;
    rect.blendMode = Phaser.BlendModes.MULTIPLY;

    const sprite = scene.add.sprite(
      0,
      scene.scale.gameSize.height / 2,
      "flares",
      "red"
    );
    sprite.scale = 3;
    sprite.alpha = 0.4;
    sprite.blendMode = Phaser.BlendModes.ADD;
    this.add(sprite);
    // keep it always
    // this.add(rect);
  }
  createLayer(scene, name, data) {
    const map = scene.make.tilemap({
      data,
      tileWidth: 34,
      tileHeight: 34,
    });

    const tiles = map.addTilesetImage("stage");
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.scale = 32 / 34;
    this.floor = 10;
    const layerHeight = layer.layer.heightInPixels * layer.scale;
    layer.y = -layerHeight + scene.scale.gameSize.height - this.floor + 32;
    layer.x =
      scene.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;
    console.log("🚀 ~ StageBackground ~ createLayer ~ layer:", layer.width);
    return layer;
  }

  findOnGameMap(predicate) {
    for (let y = 1; y < gameMap.length; y++) {
      for (let x = 1; x < gameMap[y].length; x++) {
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
