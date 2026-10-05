const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/achievements');
const files = fs.readdirSync(dir);

async function compressAll() {
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
      const filePath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      const stats = fs.statSync(filePath);
      console.log(`Compressing ${file} (Original size: ${(stats.size / 1024).toFixed(2)} KB)...`);
      
      try {
        await sharp(filePath)
          .resize({ width: 800, withoutEnlargement: true }) // resize to a sensible max width for cards
          .jpeg({ quality: 75, progressive: true })
          .toFile(tempPath);
          
        fs.renameSync(tempPath, filePath);
        
        const newStats = fs.statSync(filePath);
        console.log(`Done ${file} (New size: ${(newStats.size / 1024).toFixed(2)} KB)`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

compressAll();
