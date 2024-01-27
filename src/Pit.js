export class Pit extends Phaser.GameObjects.Container {
  constructor(scene, x, y, worldX, worldY) {
    super(scene, x, y);

    this.worldX = worldX;
    this.worldY = worldY;

    this.sprite = scene.add.rectangle(0, 0, 32, 32, 0x000000);
    this.add(this.sprite);

    this.kill = "PIT";
  }
}
