import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/RAZER/Documents/casement/alam group Bussiness center";
const OUT = path.join(process.cwd(), "public", "images");

const map = {
  "7.png": "exterior-street-dusk",
  "8.png": "exterior-aerial-dusk",
  "11.png": "exterior-corner-entrance",
  "12.png": "exterior-frontage-gatehouse",
  "6.png": "atrium-reception",
  "1.png": "interior-showroom-entrance",
  "2.png": "interior-showroom-dusk",
  "3.png": "interior-showroom-meeting-suite",
  "4.png": "interior-showroom-corridor",
  "5.png": "interior-facade-display",
  "13.png": "unit-1-dealership",
  "14.png": "unit-2-electronics",
  "19.png": "unit-3-supermarket",
  "20.png": "unit-5-furniture",
  "17.png": "unit-6-appliances",
  "15.png": "unit-7-bank",
  "16.png": "unit-8-offices",
  "18.png": "concept-restaurant",
  "21.png": "concept-gym",
  "22.png": "concept-spa",
  "23.png": "concept-nightclub",
  "24.png": "concept-yoga",
};
map["4.png"] = "interior-showroom-corridor";

await mkdir(OUT, { recursive: true });

for (const [file, name] of Object.entries(map)) {
  const src = path.join(SRC, file);
  await sharp(src).resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 80 }).toFile(path.join(OUT, `${name}.webp`));
  console.log("->", name);
}

// Unit 4 (ground-floor finishes / commercial showroom) uses the aluminium finishes render
await sharp(path.join(SRC, "4.png")).resize({ width: 2000, withoutEnlargement: true })
  .webp({ quality: 80 }).toFile(path.join(OUT, "unit-4-finishes-showroom.webp"));

// Open Graph card from the hero exterior
await sharp(path.join(SRC, "7.png")).resize(1200, 630, { fit: "cover", position: "attention" })
  .webp({ quality: 82 }).toFile(path.join(OUT, "og-cover.webp"));
console.log("done");
