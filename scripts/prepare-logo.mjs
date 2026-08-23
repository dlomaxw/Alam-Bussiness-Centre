import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/Alam business center 2.png";
const OUT = "public/logo";
await mkdir(OUT, { recursive: true });

// Trim the flat border, then work on raw pixels so the white ground can become
// transparent and the black wordmark can be knocked out to white for use on
// the dark header. The red stays untouched in both variants.
const trimmed = await sharp(SRC).trim({ threshold: 12 }).png().toBuffer();
const { data, info } = await sharp(trimmed)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const dark = Buffer.from(data); // logo for light backgrounds
const light = Buffer.from(data); // logo for dark backgrounds

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isNeutral = max - min < 40;

  if (isNeutral && max > 200) {
    // Background: transparent in both variants.
    dark[i + 3] = 0;
    light[i + 3] = 0;
  } else if (isNeutral) {
    // "BUSINESS CENTER" wordmark: keep dark, knock out to white for dark
    // grounds. Alpha tracks how dark the source pixel was, so the antialiased
    // glyph edges stay smooth instead of gaining a hard white fringe.
    light[i] = 255;
    light[i + 1] = 255;
    light[i + 2] = 255;
    light[i + 3] = 255 - max;
  }
}

const opts = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(dark, opts).resize({ width: 900 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/alam-logo.png`);
await sharp(light, opts).resize({ width: 900 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/alam-logo-light.png`);

// Square icons built on the brand off-white so the red mark stays legible.
for (const size of [192, 512]) {
  await sharp({
    create: { width: size, height: size, channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{
      input: await sharp(dark, opts)
        .resize({ width: Math.round(size * 0.82), fit: "inside" }).png().toBuffer(),
      gravity: "center",
    }])
    .png()
    .toFile(`${OUT}/icon-${size}.png`);
}

console.log("logo variants written", info.width, "x", info.height);
