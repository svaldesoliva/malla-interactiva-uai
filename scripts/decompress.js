#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const projectRoot = path.resolve(__dirname, '..');
const jsDir = path.join(projectRoot, 'js');

// Find all .gz files in js directory
const gzFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js.gz'));

if (gzFiles.length === 0) {
  console.log('No .gz files found to decompress.');
  process.exit(0);
}

let decompressed = 0;
gzFiles.forEach(gzFile => {
  const gzPath = path.join(jsDir, gzFile);
  const jsPath = path.join(jsDir, gzFile.replace('.gz', ''));
  
  // Check if decompressed file exists and is newer
  if (fs.existsSync(jsPath)) {
    const gzStat = fs.statSync(gzPath);
    const jsStat = fs.statSync(jsPath);
    if (jsStat.mtime >= gzStat.mtime && jsStat.size > 0) {
      return; // Skip if already decompressed and up-to-date
    }
  }
  
  console.log(`Decompressing ${gzFile}...`);
  
  try {
    const compressed = fs.readFileSync(gzPath);
    const decompressedData = zlib.gunzipSync(compressed);
    fs.writeFileSync(jsPath, decompressedData);
    decompressed++;
  } catch (error) {
    console.error(`Error decompressing ${gzFile}:`, error.message);
    process.exit(1);
  }
});

if (decompressed === 0) {
  console.log('All JavaScript files are already up-to-date.');
} else {
  console.log(`Decompressed ${decompressed} file(s). All JavaScript files ready.`);
}
