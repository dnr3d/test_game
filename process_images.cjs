const { Jimp, intToRGBA } = require('jimp');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\daniy\\.gemini\\antigravity-ide\\brain\\7aa6919a-b628-47df-94b3-dbcd59b94364';
const outDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Find files matching pattern
const files = fs.readdirSync(brainDir);
const bgFile = files.find(f => f.startsWith('bg_fantasy_') && f.endsWith('.png'));
const knightFile = files.find(f => f.startsWith('knight_') && f.endsWith('.png'));
const mageFile = files.find(f => f.startsWith('mage_') && f.endsWith('.png'));
const rangerFile = files.find(f => f.startsWith('ranger_') && f.endsWith('.png'));
const slimeFile = files.find(f => f.startsWith('slime_') && f.endsWith('.png'));

async function processImage(filename, outName, size, removeWhite) {
  if (!filename) {
    console.error(`Missing file for ${outName}`);
    return;
  }
  try {
    const imgPath = path.join(brainDir, filename);
    let img = await Jimp.read(imgPath);
    if (size) {
      img.resize({ w: size, h: size });
    }
    if (removeWhite) {
      // Remove white/light backgrounds
      img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
        const c = this.getPixelColor(x, y);
        const rgba = intToRGBA(c);
        if (rgba.r > 220 && rgba.g > 220 && rgba.b > 220) {
          this.bitmap.data[idx + 3] = 0; // set alpha to 0
        }
      });
    }
    await img.write(path.join(outDir, outName));
    console.log(`Processed ${outName}`);
  } catch(e) {
    console.error(`Error processing ${outName}:`, e);
  }
}

async function run() {
  await processImage(bgFile, 'bg.png', 256, false);
  await processImage(knightFile, 'player_sword.png', 64, true);
  await processImage(mageFile, 'player_staff.png', 64, true);
  await processImage(rangerFile, 'player_bow.png', 64, true);
  await processImage(slimeFile, 'slime.png', 64, true);
}

run();
