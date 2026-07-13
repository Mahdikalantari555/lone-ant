import Phaser from "phaser";
import { WIDTH, HEIGHT } from "./config/palette";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";

const integerZoom = (): number => {
  const fit = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  return [3, 2, 1].find((level) => level <= fit) ?? 1;
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#3B2A20",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: integerZoom(),
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  scene: [BootScene, PreloadScene, GameScene],
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.setZoom(integerZoom());
});

(window as unknown as { game: Phaser.Game }).game = game;
