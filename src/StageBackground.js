import Phaser from "phaser";
import { gameMap, above } from './maps'
// @ts-ignore
import stage from "../public/assets/stage.json";
const nameToIndex = {};
Object.entries(stage.textures[0].frames).forEach(([key, value]) => {
  nameToIndex[value.filename] = Number(key);
});



const preMadeLevel = gameMap.map((row) => row.map((x) => nameToIndex[x]));

export class StageBackground extends Phaser.GameObjects.Container {
  scene;

  isWall = (x, y) => {
    return above[y][x].indexOf('wall') > -1;
  }
  columns = gameMap[0].length;
  rows = gameMap.length;

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    const layer = this.createLayer(scene, "base", preMadeLevel);

    this.layer = layer;
    this.aboveContainer = this.createContainer(scene);
    this.aboveContainer.y = layer.y + 16;
    this.add(this.aboveContainer);
  }
  createContainer(scene) {
    const container = scene.add.container(0, 0);
    above.forEach((row, y) => {
      row.forEach((name, x) => {
        if (name === "floor") {
          return;
        }
        //create a sprite with name from 'stage' atlas ,at x*32,y * 32
        const sprite = name === 'arrow' ? scene.add.sprite(x * 32, y * 32, "character", name)
          : scene.add.sprite(x * 32, y * 32, "stage", name);
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
    return new Phaser.Math.Vector2(4, this.rows - 35);
  }

  isWin(x, y) {
    return above[y][x] === 'plgo';
  }
}
