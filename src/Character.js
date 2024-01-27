import Phaser from "phaser";

export class Character extends Phaser.GameObjects.Container {
  scene;
  sprite;
  isMoving = false;
  onMoveComplete;
  constructor(scene, x = 0, y = 0, moveSpeed) {
    super(scene, x, y);
    this.scene = scene;

    this.createAnimation("front", "Front ", 1, 3, 2);
    this.createAnimation("side", "Side ", 1, 8, 50);
    this.createAnimation("jump", "Jump ", 1, 5, 15);
    this.createAnimation("deathElectric", "DeathElectric ", 1, 4, 12);

    this.sprite = scene.add.sprite(16, 16);
    this.sprite.originY = this.sprite.originX = 1;
    this.moveSpeed = moveSpeed;

    this.add(this.sprite);
    this.isAlive = true;

    this.scene.events.on("update", () => {});
  }

  up(isStand) {
    this.sprite.play({ key: "jump", repeat: 0 });
    this.sprite.chain(["front"]);
    this.move(0, isStand ? 0 : -32);
  }
  down(isStand) {
    this.sprite.play({ key: "jump", repeat: 0 });
    this.sprite.chain(["front"]);
    this.move(0, isStand ? 0 : 32);
  }
  right() {
    this.sprite.play({ key: "side", repeat: 0 });
    this.sprite.chain(["front"]);
    this.sprite.flipX = false;
    this.move(32);
  }
  left() {
    this.sprite.play({ key: "side", repeat: 0 });
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

  fallOnPit(onComplete) {
    this.isAlive = false;
    this.sprite.play("front");
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      ease: Phaser.Math.Easing.Back.In,
      duration: 300,

      onStart: () => {
        this.isMoving = true;
      },
      onComplete,
    });
  }
  electrocute(onComplete) {
    this.isAlive = false;
    this.isMoving = true;
    this.sprite.play("deathElectric");
    setTimeout(() => {
      onComplete();
    }, 2000);
  }

  move(x = 0, y = 0) {
    this.scene.tweens.add({
      targets: this,
      x: this.x + x,
      y: this.y + y,
      ease: "Power1",
      duration: this.moveSpeed,

      onStart: () => {
        this.isMoving = true;
      },
      onComplete: () => {
        this.isMoving = false;
        this.onMoveComplete?.();
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
