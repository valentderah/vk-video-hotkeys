const fs = require('fs');
const path = require('path');
const crx3 = require('crx3');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const KEY = path.join(ROOT, 'key.pem');
const RELEASE = path.join(ROOT, 'release');
const MANIFEST = path.join(DIST, 'manifest.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      out.push(fullPath);
    }
  }
  return out;
}

if (!fs.existsSync(MANIFEST)) {
  fail('Missing dist/manifest.json. Run a production build first (make build).');
}

if (!fs.existsSync(KEY)) {
  fail('Missing key.pem in repo root. Place your PEM private key there (gitignored).');
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const version = manifest.version;
if (!version || typeof version !== 'string') {
  fail('dist/manifest.json has no string "version" field.');
}

const pkgPath = path.join(ROOT, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.version && pkg.version !== version) {
    console.warn(
      `Warning: package.json version (${pkg.version}) != manifest version (${version})`
    );
  }
}

fs.mkdirSync(RELEASE, { recursive: true });

const base = `vk-video-hotkeys-${version}`;
const zipPath = path.join(RELEASE, `${base}.zip`);
const crxPath = path.join(RELEASE, `${base}.crx`);

const files = listFilesRecursive(DIST);
if (files.length < 1) {
  fail('dist/ has no files to pack.');
}

const relativeFiles = files
  .map((file) => path.relative(DIST, file))
  .sort((a, b) => {
    if (a === 'manifest.json') return -1;
    if (b === 'manifest.json') return 1;
    return a.localeCompare(b);
  });

const prevCwd = process.cwd();
process.chdir(DIST);

crx3(relativeFiles, {
  keyPath: KEY,
  zipPath,
  crxPath
})
  .then(() => {
    process.chdir(prevCwd);
    console.log(`Wrote ${path.relative(ROOT, zipPath)}`);
    console.log(`Wrote ${path.relative(ROOT, crxPath)}`);
  })
  .catch((err) => {
    process.chdir(prevCwd);
    console.error(err);
    process.exit(1);
  });
