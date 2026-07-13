import Phaser from "phaser";
import { COLORS, TILE } from "../config/palette";

export const TEX = {
  playerAnt: "tex-player-ant",
  workerAnt: "tex-worker-ant",
  foodCrumb: "tex-food-crumb",
  foodSeed: "tex-food-seed",
  foodBerry: "tex-food-berry",
  spider: "tex-spider",
  dot: "tex-dot",
  pheromone: "tex-pheromone",
  grassTuft: "tex-grass-tuft",
  groundTile: "tex-ground-tile",
} as const;

export function generateTextures(scene: Phaser.Scene): void {
  generatePlayerAnt(scene);
  generateWorkerAnt(scene);
  generateFoodCrumb(scene);
  generateFoodSeed(scene);
  generateFoodBerry(scene);
  generateSpider(scene);
  generateDot(scene);
  generatePheromoneDiamond(scene);
  generateGrassTuft(scene);
  generateGroundTile(scene);
}

function generatePlayerAnt(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 16;
  g.fillStyle(COLORS.playerAnt.shadow, 1);
  g.fillRect(6, 13, 4, 2);
  g.fillRect(5, 12, 1, 1);
  g.fillRect(10, 12, 1, 1);
  g.fillStyle(COLORS.playerAnt.body, 1);
  g.fillRect(6, 3, 4, 3);
  g.fillRect(5, 6, 6, 3);
  g.fillRect(6, 9, 4, 3);
  g.fillRect(5, 12, 6, 1);
  g.fillStyle(COLORS.playerAnt.highlight, 1);
  g.fillRect(7, 3, 2, 1);
  g.fillRect(6, 7, 2, 1);
  g.fillRect(7, 10, 2, 1);
  g.fillStyle(0x000000, 1);
  g.fillRect(6, 2, 1, 2);
  g.fillRect(9, 2, 1, 2);
  g.fillRect(5, 5, 1, 1);
  g.fillRect(10, 5, 1, 1);
  g.generateTexture(TEX.playerAnt, s, s);
  g.destroy();
}

function generateWorkerAnt(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 16;
  g.fillStyle(COLORS.workerAnt.shadow, 1);
  g.fillRect(6, 12, 4, 2);
  g.fillRect(5, 11, 1, 1);
  g.fillRect(10, 11, 1, 1);
  g.fillStyle(COLORS.workerAnt.body, 1);
  g.fillRect(6, 3, 4, 3);
  g.fillRect(5, 6, 6, 2);
  g.fillRect(6, 8, 4, 3);
  g.fillRect(5, 11, 6, 1);
  g.fillStyle(COLORS.workerAnt.highlight, 1);
  g.fillRect(7, 4, 2, 1);
  g.fillRect(6, 7, 1, 1);
  g.fillRect(9, 7, 1, 1);
  g.fillRect(7, 9, 2, 1);
  g.fillStyle(0x000000, 1);
  g.fillRect(6, 2, 1, 2);
  g.fillRect(9, 2, 1, 2);
  g.fillRect(5, 5, 1, 1);
  g.fillRect(10, 5, 1, 1);
  g.generateTexture(TEX.workerAnt, s, s);
  g.destroy();
}

function generateFoodCrumb(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 8;
  g.fillStyle(COLORS.food.crumbA, 1);
  g.fillRect(1, 2, 6, 4);
  g.fillStyle(COLORS.food.crumbB, 1);
  g.fillRect(2, 3, 4, 2);
  g.fillStyle(COLORS.food.crumbC, 1);
  g.fillRect(2, 1, 3, 2);
  g.fillRect(3, 2, 1, 1);
  g.generateTexture(TEX.foodCrumb, s, s);
  g.destroy();
}

function generateFoodSeed(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 8;
  g.fillStyle(COLORS.food.seedA, 1);
  g.fillRect(2, 1, 4, 6);
  g.fillRect(3, 0, 2, 1);
  g.fillStyle(COLORS.food.seedB, 1);
  g.fillRect(3, 2, 2, 4);
  g.fillStyle(COLORS.food.crumbC, 1);
  g.fillRect(3, 1, 1, 1);
  g.generateTexture(TEX.foodSeed, s, s);
  g.destroy();
}

function generateFoodBerry(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 8;
  g.fillStyle(COLORS.food.leafA, 1);
  g.fillRect(1, 2, 6, 4);
  g.fillRect(2, 1, 4, 1);
  g.fillRect(2, 6, 4, 1);
  g.fillStyle(COLORS.food.leafB, 1);
  g.fillRect(2, 3, 4, 2);
  g.fillStyle(COLORS.food.crumbC, 1);
  g.fillRect(2, 2, 2, 1);
  g.generateTexture(TEX.foodBerry, s, s);
  g.destroy();
}

function generateSpider(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const s = 24;
  g.fillStyle(COLORS.spider.body, 1);
  g.fillCircle(12, 10, 5);
  g.fillCircle(12, 18, 4);
  g.fillRect(10, 10, 4, 8);
  g.fillStyle(COLORS.spider.highlight, 1);
  g.fillCircle(12, 10, 3);
  g.fillRect(11, 14, 2, 4);
  g.fillStyle(COLORS.spider.body, 1);
  for (const dx of [-1, 1]) {
    g.lineStyle(2, COLORS.spider.body, 1);
    g.lineBetween(12, 8, 12 + dx * 10, 3);
    g.lineBetween(12, 10, 12 + dx * 11, 10);
    g.lineBetween(12, 13, 12 + dx * 10, 19);
    g.lineStyle(1, COLORS.spider.body, 1);
    g.lineBetween(12 + dx * 10, 3, 12 + dx * 8, 1);
    g.lineBetween(12 + dx * 10, 3, 12 + dx * 12, 1);
    g.lineBetween(12 + dx * 11, 10, 12 + dx * 13, 8);
    g.lineBetween(12 + dx * 11, 10, 12 + dx * 13, 12);
    g.lineBetween(12 + dx * 10, 19, 12 + dx * 8, 21);
    g.lineBetween(12 + dx * 10, 19, 12 + dx * 12, 21);
  }
  g.fillStyle(COLORS.spider.warning, 1);
  g.fillRect(10, 7, 1, 1);
  g.fillRect(13, 7, 1, 1);
  g.fillStyle(0xffffff, 1);
  g.fillRect(10, 8, 1, 1);
  g.fillRect(13, 8, 1, 1);
  g.generateTexture(TEX.spider, s, s);
  g.destroy();
}

function generateDot(scene: Phaser.Scene): void {
  const s = TILE;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(s / 2, s / 2, s / 2);
  g.generateTexture(TEX.dot, s, s);
  g.destroy();
}

function generatePheromoneDiamond(scene: Phaser.Scene): void {
  const s = 8;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.pheromone.core, 1);
  g.fillTriangle(4, 0, 0, 4, 4, 8);
  g.fillTriangle(4, 0, 8, 4, 4, 8);
  g.fillStyle(COLORS.pheromone.mid, 1);
  g.fillTriangle(4, 1, 1, 4, 4, 7);
  g.fillTriangle(4, 1, 7, 4, 4, 7);
  g.generateTexture(TEX.pheromone, s, s);
  g.destroy();
}

function generateGrassTuft(scene: Phaser.Scene): void {
  const w = 16;
  const h = 24;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.grass.shadow, 1);
  g.fillRect(7, 8, 2, 14);
  g.fillStyle(COLORS.grass.mid, 1);
  g.fillTriangle(8, 2, 2, 14, 14, 14);
  g.fillStyle(COLORS.grass.highlight, 1);
  g.fillTriangle(8, 5, 5, 13, 11, 13);
  g.generateTexture(TEX.grassTuft, w, h);
  g.destroy();
}

function generateGroundTile(scene: Phaser.Scene): void {
  const s = TILE;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(COLORS.ground.base, 1);
  g.fillRect(0, 0, s, s);
  g.fillStyle(COLORS.ground.mid, 0.4);
  g.fillRect(2, 2, 3, 2);
  g.fillRect(9, 7, 2, 3);
  g.fillRect(5, 11, 3, 2);
  g.fillStyle(COLORS.ground.highlight, 0.3);
  g.fillRect(11, 2, 2, 2);
  g.fillRect(1, 8, 2, 1);
  g.fillRect(7, 13, 2, 2);
  g.generateTexture(TEX.groundTile, s, s);
  g.destroy();
}
