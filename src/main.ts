import Phaser from "phaser";
import { WIDTH, HEIGHT } from "./config/palette";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#3B2A20",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  scene: [BootScene, PreloadScene, GameScene],
};

const game = new Phaser.Game(config);

(window as unknown as { game: Phaser.Game }).game = game;
