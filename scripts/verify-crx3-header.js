const fs = require('fs');

const path = process.argv[2];
if (!path) {
  console.error('Usage: node scripts/verify-crx3-header.js <file.crx>');
  process.exit(1);
}

const fd = fs.openSync(path, 'r');
const buf = Buffer.alloc(4);
fs.readSync(fd, buf, 0, 4, 0);
fs.closeSync(fd);

const magic = buf.toString('ascii');
if (magic !== 'Cr24') {
  console.error(`Not a CRX3 file: magic="${magic}" (expected Cr24)`);
  process.exit(1);
}

console.log('CRX3 header OK (Cr24)');
