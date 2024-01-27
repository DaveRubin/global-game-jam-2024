import Phaser from "phaser";

const modes = {
  cold: new Phaser.Display.Color(30, 0, 0),
  hot: new Phaser.Display.Color(255, 0, 0),
};

export class Electricy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, worldX, worldY, beatOrder, beatTotal) {
    super(scene, x, y);

    this.worldX = worldX;
    this.worldY = worldY;

    this.beatOrder = beatOrder;
    this.beatTotal = beatTotal;
    this.currentCount = beatOrder;

    const metal = scene.add.sprite(0, 0, "stage", "metal");
    this.sprite = scene.add.rectangle(0, 0, 32, 32, 0xffffff);
    this.sprite.alpha = 0;
    this.add(metal);
    this.add(this.sprite);
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
      this.changeColor(
        this.isHot() ? modes.cold : modes.hot,
        this.isHot() ? modes.hot : modes.cold
      );
    }
    this.kill = newWasHot;
  }

  changeColor(fromMode, toMode) {
    this.tweenStep = 0;

    this.scene.tweens.add({
      targets: this,
      tweenStep: 100,
      onUpdate: () => {
        let col = Phaser.Display.Color.Interpolate.ColorWithColor(
          fromMode,
          toMode,
          100,
          this.tweenStep
        );
        let colourInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
        this.sprite.fillColor = colourInt;
      },
      duration: 100,
      yoyo: false,
    });
  }
}
