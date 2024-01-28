import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";
import { Electricy } from "./Electricy";
import { Pit } from "./Pit";
import { Coin } from "./Coin";
import { StageBackground } from "./StageBackground";
import { Foreground } from "./Foreground";
import { Stats } from "./GameStats";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    Stats.start(this.time.now);

    if (!this.sound.getAll('loop').length) {
      this.sound.play("loop", { loop: true, volume: 0.1,  });
    }
    const loops = this.sound.getAll('loop');
    loops[0].play();
    loops[0].volume = 0.1;

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

    this.isKeys = false;
    this.isPingPong = true;
    this.stage = new StageBackground(this);
    this.add.existing(this.stage);

    this.worldContainer = this.add.container(0, 0);
    this.worldContainer.y += 6 - 32 * (this.stage.rows - 11);

    const startingPoint = this.stage.getStartingPoint();
    this.characterY = startingPoint.y;
    this.characterX = startingPoint.x;

    this.character = new Character(this, 0, 0, 100);
    this.add.existing(this.character);
    this.positionCharacter(this.character, startingPoint.x, startingPoint.y);

    new AudioView(this, 0, 0, 32 * 3);

    this.beatDebugRect = this.add.rectangle(0, 0, 200, 30, 0xffffff);
    this.beatDebugRect.alpha = 0;

    const obstacles = [
      new Electricy(this, 0, 0, 3, this.invertWorldY(16), 0, 5),
      new Electricy(this, 0, 0, 4, this.invertWorldY(16), 0, 5),
      new Electricy(this, 0, 0, 5, this.invertWorldY(16), 0, 5),
      new Electricy(this, 0, 0, 3, this.invertWorldY(15), 1, 5),
      new Electricy(this, 0, 0, 4, this.invertWorldY(15), 1, 5),
      new Electricy(this, 0, 0, 5, this.invertWorldY(15), 1, 5),
      new Electricy(this, 0, 0, 3, this.invertWorldY(14), 2, 5),
      new Electricy(this, 0, 0, 4, this.invertWorldY(14), 2, 5),
      new Electricy(this, 0, 0, 5, this.invertWorldY(14), 2, 5),
      new Electricy(this, 0, 0, 3, this.invertWorldY(13), 3, 5),
      new Electricy(this, 0, 0, 4, this.invertWorldY(13), 3, 5),
      new Electricy(this, 0, 0, 5, this.invertWorldY(13), 3, 5),

      new Electricy(this, 0, 0, 2, this.invertWorldY(29), 2, 4),
      new Electricy(this, 0, 0, 3, this.invertWorldY(29), 2, 4),
      new Electricy(this, 0, 0, 4, this.invertWorldY(29), 2, 4),
      new Electricy(this, 0, 0, 5, this.invertWorldY(29), 2, 4),
      new Electricy(this, 0, 0, 6, this.invertWorldY(29), 2, 4),
      new Electricy(this, 0, 0, 2, this.invertWorldY(30), 2, 4),
      new Electricy(this, 0, 0, 3, this.invertWorldY(30), 2, 4),
      new Electricy(this, 0, 0, 4, this.invertWorldY(30), 2, 4),
      new Electricy(this, 0, 0, 5, this.invertWorldY(30), 2, 4),
      new Electricy(this, 0, 0, 6, this.invertWorldY(30), 2, 4),

      new Electricy(this, 0, 0, 2, this.invertWorldY(27), 0, 4),
      new Electricy(this, 0, 0, 3, this.invertWorldY(27), 0, 4),
      new Electricy(this, 0, 0, 4, this.invertWorldY(27), 0, 4),
      new Electricy(this, 0, 0, 5, this.invertWorldY(27), 0, 4),
      new Electricy(this, 0, 0, 6, this.invertWorldY(27), 0, 4),
      new Electricy(this, 0, 0, 2, this.invertWorldY(25), 0, 4),
      new Electricy(this, 0, 0, 3, this.invertWorldY(25), 0, 4),
      new Electricy(this, 0, 0, 4, this.invertWorldY(25), 0, 4),
      new Electricy(this, 0, 0, 5, this.invertWorldY(25), 0, 4),
      new Electricy(this, 0, 0, 6, this.invertWorldY(25), 0, 4),

      new Pit(this, 0, 0, 1, this.invertWorldY(36)),
      new Pit(this, 0, 0, 2, this.invertWorldY(36)),
      new Pit(this, 0, 0, 3, this.invertWorldY(36)),
      new Pit(this, 0, 0, 5, this.invertWorldY(36)),
      new Pit(this, 0, 0, 6, this.invertWorldY(36)),
      new Pit(this, 0, 0, 7, this.invertWorldY(36)),
      new Pit(this, 0, 0, 1, this.invertWorldY(35)),
      new Pit(this, 0, 0, 2, this.invertWorldY(35)),
      new Pit(this, 0, 0, 3, this.invertWorldY(35)),
      new Pit(this, 0, 0, 1, this.invertWorldY(34)),
      new Pit(this, 0, 0, 2, this.invertWorldY(34)),
      new Pit(this, 0, 0, 3, this.invertWorldY(34)),
      new Pit(this, 0, 0, 4, this.invertWorldY(34)),
      new Pit(this, 0, 0, 5, this.invertWorldY(34)),
      new Pit(this, 0, 0, 1, this.invertWorldY(33)),
      new Pit(this, 0, 0, 6, this.invertWorldY(32)),
      new Pit(this, 0, 0, 5, this.invertWorldY(32)),
      new Pit(this, 0, 0, 4, this.invertWorldY(32)),
      new Pit(this, 0, 0, 2, this.invertWorldY(32)),
      new Pit(this, 0, 0, 1, this.invertWorldY(32)),
      new Pit(this, 0, 0, 7, this.invertWorldY(35)),
      new Pit(this, 0, 0, 7, this.invertWorldY(34)),
      new Pit(this, 0, 0, 7, this.invertWorldY(33)),
      new Pit(this, 0, 0, 7, this.invertWorldY(32)),
      new Pit(this, 0, 0, 1, this.invertWorldY(31)),
      new Pit(this, 0, 0, 1, this.invertWorldY(30)),
      new Pit(this, 0, 0, 1, this.invertWorldY(29)),
      new Pit(this, 0, 0, 1, this.invertWorldY(28)),
      new Pit(this, 0, 0, 7, this.invertWorldY(31)),
      new Pit(this, 0, 0, 7, this.invertWorldY(30)),
      new Pit(this, 0, 0, 7, this.invertWorldY(29)),
      new Pit(this, 0, 0, 7, this.invertWorldY(28)),
      new Pit(this, 0, 0, 7, this.invertWorldY(26)),
      new Pit(this, 0, 0, 7, this.invertWorldY(27)),
      new Pit(this, 0, 0, 1, this.invertWorldY(26)),
      new Pit(this, 0, 0, 1, this.invertWorldY(27)),
      new Pit(this, 0, 0, 7, this.invertWorldY(25)),
      new Pit(this, 0, 0, 7, this.invertWorldY(24)),
      new Pit(this, 0, 0, 1, this.invertWorldY(25)),
      new Pit(this, 0, 0, 1, this.invertWorldY(24)),
      new Pit(this, 0, 0, 4, this.invertWorldY(23)),
      new Pit(this, 0, 0, 4, this.invertWorldY(22)),
      new Pit(this, 0, 0, 7, this.invertWorldY(23)),
      new Pit(this, 0, 0, 7, this.invertWorldY(22)),
      new Pit(this, 0, 0, 1, this.invertWorldY(23)),
      new Pit(this, 0, 0, 1, this.invertWorldY(22)),
      new Coin(this, 0, 0, 6, this.invertWorldY(23)),
      new Coin(this, 0, 0, 5, this.invertWorldY(22)),
      new Coin(this, 0, 0, 4, this.invertWorldY(21)),
      new Coin(this, 0, 0, 3, this.invertWorldY(20)),
      new Coin(this, 0, 0, 2, this.invertWorldY(19)),
      new Coin(this, 0, 0, 1, this.invertWorldY(18)),
      new Pit(this, 0, 0, 7, this.invertWorldY(21)),
      new Pit(this, 0, 0, 1, this.invertWorldY(21)),
      new Pit(this, 0, 0, 7, this.invertWorldY(20)),
      new Pit(this, 0, 0, 1, this.invertWorldY(20)),
      new Pit(this, 0, 0, 4, this.invertWorldY(20)),
      new Pit(this, 0, 0, 7, this.invertWorldY(19)),
      new Pit(this, 0, 0, 7, this.invertWorldY(19)),
      new Pit(this, 0, 0, 4, this.invertWorldY(19)),
      new Pit(this, 0, 0, 1, this.invertWorldY(19)),
      new Pit(this, 0, 0, 7, this.invertWorldY(18)),
      new Pit(this, 0, 0, 1, this.invertWorldY(18)),
      new Pit(this, 0, 0, 7, this.invertWorldY(17)),
      new Pit(this, 0, 0, 1, this.invertWorldY(17)),
      
      new Coin(this, 0, 0, 4, this.invertWorldY(35)),
      new Coin(this, 0, 0, 2, this.invertWorldY(33)),
      new Coin(this, 0, 0, 2, this.invertWorldY(31)),
      new Coin(this, 0, 0, 4, this.invertWorldY(28)),
      new Coin(this, 0, 0, 6, this.invertWorldY(26)),
      new Coin(this, 0, 0, 4, this.invertWorldY(16)),
      new Coin(this, 0, 0, 4, this.invertWorldY(15)),
      new Coin(this, 0, 0, 4, this.invertWorldY(14)),
      new Coin(this, 0, 0, 4, this.invertWorldY(13)),
      new Coin(this, 0, 0, 2, this.invertWorldY(10)),
      new Coin(this, 0, 0, 1, this.invertWorldY(9)),
      new Coin(this, 0, 0, 1, this.invertWorldY(7)),
      new Coin(this, 0, 0, 2, this.invertWorldY(6)),
    ];
    this.obstacles = [];
    for (let obstacle of obstacles) {
      this.add.existing(obstacle);
      this.worldContainer.add(obstacle);
      obstacle.x = 32 * obstacle.worldX;
      obstacle.y = 32 * obstacle.worldY;
      this.obstacles.push(obstacle);
    }
    this.character.jump();
    const foreground = new Foreground(this, 0, 0);

    this.worldContainer.add(foreground);

    const target = this.characterY + 3;
    this.worldContainer.y += 32 * this.invertWorldY(target);
    this.stage.layer.y += 32 * this.invertWorldY(target);
    this.stage.y += 32 * this.invertWorldY(target);

    this.helpText = this.add.sprite(0, 0, 'helper-text');
    this.worldContainer.add(this.helpText);
    this.helpText.x = 32 * 4;
    this.helpText.y = 32 * this.invertWorldY(4) - 15;
    this.helpText.scale = 0.8;
  }

  invertWorldY(y) {
    return this.stage.rows - y;
  }

  update(time, delta) {
    Heartbeat.update(time);
    this.beatDebugRect.fillColor = Heartbeat.isBeat ? 0xff0000 : 0xffffff;
    this.obstacleMovement();

    if (!this.character.isAlive) {
      return;
    }

    this.characterMovement();
  }

  characterMovement() {
    if (this.character.isMoving) {
      return;
    }

    if (
      (Phaser.Input.Keyboard.JustDown(this.upKey) && this.isKeys) ||
      (Heartbeat.currentAction === "up" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX, this.characterY - 1)) {
        this.moveVertical(1);
        this.characterY -= 1;
        Stats.move();
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.downKey) && this.isKeys) ||
      (Heartbeat.currentAction === "down" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX, this.characterY + 1)) {
        this.moveVertical(-1);
        this.characterY += 1;
        Stats.move();
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.leftKey) && this.isKeys) ||
      (Heartbeat.currentAction === "left" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX - 1, this.characterY)) {
        this.character.left();
        this.characterX -= 1;
        Stats.move();
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.rightKey) && this.isKeys) ||
      (Heartbeat.currentAction === "right" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX + 1, this.characterY)) {
        this.character.right();
        this.characterX += 1;
        Stats.move();
      }
    }

    if (this.stage.isWin(this.characterX, this.characterY)) {
      Stats.end(this.time.now);
      this.character.isAlive = false;
      this.time.delayedCall(2000, () => {
        this.scene.start('you-win');
      });
      this.character.jump(-1)
    }
    //console.log('moved to ', this.characterX, this.invertWorldY(this.characterY));
  }

  obstacleMovement() {
    for (let obstacle of this.obstacles) {
      obstacle.beat?.(Heartbeat.beatCount);

      if (!this.character.isAlive) {
        continue;
      }
      if (
        obstacle.worldX === this.characterX &&
        obstacle.worldY === this.characterY
      ) {
        if (obstacle instanceof Coin) {
          Stats.collect();
          obstacle.collect();
        } else {
          if (obstacle.kill) {
            Stats.end(this.time.now);
            this.handleLandingOnPit(obstacle.kill);
          }
        }
      }
    }
  }

  moveVertical(direction) {
    if (direction > 0) {
      if (this.characterY > 5 && this.characterY < this.stage.rows - 1) {
        this.character.up(true);
        this.moveScreen(this.worldContainer, 0, 32);
        this.moveScreen(this.stage, 0, 32);
        this.moveScreen(this.stage.layer, 0, 32);
      } else {
        this.character.up();
      }
    } else {
      if (this.characterY > 4 && this.characterY < this.stage.rows - 2) {
        this.character.down(true);
        this.moveScreen(this.worldContainer, 0, -32);
        this.moveScreen(this.stage, 0, -32);
        this.moveScreen(this.stage.layer, 0, -32);
      } else {
        this.character.down();
      }
    }
  }

  tryMove(x, y) {
    if (x > this.stage.columns - 2) {
      return false;
    }
    if (x < 1) {
      return false;
    }
    if (y < 1) {
      return false;
    }
    if (y > this.stage.rows - 2) {
      return false;
    }
    return !this.stage.isWall(x, y);
  }

  moveScreen(target, x = 0, y = 0) {
    this.tweens.add({
      targets: target,
      x: target.x + x,
      y: target.y + y,
      ease: "Power1",
      duration: this.character.moveSpeed,
    });
  }

  positionCharacter(sprite, x, y) {
    const position = new Phaser.Math.Vector2(
      x * 32,
      (8 - y + this.characterY) * 32
    );
    sprite.x = position.x;
    sprite.y = position.y;
  }

  handleLandingOnPit(kind) {
    if (kind === "PIT") {
      this.character.fallOnPit(() => this.goToYouLose());
      return;
    } else {
      this.character.electrocute(() => this.goToYouLose());
    }
  }

  goToYouLose() {
    this.time.delayedCall(1000, () => this.scene.start("you-lose"));
  }
}
