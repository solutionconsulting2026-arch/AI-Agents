const fs = require('fs');
const path = require('path');

const outDir = path.join('.vercel', 'output', 'static');
fs.mkdirSync(outDir, { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy all static web assets to .vercel/output/static
const items = [
  'index.html',
  'casa_scrutiny_wireframe.html',
  'vendor',
  'dist',
  'src',
  'reference',
  'README.md',
  '.nojekyll'
];

for (const item of items) {
  copyRecursive(item, path.join(outDir, item));
}

// Write Vercel Build Output API v3 config
const configPath = path.join('.vercel', 'output', 'config.json');
fs.writeFileSync(configPath, JSON.stringify({ version: 3 }, null, 2), 'utf8');

console.log('✓ Successfully generated Vercel Build Output API v3 (.vercel/output/static)!');
