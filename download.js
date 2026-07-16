const fs = require('fs');
const https = require('https');
const path = require('path');

const files = {
  'player.png': 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/dude.png',
  'enemy.png': 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/baddie.png',
  'gem.png': 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/diamond.png'
};

for (const [filename, url] of Object.entries(files)) {
  const dest = path.join(__dirname, 'public', 'assets', filename);
  https.get(url, (res) => {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
}
