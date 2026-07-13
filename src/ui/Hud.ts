import Phaser from "phaser";
import { WIDTH } from "../config/palette";
import { ColonyState } from "../state/ColonyState";

export class Hud {
  private storageText: Phaser.GameObjects.Text;
  private colonyText: Phaser.GameObjects.Text;
  private dayIcon: Phaser.GameObjects.Text;
  private dayLabel: Phaser.GameObjects.Text;
  private bgGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, colony: ColonyState) {
    const style = {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#F4E9D8",
    } as const;
    const labelStyle = {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#C9A15F",
    } as const;

    this.bgGraphics = scene.add.graphics();
    this.bgGraphics.setScrollFactor(0);
    this.bgGraphics.setDepth(1999);
    this.bgGraphics.fillStyle(0x6b4530, 0.85);
    this.bgGraphics.fillRoundedRect(4, 4, 64, 28, 4);
    this.bgGraphics.fillRoundedRect(WIDTH / 2 - 24, 4, 48, 28, 4);
    this.bgGraphics.fillRoundedRect(WIDTH - 68, 4, 64, 28, 4);

    this.storageText = scene.add
      .text(14, 8, "", style)
      .setScrollFactor(0)
      .setDepth(2001);
    scene.add
      .text(14, 22, "stored", labelStyle)
      .setScrollFactor(0)
      .setDepth(2001);

    this.dayIcon = scene.add
      .text(WIDTH / 2, 10, "☀", { ...style, fontSize: "14px" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(2001);
    this.dayLabel = scene.add
      .text(WIDTH / 2, 24, "DAY", labelStyle)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(2001);

    this.colonyText = scene.add
      .text(WIDTH - 14, 8, "", style)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(2001);
    scene.add
      .text(WIDTH - 14, 22, "colony", labelStyle)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(2001);

    this.refreshStorage(colony.storage);
    this.refreshColony(colony.workerCount);

    colony.on("storage-changed", (v: number) => this.refreshStorage(v));
    colony.on("workers-changed", (v: number) => this.refreshColony(v));
  }

  setDayLabel(label: string): void {
    this.dayLabel.setText(label);
    if (label === "DAY") {
      this.dayIcon.setText("☀");
    } else if (label === "NIGHT") {
      this.dayIcon.setText("🌙");
    } else if (label === "DAWN") {
      this.dayIcon.setText("🌅");
    } else if (label === "DUSK") {
      this.dayIcon.setText("🌇");
    }
  }

  private refreshStorage(v: number): void {
    this.storageText.setText(`${v}`);
  }

  private refreshColony(v: number): void {
    this.colonyText.setText(`x${v}`);
  }
}
