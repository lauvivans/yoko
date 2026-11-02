// Captures the screenshots used in the highlights of motion.html. See README.md.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const BASE = 'http://localhost:4173/docs/prototypes/platform/';
const OUT = path.resolve('out/shots');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' });
// Visits off, so no mascot walks in front of a screenshot.
await context.addInitScript(() => localStorage.setItem('yoko-prototype-buddy', 'off'));
const page = await context.newPage();
const shot = async (name, file, prepare) => {
  await page.goto(BASE + file, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  if (prepare) await prepare();
  await page.waitForTimeout(300);
  await page.locator('.app').screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('shot', name);
};

await shot('tasks', 'tasks.html');
await shot('settings', 'settings.html', () => page.locator('#modules').scrollIntoViewIfNeeded());
await shot('dark', 'tasks.html', () => page.evaluate(() => window.YokoTheme.set('dark')));
await browser.close();
