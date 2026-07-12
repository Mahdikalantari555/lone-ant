import Phaser from "phaser";
import { generateTextures } from "../systems/TextureFactory";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  create(): void {
    generateTextures(this);
    this.scene.start("Game");
  }
}
