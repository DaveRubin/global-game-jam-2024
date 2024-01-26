import Phaser from "phaser";

export class Character extends Phaser.GameObjects.Container {
  scene;
  sprite;
  isMoving = false;
  constructor(scene, x = 0, y = 0, moveSpeed) {
    super(scene, x, y);
    this.scene = scene;
    this.createAnimation("front", "Front ", 1, 3, 2);
    this.createAnimation("side", "Side ", 1, 8, 50);
    this.createAnimation("jump", "Jump ", 1, 5, 15);
    this.sprite = scene.add.sprite(16, 16);
    this.moveSpeed = moveSpeed;

    this.add(this.sprite);
    this.jump();
  }

  up(isStand) {
    this.sprite.play({ key: "jump", repeat: 0, });
    this.sprite.chain(["front"]);
    this.move(0, isStand ? 0 : -32);
  }
  down(isStand) {
    this.sprite.play({ key: "jump", repeat: 0, });
    this.sprite.chain(["front"]);
    this.move(0, isStand ? 0 : 32);
  }
  right() {
    this.sprite.play({ key: "side", repeat: 0, });
    this.sprite.chain(["front"]);
    this.sprite.flipX = false;
    this.move(32);
  }
  left() {
    this.sprite.play({ key: "side", repeat: 0, });
    this.sprite.chain(["front"]);
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
      duration: this.moveSpeed,

      onStart: () => {
        console.log("onStart");
        this.isMoving = true;
      },
      onComplete: () => {
        this.isMoving = false;
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
