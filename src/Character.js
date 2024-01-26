import Phaser from "phaser";

export class Character extends Phaser.GameObjects.Container {
  scene;
  sprite;
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;
    this.createAnimation("front", "Front ", 1, 3, 2);
    this.createAnimation("side", "Side ", 1, 8);

    this.sprite = scene.add.sprite(32, 32);
    this.sprite.setScale(2);

    this.add(this.sprite);
    // this.left();
    this.idle();
    // this.right();
  }

  up() {
    this.sprite.play("side");
  }
  right() {
    this.sprite.play("side");
  }
  left() {
    this.sprite.play("side");
    this.sprite.flipX = true;
  }
  idle() {
    this.sprite.play("front");
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
