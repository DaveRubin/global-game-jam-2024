import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";
import { Electricy } from "./Electricy";
import { Pit } from "./Pit";
import { Coin } from "./Coin";
import { StageBackground } from "./StageBackground";
import { Foreground } from "./Foreground";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.spritesheet({
      key: "coin",
      url: "assets/coins/coins.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
        startFrame: 0,
        endFrame: 20,
      },
    });

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
    this.load.atlas({
      key: "flares",
      textureURL: "public/assets/particles/flares.png",
      atlasURL: "public/assets/particles/flares.json",
    });

    this.load.atlas({
      key: "stage",
      textureURL: "public/assets/stage.png",
      atlasURL: "public/assets/stage.json",
    });

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/Untitled.png");
    this.load.image("red", "assets/particles/red.png");

    this.load.image("tiles", "assets/Tilemap.png");
    this.load.audio("loop", "loop.mp3");
  }

  create() {
    this.sound.play("loop", { loop: true });

    this.moveSpeed = 100;
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

    this.isKeys = true;
    this.isPingPong = false;
    this.stage = new StageBackground(this);
    this.add.existing(this.stage);

    this.worldContainer = this.add.container(0, 0);
    this.worldContainer.y += 6 - 32 * (this.stage.rows - 11);

    const startingPoint = this.stage.getStartingPoint();
    this.characterY = startingPoint.y;
    this.characterX = startingPoint.x;

    this.character = new Character(this, 0, 0, this.moveSpeed);

    this.positionCharacter(this.character, startingPoint.x, startingPoint.y);

    new AudioView(this, 0, 0);

    this.beatDebugRect = this.add.rectangle(0, 0, 200, 30, 0xffffff);
    this.beatDebugRect.alpha = 0;
    const foreground = new Foreground(this, 0, 0);

    this.worldContainer.add(foreground);
    const obstacles = [
      new Electricy(this, 0, 0, 1, 6, 1, 4),
      new Electricy(this, 0, 0, 2, 6, 1, 4),
      new Electricy(this, 0, 0, 1, 7, 2, 4),
      new Electricy(this, 0, 0, 2, 7, 2, 4),
      new Electricy(this, 0, 0, 1, 8, 3, 4),
      new Electricy(this, 0, 0, 2, 8, 3, 4),

      new Pit(this, 0, 0, 3, 6),
      new Pit(this, 0, 0, 4, 6),
      new Pit(this, 0, 0, 3, 7),
      new Pit(this, 0, 0, 4, 7),
      new Pit(this, 0, 0, 3, 8),
      new Pit(this, 0, 0, 4, 8),

      new Coin(this, 0, 0, 1, 9),
      new Coin(this, 0, 0, 2, 7),
    ];
    this.obstacles = [];
    for (let obstacle of obstacles) {
      this.add.existing(obstacle);
      this.worldContainer.add(obstacle);
      obstacle.x = 32 * obstacle.worldX;
      obstacle.y = 32 * obstacle.worldY;
      this.obstacles.push(obstacle);
    }

    this.add.existing(this.character);
  }

  update(time, delta) {
    if (!this.character.isAlive) {
      return;
    }
    Heartbeat.update(time);

    this.beatDebugRect.fillColor = Heartbeat.isBeat ? 0xff0000 : 0xffffff;
    this.obstacleMovement();
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
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.downKey) && this.isKeys) ||
      (Heartbeat.currentAction === "down" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX, this.characterY + 1)) {
        this.moveVertical(-1);
        this.characterY += 1;
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.leftKey) && this.isKeys) ||
      (Heartbeat.currentAction === "left" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX - 1, this.characterY)) {
        this.character.left();
        this.characterX -= 1;
      }
    }
    if (
      (Phaser.Input.Keyboard.JustDown(this.rightKey) && this.isKeys) ||
      (Heartbeat.currentAction === "right" && this.isPingPong)
    ) {
      if (this.tryMove(this.characterX + 1, this.characterY)) {
        this.character.right();
        this.characterX += 1;
      }
    }
  }

  obstacleMovement() {
    for (let obstacle of this.obstacles) {
      obstacle.beat?.(Heartbeat.beatCount);

      if (!this.character.isAlive) {
        return;
      }
      if (
        obstacle.worldX === this.characterX &&
        obstacle.worldY === this.characterY
      ) {
        if (obstacle instanceof Coin) {
          obstacle.collect();
        } else {
          if (obstacle.kill) {
            this.handleLandingOnPit();
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
    return this.stage.isWall(x, y);
  }

  moveScreen(target, x = 0, y = 0) {
    this.tweens.add({
      targets: target,
      x: target.x + x,
      y: target.y + y,
      ease: "Power1",
      duration: this.moveSpeed,
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

  handleLandingOnPit() {
    this.character.fallOnPit(() => this.goToYouLose());
  }

  goToYouLose() {
    this.time.delayedCall(1000, () => this.scene.start("you-lose"));
  }
}
