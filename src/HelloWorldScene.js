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

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/Untitled.png");
    this.load.image("red", "assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    new AudioView(this, 0, 0);
    const character = new Character(this, 400, 400);
    this.add.existing(character);

    // const particles = this.add.particles("logo");
    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   gravityX: -700,
    //   gravityY: 0,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // });

    // const logo = this.physics.add.image(400, 100, "logo");

    //

    // const logo3 = this.add.image(50, 50, "temp", "Torch-A-3.png");
    // logo3.scale = 2;

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);
  }

  update(time, delta) {
    Heartbeat.update(time);
  }
}
