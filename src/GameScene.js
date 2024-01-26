import Phaser from "phaser";
import { AudioView } from "./AudioView";
import { Heartbeat } from "./HeartbeatService";
import { Character } from "./Character";
import constants from './Constants';

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
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    this.isKeys = true;
    this.isPingPong = true;

    this.gameMap = [
      ['wall', 'wall', 'wall', 'wall', 'wall',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'path', 'plgo', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'pits', 'pits', 'pits', 'path',],
      ['path', 'path', 'pits', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
      ['path', 'path', 'plsp', 'path', 'path',],
      ['path', 'path', 'path', 'path', 'path',],
    ];
    this.totalHeight = this.gameMap.length;
    this.totalWidth = this.gameMap[0].length;

    const convert = {};
    convert['pits'] = 16;
    convert['plsp'] = 0;
    convert['plgo'] = 14;
    convert['path'] = 0;
    convert['wall'] = 36;
    
    const level = [];
    for (let y = 0; y < this.gameMap.length; y ++) {
      level.push([36, 0, 0, 0, 0, 0, 36]);
      for (let x = 0; x < this.gameMap[0].length; x++) {
        level[y][x+1] = convert[this.gameMap[y][x]];
      }
    }
    level.push([36, 36, 36, 36, 36, 36, 36]);

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = this.make.tilemap({
      data: level,
      tileWidth: 16,
      tileHeight: 16,
    });
    const tiles = map.addTilesetImage("tiles");
    const layer = map.createLayer(0, tiles, 0, 0);
    layer.scale = 32 / 16;
    layer.originY = 0;
    const layerHeight = layer.layer.heightInPixels * layer.scale;
    this.floor = 10;
    layer.y = -layerHeight + this.scale.gameSize.height - this.floor + 32;
    layer.x =
      this.scale.gameSize.width / 2 -
      (layer.layer.widthInPixels * layer.scale) / 2;
    this.layer = layer;

    const enemy = this.add.rectangle(0, 0, 32, 32, 0xff0000);
    this.positionAnything(enemy, 2, 2);
    this.worldContainer = this.add.container(0, 0, [layer]);
    this.worldContainer.x += 16;
    this.worldContainer.y += 6;
    this.worldContainer.add(enemy);

    const startingPoint = this.findOnGameMap(x => x === constants.playerStartingPoint);
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

    if ((Phaser.Input.Keyboard.JustDown(this.upKey) && this.isKeys) || (Heartbeat.currentAction === 'up' && this.isPingPong)) {
      if (this.tryMove(this.characterX, this.characterY-1)) {
        this.moveVertical(1);
        this.characterY -= 1;
      }
    }
    if ((Phaser.Input.Keyboard.JustDown(this.downKey) && this.isKeys) || (Heartbeat.currentAction === 'down' && this.isPingPong)) {
      if (this.tryMove(this.characterX, this.characterY+1)) {
        this.moveVertical(-1);
        this.characterY += 1;
      }
    }
    if ((Phaser.Input.Keyboard.JustDown(this.leftKey) && this.isKeys) || (Heartbeat.currentAction === 'left' && this.isPingPong)) {
      if (this.tryMove(this.characterX-1, this.characterY)) {
        this.character.left();
        this.characterX -= 1;
      }
    }
    if ((Phaser.Input.Keyboard.JustDown(this.rightKey) && this.isKeys) || (Heartbeat.currentAction === 'right' && this.isPingPong)) {
      if (this.tryMove(this.characterX+1, this.characterY)) {
        this.character.right();
        this.characterX += 1;
      }
    }
  }

  moveVertical(direction) {
    if (direction > 0) {
      if (this.characterY > 5 && this.characterY < this.gameMap.length - 1) {
        this.character.up(true);
        this.moveScreen(this.worldContainer, 0, 32);
        this.moveScreen(this.layer, 0, 32);
      }
      else {
        this.character.up();
      }
    }
    else {
      console.log('top',5, 'bottom', this.gameMap.length - 2, 'characterY');
      if (this.characterY > 4 && this.characterY < this.gameMap.length-2) {
        this.character.down(true);
        this.moveScreen(this.worldContainer, 0, -32);
        this.moveScreen(this.layer, 0, -32);
      }
      else {
        this.character.down();
      }
    }
  }

  tryMove(x, y) {
    if (x > this.gameMap[0].length - 1) {
      return false;
    }
    if (x < 0) {
      return false;
    }
    if (y < 0) {
      return false;
    }
    if (y > this.gameMap.length - 1) {
      return false;
    }
    return this.gameMap[y][x] !== constants.wall;
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
    return new Phaser.Math.Vector2(x * 32 + 32, 8 * 32 - (y-(this.characterY - 1)) * 32 + 32);
  }

  findOnGameMap(predicate) {
    for(let y = 0; y < this.gameMap.length; y++) {
      for (let x = 0; x < this.gameMap[y].length; x++) {
        if (predicate(this.gameMap[y][x])) {
          return new Phaser.Math.Vector2(x, y);
        }
      }
    }
    return new Phaser.Math.Vector2(-1, -1);
  }

  getTile(x, y) {
    return this.gameMap[y][x];
  }

  getTileVector(vector) {
    return this.gameMap[vector.y][vector.x];
  }

  calculateLanding() {
    const tile = this.getTile(this.characterX, this.characterY);

    switch(tile) {
      case constants.pits: 
        this.handleLandingOnPit();
        return;
    }
  }

  handleLandingOnPit() {
    this.character.fallOnPit(() => this.goToYouLose());
  }

  goToYouLose() {
    this.time.delayedCall(1000, () => this.scene.start('you-lose'));
  }
}
