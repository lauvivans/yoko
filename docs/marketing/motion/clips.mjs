// Records short live clips of the prototype, with a visible cursor and captions, and encodes out/clips.mp4 (1920x1080, 30fps). See README.md.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import ffmpeg from 'ffmpeg-static';

const BASE = 'http://localhost:4173/docs/prototypes/platform/';
const OUT = path.resolve('out/clip-frames');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, colorScheme: 'light', reducedMotion: 'no-preference' });
await context.addInitScript(() => {
  if (!sessionStorage.getItem('__seeded')) {
    localStorage.clear();
    localStorage.setItem('yoko-prototype-mascot-theme', 'coffee');
    sessionStorage.setItem('__seeded', '1');
  }
  const install = () => {
    if (document.getElementById('__cursor')) return;
    const style = document.createElement('style');
    style.textContent = `
      #__cursor{position:fixed;left:0;top:0;width:22px;height:22px;margin:-3px 0 0 -3px;z-index:2147483647;pointer-events:none}
      #__cursor svg{width:22px;height:22px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
      .__ripple{position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:3px solid #ff615e;z-index:2147483646;pointer-events:none;animation:__ripple .5s ease-out forwards}
      @keyframes __ripple{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}
      #__caption{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);z-index:2147483645;padding:10px 22px;border-radius:999px;background:#1a1a1a;color:#fdfdff;font:700 22px Quicksand,system-ui,sans-serif;opacity:0;transition:opacity .35s,transform .35s;pointer-events:none;white-space:nowrap}
      #__caption.is-on{opacity:1;transform:translateX(-50%) translateY(0)}`;
    document.head.append(style);
    const cursor = document.createElement('div');
    cursor.id = '__cursor';
    cursor.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.5L16 20l-3 1.5-3.5-7.5L4 19Z" fill="#fdfdff" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.body.append(cursor);
    const caption = document.createElement('div');
    caption.id = '__caption';
    document.body.append(caption);
    const last = JSON.parse(sessionStorage.getItem('__pos') || '[700,400]');
    cursor.style.transform = `translate(${last[0]}px, ${last[1]}px)`;
    window.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      sessionStorage.setItem('__pos', JSON.stringify([e.clientX, e.clientY]));
    }, true);
    window.addEventListener('mousedown', (e) => {
      const ripple = document.createElement('div');
      ripple.className = '__ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.append(ripple);
      setTimeout(() => ripple.remove(), 600);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
});

const page = await context.newPage();
const cdp = await context.newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
  const file = path.join(OUT, `${String(frames.length).padStart(6, '0')}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, t: metadata.timestamp });
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
const pause = (ms) => page.waitForTimeout(ms);
let pos = { x: 700, y: 400 };
const glide = async (target, steps = 20) => {
  const box = await page.locator(target).first().boundingBox();
  pos = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.mouse.move(pos.x, pos.y, { steps });
};
const click = async (target, steps) => {
  await glide(target, steps);
  await pause(120);
  await page.mouse.down();
  await page.mouse.up();
};
const caption = (text) => page.evaluate((t) => {
  const el = document.getElementById('__caption');
  if (!el) return;
  el.textContent = t;
  el.classList.toggle('is-on', Boolean(t));
}, text);
const go = async (file) => {
  await page.goto(BASE + file, { waitUntil: 'load' });
  await page.mouse.move(pos.x, pos.y);
};

// Warm the page before recording, so the first frame isn't blank.
await go('tasks.html');
await pause(600);
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });

// 1. Tasks: the mascot cheers when a task is done
await go('tasks.html');
await caption('Plan your day…');
await pause(1400);
await click('.c-task__status >> nth=1');
await pause(500);
await click('.c-status-list [role=option]:has-text("Completed")');
await caption('…and get cheered on');
await pause(2200);

// 2. Occurrences: from the list to the calendar
await go('occurrences.html');
await caption('Count down to what matters');
await pause(900);
await click('.p-occurrence__tab:has-text("Calendar")');
await pause(1600);

// 3. Lists: add an item and tick one off
await go('lists.html');
await caption('Keep your lists at hand');
await pause(600);
await click('#new-item');
await page.keyboard.type('Bananas', { delay: 110 });
await pause(250);
await page.keyboard.press('Enter');
await pause(600);
await click('[aria-label="Done: Oat milk"]');
await pause(1200);

// 4. Notes: open one and keep writing
await go('notes.html');
await caption('Write down whatever is on your mind');
await pause(600);
await click('.c-note__open:has-text("Lisbon trip")');
await pause(700);
const note = page.locator('#edit-panel textarea').first();
await note.click();
await page.keyboard.press('Control+End');
await page.keyboard.type(' Ride the tram 28!', { delay: 90 });
await pause(1000);

// 5. Search
await go('home.html');
await caption('Find anything with Ctrl K');
await pause(500);
await page.keyboard.press('Control+K');
await pause(500);
await page.keyboard.type('lis', { delay: 140 });
await pause(700);
await page.keyboard.press('ArrowDown');
await pause(350);
await page.keyboard.press('ArrowDown');
await pause(900);

await cdp.send('Page.stopScreencast');
await context.close();
await browser.close();

// Each frame lasts until the next one, so the clip keeps the real timing.
const slash = (p) => p.split(path.sep).join('/');
const list = frames.map((f, i) => `file '${slash(f.file)}'\nduration ${((frames[i + 1]?.t ?? f.t + 0.5) - f.t).toFixed(4)}`);
list.push(`file '${slash(frames.at(-1).file)}'`);
fs.writeFileSync('out/clip-frames.txt', list.join('\n'));
execFileSync(ffmpeg, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'out/clip-frames.txt', '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', 'out/clips.mp4']);
console.log('frames:', frames.length, 'seconds:', (frames.at(-1).t - frames[0].t).toFixed(1), '→ clips.mp4');
