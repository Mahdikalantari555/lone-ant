import Phaser from "phaser";
import { COLORS, TILE } from "../config/palette";

export const TEX = {
  playerAnt: "tex-player-ant",
  workerAnt: "tex-worker-ant",
  foodCrumb: "tex-food-crumb",
  spider: "tex-spider",
  dot: "tex-dot",
  leaf: "tex-leaf",
} as const;

export function generateTextures(scene: Phaser.Scene): void {
  generateAnt(scene, TEX.playerAnt, COLORS.playerAnt.body, COLORS.playerAnt.highlight);
  generateAnt(scene, TEX.workerAnt, COLORS.workerAnt.body, COLORS.workerAnt.highlight);
  generateCrumb(scene);
  generateSpider(scene);
  generateDot(scene);
  generateLeaf(scene);
}

function generateAnt(scene: Phaser.Scene, key: string, body: number, highlight: number): void {
  const size = 16;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.playerAnt.shadow, 1);
  g.fillRect(7, 13, 2, 2);
  g.fillStyle(body, 1);
  g.fillRect(6, 4, 4, 4);
  g.fillRect(7, 8, 3, 4);
  g.fillRect(6, 12, 4, 2);
  g.fillStyle(highlight, 1);
  g.fillRect(7, 4, 2, 1);
  g.fillRect(8, 9, 1, 2);
  g.fillStyle(0x000000, 1);
  g.fillRect(6, 2, 1, 2);
  g.fillRect(9, 2, 1, 2);
  g.generateTexture(key, size, size);
  g.destroy();
}

function generateCrumb(scene: Phaser.Scene): void {
  const size = 8;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.food.crumbA, 1);
  g.fillRect(1, 2, 6, 4);
  g.fillStyle(COLORS.food.crumbC, 1);
  g.fillRect(2, 1, 3, 2);
  g.generateTexture(TEX.foodCrumb, size, size);
  g.destroy();
}

function generateSpider(scene: Phaser.Scene): void {
  const size = 24;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.spider.body, 1);
  g.fillCircle(12, 9, 6);
  g.fillCircle(12, 17, 4);
  g.lineStyle(2, COLORS.spider.body, 1);
  for (const dx of [-1, 1]) {
    g.lineBetween(12, 9, 12 + dx * 9, 4);
    g.lineBetween(12, 10, 12 + dx * 10, 12);
    g.lineBetween(12, 12, 12 + dx * 9, 20);
  }
  g.fillStyle(COLORS.spider.warning, 1);
  g.fillRect(10, 6, 1, 1);
  g.fillRect(13, 6, 1, 1);
  g.generateTexture(TEX.spider, size, size);
  g.destroy();
}

function generateDot(scene: Phaser.Scene): void {
  const size = TILE;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(size / 2, size / 2, size / 2);
  g.generateTexture(TEX.dot, size, size);
  g.destroy();
}

function generateLeaf(scene: Phaser.Scene): void {
  const w = 16;
  const h = 24;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.grass.shadow, 1);
  g.fillRect(7, 8, 2, 14);
  g.fillStyle(COLORS.grass.mid, 1);
  g.fillTriangle(8, 2, 2, 14, 14, 14);
  g.fillStyle(COLORS.grass.highlight, 1);
  g.fillTriangle(8, 5, 5, 13, 11, 13);
  g.generateTexture(TEX.leaf, w, h);
  g.destroy();
}
