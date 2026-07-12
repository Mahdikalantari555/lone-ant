import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const PORT = 4173;

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: "ignore",
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await wait(6000);
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load", timeout: 30000 });
  await wait(2000);

  const canvas = await page.$("canvas");
  const box = await canvas.boundingBox();
  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.click(cx, cy);
    await wait(400);
    await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.3);
  }
  await wait(5000);

  const hasCanvas = (await page.$("canvas")) !== null;
  const booted = await page.evaluate(() => Boolean(window.game && window.game.isBooted));

  await browser.close();
  server.kill();

  if (!hasCanvas) {
    console.error("SMOKE FAIL: no <canvas> element");
    process.exit(1);
  }
  if (!booted) {
    console.error("SMOKE FAIL: Phaser game not booted");
    process.exit(1);
  }
  if (errors.length > 0) {
    console.error("SMOKE FAIL: console/page errors:\n" + errors.join("\n"));
    process.exit(1);
  }
  console.log("SMOKE OK");
}

main().catch((e) => {
  console.error(e);
  server.kill();
  process.exit(1);
});
