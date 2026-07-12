import Phaser from "phaser";

export type EntityState = "idle" | "moving" | "carrying" | "respawning";

export abstract class Entity {
  protected scene: Phaser.Scene;
  protected sprite: Phaser.GameObjects.Image;
  protected path: Phaser.Math.Vector2[] = [];
  protected pathIndex = 0;
  protected speed = 48;
  state: EntityState = "idle";
  alive = true;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.add.image(x, y, texture);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  setPath(points: Phaser.Math.Vector2[]): void {
    this.path = points;
    this.pathIndex = 0;
    this.state = points.length > 0 ? "moving" : "idle";
  }

  hasPath(): boolean {
    return this.pathIndex < this.path.length;
  }

  protected followPath(dt: number): boolean {
    if (this.pathIndex >= this.path.length) return true;
    const target = this.path[this.pathIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;
    if (dist <= step) {
      this.sprite.setPosition(target.x, target.y);
      this.pathIndex++;
      if (this.pathIndex >= this.path.length) return true;
    } else {
      this.sprite.x += (dx / dist) * step;
      this.sprite.y += (dy / dist) * step;
    }
    this.faceDirection(dx, dy);
    return false;
  }

  protected faceDirection(dx: number, dy: number): void {
    if (Math.abs(dx) > Math.abs(dy)) {
      this.sprite.setFlipX(dx < 0);
    }
  }

  destroy(): void {
    this.alive = false;
    this.sprite.destroy();
  }

  abstract update(dt: number, ctx?: unknown): void;
}
