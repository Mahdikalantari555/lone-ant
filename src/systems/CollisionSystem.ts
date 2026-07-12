import Phaser from "phaser";
import { Entity } from "../entities/Entity";

export class CollisionSystem {
  static distance(a: Entity, b: Entity): number {
    return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
  }

  static overlap(a: Entity, b: Entity, radius: number): boolean {
    return CollisionSystem.distance(a, b) <= radius;
  }

  static overlapPoint(entity: Entity, x: number, y: number, radius: number): boolean {
    return Phaser.Math.Distance.Between(entity.x, entity.y, x, y) <= radius;
  }
}
