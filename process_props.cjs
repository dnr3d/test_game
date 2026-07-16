const { Jimp } = require('jimp');
const fs = require('fs');

async function removeWhiteBg(inputPath, outputPath, isCircle) {
  try {
    const img = await Jimp.read(inputPath);
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    
    // Simple magic wand or chroma key for near-white
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const hex = img.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(hex);
        // If color is very light (r>230, g>230, b>230), make transparent
        if (rgba.r > 240 && rgba.g > 240 && rgba.b > 240) {
          img.setPixelColor(0x00000000, x, y);
        }
      }
    }
    
    if (isCircle) {
      const cx = w/2, cy = h/2, r = w/2 - 10;
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) > r * r) {
             img.setPixelColor(0x00000000, x, y);
          }
        }
      }
    }
    
    await img.writeAsync(outputPath);
    console.log('Processed:', outputPath);
  } catch(e) {
    console.error('Failed to process', inputPath, e);
  }
}

async function copyGrass(input, output) {
  const img = await Jimp.read(input);
  img.resize(512, 512);
  await img.writeAsync(output);
}

(async () => {
  await removeWhiteBg('C:/Users/daniy/.gemini/antigravity-ide/brain/7aa6919a-b628-47df-94b3-dbcd59b94364/rock_prop_1784202623165.png', 'public/assets/rock.png', true);
  await removeWhiteBg('C:/Users/daniy/.gemini/antigravity-ide/brain/7aa6919a-b628-47df-94b3-dbcd59b94364/crate_prop_1784202631452.png', 'public/assets/crate.png', false);
  await copyGrass('C:/Users/daniy/.gemini/antigravity-ide/brain/7aa6919a-b628-47df-94b3-dbcd59b94364/grass_bg_1784202615238.png', 'public/assets/bg.png');
})();
