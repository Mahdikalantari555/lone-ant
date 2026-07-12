import Phaser from "phaser";
import { WIDTH } from "../config/palette";
import { ColonyState } from "../state/ColonyState";

export class Hud {
  private storageText: Phaser.GameObjects.Text;
  private colonyText: Phaser.GameObjects.Text;
  private dayText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, colony: ColonyState) {
    const style = {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#F4E9D8",
    } as const;

    this.storageText = scene.add
      .text(6, 5, "", style)
      .setScrollFactor(0)
      .setDepth(2000);
    this.colonyText = scene.add
      .text(WIDTH - 6, 5, "", style)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(2000);
    this.dayText = scene.add
      .text(WIDTH / 2, 5, "☀", style)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(2000);

    this.refreshStorage(colony.storage);
    this.refreshColony(colony.workerCount);

    colony.on("storage-changed", (v: number) => this.refreshStorage(v));
    colony.on("workers-changed", (v: number) => this.refreshColony(v));
  }

  setDayLabel(label: string): void {
    this.dayText.setText(label);
  }

  private refreshStorage(v: number): void {
    this.storageText.setText(`🍞 ${v}`);
  }

  private refreshColony(v: number): void {
    this.colonyText.setText(`🐜 ${v}`);
  }
}
