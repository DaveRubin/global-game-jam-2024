import Phaser from "phaser";
import { DancingLight } from "./DancingLight";
import { gameMap } from './maps'
import { Heartbeat } from "./HeartbeatService";


const HEIGHT = gameMap.length * 32;
const WIDTH = gameMap[0].length;
const placeFromBottom = (x, y) => {
  return [x * 32, (gameMap.length - y) * 32]
}

const MAX = {
  scale: 1.2,
  alpha: 1,
}

const MIN = {
  scale: 1,
  alpha: 1,
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


    this.add(scene.add.sprite(scene.scale.gameSize.width / 2, 32, "character", "chair"));
    const gold1 = scene.add.sprite(scene.scale.gameSize.width / 2 - 64, 96, "character", "plank2");
    this.add(gold1);
    const gold2 = scene.add.sprite(scene.scale.gameSize.width / 2 + 64, 96, "character", "plank2");
    this.add(gold2);

    this.add(scene.add.sprite(scene.scale.gameSize.width / 2, HEIGHT - 7 * 32, "character", "lamp"));

    const plank1 = scene.add.sprite(scene.scale.gameSize.width / 2 - 96, HEIGHT - 13 * 32, "character", "plank1");
    const plank2 = scene.add.sprite(scene.scale.gameSize.width / 2 + 96, HEIGHT - 13 * 32, "character", "plank1");

    const p1 = scene.add.sprite(...placeFromBottom(2.5, 22), "character", "plank1");
    this.add(p1);
    const p2 = scene.add.sprite(...placeFromBottom(5.5, 19), "character", "plank1");
    this.add(p2);

    this.add(plank1);
    this.add(plank2);
    Heartbeat.eventEmitter.addEventListener("beat", (e) => {
      const even = !!((e.detail.beatCount) % 2);

      scene.tweens.add({
        targets: [even ? plank1 : plank2],
        ...MAX,
        duration: 200,
        yoyo: true,
      });
      scene.tweens.add({
        targets: [even ? gold2 : gold1],
        ...MAX,
        duration: 200,
        yoyo: true,
      });
      scene.tweens.add({
        targets: [even ? p1 : p2],
        ...MAX,
        duration: 200,
        yoyo: true,
      });


    });

  }
}
