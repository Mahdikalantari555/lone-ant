import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { COLORS, WIDTH, HEIGHT } from "../config/palette";

export class PlayerAnt extends Entity {
  carrying = false;
  private halo: Phaser.GameObjects.Image;
  private glow: Phaser.GameObjects.Image;
  private carriedFood?: Phaser.GameObjects.Image;
  private bobT = 0;
  private respawnTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.playerAnt);
    this.speed = 56;
    this.sprite.setTint(COLORS.playerAnt.body);
    this.halo = scene.add
      .image(x, y, TEX.dot)
      .setTint(COLORS.playerAnt.highlight)
      .setAlpha(0)
      .setScale(0.5)
      .setDepth(y - 1);
    this.glow = scene.add
      .image(x, y, TEX.dot)
      .setTint(COLORS.pheromone.core)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0)
      .setScale(0.3)
      .setDepth(y - 2);
  }

  requestPath(points: Phaser.Math.Vector2[]): void {
    if (this.state === "respawning") return;
    this.setPath(points);
  }

  setCarrying(value: boolean): void {
    this.carrying = value;
    this.state = this.carrying ? "carrying" : this.hasPath() ? "moving" : "idle";
    if (this.carrying && !this.carriedFood) {
      this.carriedFood = this.scene.add
        .image(this.x, this.y - 12, TEX.foodCrumb)
        .setDepth(this.y + 1);
    } else if (!this.carrying && this.carriedFood) {
      this.carriedFood.destroy();
      this.carriedFood = undefined;
    }
  }

  respawnAt(x: number, y: number): void {
    this.state = "respawning";
    this.respawnTimer = 0;
    this.setCarrying(false);
    this.setPath([]);
    this.sprite.setAlpha(0.2);
    this.halo.setAlpha(0);
    this.glow.setAlpha(0);
    this.sprite.setPosition(x, y);
  }

  update(dt: number, _ctx?: unknown): void {
    this.bobT += dt;
    switch (this.state) {
      case "respawning":
        this.respawnTimer += dt;
        this.sprite.setAlpha(Phaser.Math.Clamp(0.2 + this.respawnTimer * 1.6, 0, 1));
        if (this.respawnTimer >= 0.6) {
          this.state = "idle";
          this.sprite.setAlpha(1);
        }
        break;
      case "moving":
      case "carrying": {
        const arrived = this.followPath(dt);
        if (arrived) this.state = this.carrying ? "carrying" : "idle";
        this.updateHalo(0);
        break;
      }
      case "idle":
        this.updateHalo(0.5 + Math.sin(this.bobT * 3) * 0.3);
        break;
    }

    this.halo.setPosition(this.x, this.y);
    this.halo.setDepth(this.y - 1);

    const glowPulse = 0.15 + Math.sin(this.bobT * 2) * 0.1;
    this.glow.setPosition(this.x, this.y);
    this.glow.setDepth(this.y - 2);
    this.glow.setAlpha(this.state === "respawning" ? 0 : glowPulse);
    this.glow.setScale(0.4 + Math.sin(this.bobT * 2.5) * 0.1);

    if (this.carriedFood) {
      const off = Math.sin(this.bobT * 6) * 1.5;
      this.carriedFood.setPosition(this.x, this.y - 12 + off);
      this.carriedFood.setDepth(this.y + 1);
    }
    this.sprite.setDepth(this.y);
    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 0, WIDTH);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, 0, HEIGHT);
  }

  private updateHalo(alpha: number): void {
    this.halo.setAlpha(alpha);
    const scale = 0.5 + Math.sin(this.bobT * 3) * 0.08;
    this.halo.setScale(scale);
  }
}
