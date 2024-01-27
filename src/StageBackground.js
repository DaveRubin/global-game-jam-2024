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
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "plgo", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "hole", "hole", "hole", "floor", "floor"],
  ["floor", "floor", "floor", "hole", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "plsp", "floor", "floor", "floor"],
  ["floor", "floor", "floor", "floor", "floor", "floor", "floor"],
  ["wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m", "wall-m"],
];

const above = [
  ["wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-r", "floor", "floor", "floor", "floor", "floor", "wall-l"],
  ["wall-b", "wall-b", "wall-b", "wall-b", "wall-b", "wall-b", "wall-b"],
];

const preMadeLevel = gameMap.map((row) => row.map((x) => nameToIndex[x]));

export class StageBackground extends Phaser.GameObjects.Container {
  scene;

  isWall = (x, y) => gameMap[y][x] !== constants.wall;
  columns = gameMap[0].length;
  rows = gameMap.length;

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    const layer = this.createLayer(scene, "base", preMadeLevel);

    this.layer = layer;
    const container = this.createContainer(scene);
    this.add(container);
    container.y = -64;
    const rect = scene.add.rectangle(
      scene.scale.gameSize.width / 2,
      scene.scale.gameSize.height / 2,
      scene.scale.gameSize.width,
      scene.scale.gameSize.height * 2,
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

    this.add(rect);
  }
  createContainer(scene) {
    const container = scene.add.container(0, 0);
    above.forEach((row, y) => {
      row.forEach((name, x) => {
        if (name === "floor") {
          return;
        }
        //create a sprite with name from 'stage' atlas ,at x*32,y * 32
        const sprite = scene.add.sprite(x * 32, y * 32, "stage", name);
        //add the sprite to the container
        container.add(sprite);
      });
    });
    return container;
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
