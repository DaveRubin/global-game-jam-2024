import Phaser from "phaser";

export class Character extends Phaser.GameObjects.Container {
  scene;
  sprite;
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;
    this.createAnimation("front", "Front ", 1, 3, 2);
    this.createAnimation("side", "Side ", 1, 8);
    this.createAnimation("jump", "Jump ", 1, 5);
    this.sprite = scene.add.sprite(0, 0);

    this.add(this.sprite);
    this.jump();
  }

  up() {
    this.sprite.play("side");
    this.move(0, -32);
  }
  right() {
    this.sprite.play("side");
    this.move(32);
  }
  left() {
    this.sprite.play("side");
    this.sprite.flipX = true;
    this.move(-32);
  }
  idle() {
    this.sprite.play("front");
  }

  jump() {
    this.sprite.play({ key: "jump", repeat: 0 });
    this.sprite.chain(["front"]);
  }

  move(x = 0, y = 0) {
    this.scene.tweens.add({
      targets: this,
      x: this.x + x,
      y: this.y + y,
      ease: "Power1",
      duration: 800,

      onStart: () => {
        console.log("onStart");
      },
      onComplete: () => {
        console.log("onComplete");
      },
    });
  }

  createAnimation(key, prefix, start, end, frameRate = 12) {
    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNames("character", {
        prefix,
        start,
        end,
        zeroPad: 0,
      }),
      repeat: -1,
      frameRate,
    });
  }
}
