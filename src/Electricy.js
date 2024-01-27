import Phaser from "phaser";

const modes = {
  cold: new Phaser.Display.Color(30, 0, 0),
  hot: new Phaser.Display.Color(255, 0, 0),
};

export class Electricy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, worldX, worldY, beatOrder, beatTotal) {
    super(scene, x, y);
    this.scene = scene;

    this.worldX = worldX;
    this.worldY = worldY;

    this.beatOrder = beatOrder;
    this.beatTotal = beatTotal;
    this.currentCount = beatOrder;
    this.createAnimation("electric1", "Electric1 ", 1, 8, 8);
    this.createAnimation("electric2", "Electric2 ", 1, 7, 8);
    this.lightningAnimation = scene.add.sprite(0, 0);
    const metal = scene.add.sprite(0, 0, "stage", "metal");
    this.sprite = scene.add.rectangle(0, 0, 32, 32, 0x0088ff);

    this.sprite.blendMode = Phaser.BlendModes.SCREEN;
    this.lightningAnimation.blendMode = Phaser.BlendModes.SCREEN;

    const particlesEngine = this.scene.add.particles("flares");

    this.exploder = particlesEngine.createEmitter({
      frame: "blue",
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, 0, 32, 32),
      },
      x: this.x - 16,
      y: this.y - 16,
      quantity: 1,
      lifespan: 400,
      frequency: 200,
      speed: { min: 10, max: 150 },
      scale: { start: 0.05, end: 0 },
      gravityY: 2,
      blendMode: "ADD",
      emitting: false,
    });
    this.emitter = particlesEngine.createEmitter({
      frame: "blue",
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, 0, 32, 32),
      },
      x: this.x - 16,
      y: this.y - 16,
      quantity: 1,
      lifespan: 500,
      frequency: 200,
      speed: { min: 1, max: 3 },
      scale: { start: 0.05, end: 0 },
      gravityY: 2,
      blendMode: "ADD",
    });

    this.sprite.alpha = 0;
    this.add(metal);
    this.add(this.sprite);
    this.add(this.lightningAnimation);
    this.lightningAnimation.on("animationcomplete", () => {
      this.playLightning();
    });
    this.playLightning();
    this.add(particlesEngine);
  }
  playLightning() {
    this.lightningAnimation.play({
      key: Math.random() > 0.5 ? "electric1" : "electric2",
      delay: Math.random() * 200,
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

      frameRate,
    });
  }

  isHot() {
    return this.currentCount === this.beatTotal - 1;
  }

  beat(beatCount) {
    const count = (beatCount + this.beatOrder) % this.beatTotal;
    if (this.currentCount === count) {
      return;
    }

    const wasHot = this.isHot();
    this.currentCount = count;
    const newWasHot = this.isHot();

    if (wasHot !== newWasHot) {
      if (newWasHot) {
        this.sprite.alpha = 1;
        this.exploder.explode(50, -16, -16);
        this.electrocute();
      } else {
        this.sprite.alpha = 0;
      }
    }
    this.kill = newWasHot;
  }

  electrocute() {
    this.tweenStep = 0;

    this.scene.tweens.add({
      targets: this,
      tweenStep: 30,
      onUpdate: () => (this.sprite.alpha = this.tweenStep % 10 > 5 ? 1 : 0),
      duration: 250,
      yoyo: false,
    });
  }
}
