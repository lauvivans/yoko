// Renders motion.html frame by frame (the GSAP timeline is sought to each frame), splits it where the live clips go,
// and joins motion + out/clips.mp4 + motion into out/yoko-motion.mp4. See README.md.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import ffmpeg from 'ffmpeg-static';

const FPS = 30;
const OUT = path.resolve('out/frames');
const only = process.argv[2];
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(pathToFileURL(path.resolve('motion.html')).href, { waitUntil: 'load' });
await page.evaluate(() => window.motionReady);
const duration = await page.evaluate(() => window.tl.duration());
const cut = await page.evaluate(() => window.cut);
const times = only ? only.split(',').map(Number) : Array.from({ length: Math.ceil(duration * FPS) }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((time) => {
    window.tl.seek(time, false);
  }, t);
  await page.screenshot({ path: path.join(OUT, only ? `t${t}.jpg` : `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
}
await browser.close();
console.log('duration', duration.toFixed(2), 's | cut at', cut.toFixed(2), '| frames', times.length, '| page errors', errors.length ? errors : 'none');
if (!only) {
  const encode = (args, out) => execFileSync(ffmpeg, ['-v', 'error', '-y', ...args, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', out]);
  const frames = ['-framerate', String(FPS), '-i', path.join(OUT, '%05d.jpg')];
  const cutFrame = Math.round(cut * FPS);
  encode([...frames, '-vf', `trim=end_frame=${cutFrame},setpts=PTS-STARTPTS`], 'out/part-a.mp4');
  encode([...frames, '-vf', `trim=start_frame=${cutFrame},setpts=PTS-STARTPTS`], 'out/part-b.mp4');
  const clipSeconds = () => {
    try {
      execFileSync(ffmpeg, ['-i', 'out/clips.mp4'], { stdio: 'pipe' });
    } catch (e) {
      const [, h, m, sec] = e.stderr.toString().match(/Duration: (\d+):(\d+):([\d.]+)/);
      return +h * 3600 + +m * 60 + +sec;
    }
  };
  // Short fades between the motion and the live clips.
  execFileSync(ffmpeg, [
    '-v', 'error', '-y', '-i', 'out/part-a.mp4', '-i', 'out/clips.mp4', '-i', 'out/part-b.mp4',
    '-filter_complex',
    `[0:v]fps=${FPS},settb=AVTB[a];[1:v]fps=${FPS},settb=AVTB[c];[2:v]fps=${FPS},settb=AVTB[b];` +
      `[a][c]xfade=transition=fade:duration=0.4:offset=${(cutFrame / FPS - 0.4).toFixed(3)}[ac];` +
      `[ac][b]xfade=transition=fade:duration=0.4:offset=${(cutFrame / FPS - 0.4 + clipSeconds() - 0.4).toFixed(3)}[v]`,
    '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'out/yoko-motion.mp4',
  ]);
  console.log('wrote yoko-motion.mp4');
}
