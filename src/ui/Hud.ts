import Phaser from "phaser";
import { WIDTH, COLORS } from "../config/palette";
import { ColonyState } from "../state/ColonyState";
import { TEX } from "../systems/TextureFactory";

const PAD = 18;
const CHIP_H = 28;
const CHIP_R = 10;

export class Hud {
  private storageText: Phaser.GameObjects.Text;
  private colonyText: Phaser.GameObjects.Text;
  private dayIcon: Phaser.GameObjects.Image;
  private dayLabel: Phaser.GameObjects.Text;
  private bgGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, colony: ColonyState) {
    const numStyle = {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#F4E9D8",
      stroke: "#241812",
      strokeThickness: 1,
    } as const;
    const labelStyle = {
      fontFamily: "monospace",
      fontSize: "7px",
      color: "#C9A15F",
      stroke: "#241812",
      strokeThickness: 1,
    } as const;

    this.bgGraphics = scene.add.graphics();
    this.bgGraphics.setScrollFactor(0);
    this.bgGraphics.setDepth(1999);

    // Top-left chip: food icon + storage count
    this.drawChip(this.bgGraphics, PAD, PAD, 72, CHIP_H);
    scene.add
      .image(PAD + 6, PAD + CHIP_H / 2, TEX.foodCrumb)
      .setScrollFactor(0)
      .setDepth(2000)
      .setScale(3);
    this.storageText = scene.add
      .text(PAD + 20, PAD + 6, "", numStyle)
      .setScrollFactor(0)
      .setDepth(2001);
    scene.add
      .text(PAD + 20, PAD + 18, "stored", labelStyle)
      .setScrollFactor(0)
      .setDepth(2001);

    // Top-center chip: day/night indicator
    const cx = WIDTH / 2;
    this.drawChip(this.bgGraphics, cx - 22, PAD, 44, CHIP_H);
    this.dayIcon = scene.add
      .image(cx, PAD + 10, TEX.dot)
      .setScrollFactor(0)
      .setDepth(2000)
      .setScale(0.4)
      .setTint(COLORS.tint.dawn);
    this.dayLabel = scene.add
      .text(cx, PAD + 20, "DAY", labelStyle)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(2001);

    // Top-right chip: ant icon + colony count
    const rx = WIDTH - PAD - 72;
    this.drawChip(this.bgGraphics, rx, PAD, 72, CHIP_H);
    scene.add
      .image(rx + 6, PAD + CHIP_H / 2, TEX.workerAnt)
      .setScrollFactor(0)
      .setDepth(2000)
      .setScale(3);
    this.colonyText = scene.add
      .text(rx + 20, PAD + 6, "", numStyle)
      .setScrollFactor(0)
      .setDepth(2001);
    scene.add
      .text(rx + 20, PAD + 18, "colony", labelStyle)
      .setScrollFactor(0)
      .setDepth(2001);

    this.refreshStorage(colony.storage);
    this.refreshColony(colony.workerCount);

    colony.on("storage-changed", (v: number) => this.refreshStorage(v));
    colony.on("workers-changed", (v: number) => this.refreshColony(v));
  }

  private drawChip(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    g.fillStyle(COLORS.nest.base, 0.9);
    g.fillRoundedRect(x, y, w, h, CHIP_R);
    g.lineStyle(2, COLORS.hud.outline, 1);
    g.strokeRoundedRect(x, y, w, h, CHIP_R);
  }

  setDayLabel(label: string): void {
    this.dayLabel.setText(label);
    if (label === "DAY") {
      this.dayIcon.setTint(COLORS.tint.noon);
    } else if (label === "NIGHT") {
      this.dayIcon.setTint(COLORS.tint.night);
    } else if (label === "DAWN") {
      this.dayIcon.setTint(COLORS.tint.dawn);
    } else if (label === "DUSK") {
      this.dayIcon.setTint(COLORS.tint.dusk);
    }
  }

  private refreshStorage(v: number): void {
    this.storageText.setText(`${v}`);
  }

  private refreshColony(v: number): void {
    this.colonyText.setText(`x${v}`);
  }
}
