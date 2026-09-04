const fs = require('fs');
const path = require('path');

const babelCode = fs.readFileSync('vendor/babel.min.js', 'utf8');
const vm = require('vm');
const sandbox = {
  window: {},
  navigator: { userAgent: 'node' },
  console: console
};
sandbox.self = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(babelCode, sandbox);
const Babel = sandbox.Babel || sandbox.window.Babel;

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

const html = fs.readFileSync('index.html', 'utf8');
// Read our app source template or file
let sourceCode = fs.readFileSync('src/bundle_source.jsx', 'utf8');

// Clean up any unescaped LaTeX backslashes
sourceCode = sourceCode.replace(/\\to/g, '→');
sourceCode = sourceCode.replace(/\\times/g, '×');
sourceCode = sourceCode.replace(/\\ge/g, '≥');
sourceCode = sourceCode.replace(/\\le/g, '≤');

console.log('Compiling JSX with Babel (runtime: classic for browser script)...');
try {
  const result = Babel.transform(sourceCode, {
    presets: [
      ['react', { runtime: 'classic' }]
    ],
    plugins: []
  });

  fs.writeFileSync('dist/app.bundle.js', result.code, 'utf8');
  console.log(`Successfully compiled dist/app.bundle.js (${result.code.length} bytes)`);
} catch (err) {
  console.error('Babel transform error:', err);
  process.exit(1);
}
