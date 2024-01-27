import Phaser from "phaser";
import { DancingLight } from "./DancingLight";
import { gameMap } from './maps'


const HEIGHT = gameMap.length * 32;
const WIDTH = gameMap[0].length;
const placeFromBottom = (x, y) => {
  return [x * 32, (gameMap.length - y) * 32]
}

export class Foreground extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;


    this.add(new DancingLight(scene, ...placeFromBottom(0, 2)));
    this.add(new DancingLight(scene, ...placeFromBottom(WIDTH, 2)));

    this.add(new DancingLight(scene, ...placeFromBottom(0, 8), true));
    this.add(new DancingLight(scene, ...placeFromBottom(WIDTH, 8), true));

    this.add(new DancingLight(scene, ...placeFromBottom(0, 25)));
    this.add(new DancingLight(scene, ...placeFromBottom(WIDTH, 25)));
  }
}
