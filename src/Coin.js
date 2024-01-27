export class Coin extends Phaser.GameObjects.Container {
    constructor(scene, x, y, worldX, worldY) {
        super(scene, x, y);
        
        this.worldX = worldX;
        this.worldY = worldY;
        
        this.createAnimation("coin-spin", 0, 14, 2);
        this.sprite = scene.add.sprite(0, 0, 'coin');
        this.add(this.sprite);
        this.sprite.play({ key: "coin-spin", repeat: -1, frameRate: 20 });

        this.kill = false;
    } 

    createAnimation(key, start, end, frameRate = 60) {
        this.scene.anims.create({
          key,
          frames: this.scene.anims.generateFrameNames("coin", {
            start,
            end,
            zeroPad: 0,
          }),
          repeat: -1,
          frameRate
        });
      }

    collect() {
        if (this.collected) {
            return;
        }
        this.collected = true;

        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,
            alpha: 0,
            scale: 1.5,
            ease: "SineInOut",
            duration: 350,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}