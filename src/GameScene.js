import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";
import constants from "./Constants";
import { StageBackground } from "./StageBackground";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
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
    this.isPingPong = true;
    this.stage = new StageBackground(this);
    this.add.existing(this.stage);

    const enemy = this.add.rectangle(0, 0, 32, 32, 0xff0000);
    this.positionAnything(enemy, 2, 2);
    this.worldContainer = this.add.container(0, 0);
    this.worldContainer.x += 16;
    this.worldContainer.y += 6;
    this.worldContainer.add(enemy);

    const startingPoint = this.stage.getStartingPoint();
    this.characterY = startingPoint.y;
    this.characterX = startingPoint.x;

    this.character = new Character(this, 0, 0, this.moveSpeed);
    this.character.onMoveComplete = () => this.calculateLanding();
    this.add.existing(this.character);
    this.positionAnything(this.character, startingPoint.x, startingPoint.y);

    new AudioView(this, 0, 0);

    this.beatDebugRect = this.add.rectangle(0, 0, 200, 30, 0xffffff);
    this.beatDebugRect.alpha = 0;
  }

  update(time, delta) {
    Heartbeat.update(time);

    this.beatDebugRect.fillColor = Heartbeat.isBeat ? 0xff0000 : 0xffffff;

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

  moveVertical(direction) {
    if (direction > 0) {
      if (this.characterY > 5 && this.characterY < this.stage.rows - 1) {
        this.character.up(true);
        this.moveScreen(this.worldContainer, 0, 32);
        this.moveScreen(this.stage.layer, 0, 32);
      } else {
        this.character.up();
      }
    } else {
      console.log("top", 5, "bottom", this.stage.rows - 2, "characterY");
      if (this.characterY > 4 && this.characterY < this.stage.rows - 2) {
        this.character.down(true);
        this.moveScreen(this.worldContainer, 0, -32);
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

  positionAnything(sprite, x, y) {
    const position = this.getPositionOnScreen(x, y);
    sprite.x = position.x;
    sprite.y = position.y;
  }

  getPositionOnScreen(x, y) {
    return new Phaser.Math.Vector2(
      (x - 1) * 32 + 32,
      8 * 32 - (y - (this.characterY - 1)) * 32 + 32
    );
  }

  calculateLanding() {
    const tile = this.stage.getTile(this.characterX, this.characterY);

    switch (tile) {
      case constants.pits:
        this.handleLandingOnPit();
        return;
    }
  }

  handleLandingOnPit() {
    this.character.fallOnPit(() => this.goToYouLose());
  }

  goToYouLose() {
    this.time.delayedCall(1000, () => this.scene.start("you-lose"));
  }
}
