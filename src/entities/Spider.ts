import Phaser from "phaser";
import { Entity } from "./Entity";
import { TEX } from "../systems/TextureFactory";
import { COLORS, WIDTH, HEIGHT } from "../config/palette";

export type SpiderState = "roam" | "telegraph" | "lunge" | "recover";

export class Spider extends Entity {
  mode: SpiderState = "roam";
  targetX = 0;
  targetY = 0;
  private timer = 0;
  private wanderX: number;
  private wanderY: number;
  private glint: Phaser.GameObjects.Image;
  private telegraphRing: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.spider);
    this.speed = 22;
    this.wanderX = x;
    this.wanderY = y;
    this.targetX = x;
    this.targetY = y;
    this.glint = scene.add
      .image(x, y, TEX.dot)
      .setTint(COLORS.spider.eye)
      .setAlpha(0)
      .setScale(1.5)
      .setDepth(y + 2);
    this.telegraphRing = scene.add.graphics();
    this.telegraphRing.setDepth(y + 3);
  }

  telegraph(x: number, y: number): void {
    if (this.mode !== "roam") return;
    this.mode = "telegraph";
    this.timer = Phaser.Math.FloatBetween(0.4, 0.6);
    this.targetX = x;
    this.targetY = y;
    this.sprite.setTexture(TEX.spiderAlert);
  }

  update(dt: number): void {
    this.timer -= dt;
    switch (this.mode) {
      case "roam": {
        const dx = this.wanderX - this.x;
        const dy = this.wanderY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) this.pickWander();
        else this.moveBy((dx / dist) * this.speed * dt, (dy / dist) * this.speed * dt);
        this.glint.setAlpha(0);
        this.telegraphRing.clear();
        this.sprite.setTexture(TEX.spider);
        break;
      }
      case "telegraph": {
        const flicker = 0.4 + 0.6 * Math.abs(Math.sin(this.timer * 30));
        this.glint.setAlpha(flicker);
        this.drawTelegraphRing(flicker);
        this.moveBy(0, 0);
        if (this.timer <= 0) {
          this.mode = "lunge";
          this.timer = 0.4;
        }
        break;
      }
      case "lunge": {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        this.moveBy((dx / dist) * 150 * dt, (dy / dist) * 150 * dt);
        this.glint.setAlpha(0.3);
        this.telegraphRing.clear();
        if (this.timer <= 0) this.mode = "recover";
        break;
      }
      case "recover": {
        this.glint.setAlpha(0);
        this.telegraphRing.clear();
        this.sprite.setTexture(TEX.spider);
        // Move toward the flee point during recovery
        {
          const dx = this.wanderX - this.x;
          const dy = this.wanderY - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 4) {
            this.moveBy((dx / dist) * this.speed * 0.5 * dt, (dy / dist) * this.speed * 0.5 * dt);
          }
        }
        if (this.timer <= 0) this.mode = "roam";
        break;
      }
    }
    this.glint.setPosition(this.x, this.y);
    this.glint.setDepth(this.y + 2);
    this.sprite.setFlipX(this.targetX < this.x);
    this.sprite.setDepth(this.y);
  }

  private drawTelegraphRing(alpha: number): void {
    this.telegraphRing.clear();
    // Stroked ellipse ring around eyes — the fair-warning tell
    this.telegraphRing.lineStyle(1, COLORS.spider.eye, alpha * 0.35);
    this.telegraphRing.strokeEllipse(this.x, this.y - 1, 12, 6);
  }

  beginLunge(): void {
    if (this.mode !== "telegraph") return;
    this.mode = "lunge";
    this.timer = 0.4;
  }

  recover(): void {
    this.mode = "recover";
    this.timer = 0.5;
    this.glint.setAlpha(0);
    this.telegraphRing.clear();
    // After a miss, flee far from the attack point so we don't re-detect immediately
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 40;
    this.wanderX = Phaser.Math.Clamp(
      this.targetX + Math.cos(angle) * dist,
      12,
      WIDTH - 12,
    );
    this.wanderY = Phaser.Math.Clamp(
      this.targetY + Math.sin(angle) * dist,
      12,
      HEIGHT - 12,
    );
  }

  private pickWander(): void {
    this.wanderX = Phaser.Math.Clamp(this.x + Phaser.Math.Between(-50, 50), 12, WIDTH - 12);
    this.wanderY = Phaser.Math.Clamp(this.y + Phaser.Math.Between(-50, 50), 12, HEIGHT - 12);
  }

  private moveBy(dx: number, dy: number): void {
    this.sprite.x += dx;
    this.sprite.y += dy;
  }

  destroy(): void {
    this.glint.destroy();
    this.telegraphRing.destroy();
    super.destroy();
  }
}
