const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function download(urlStr, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const parsedUrl = new URL(urlStr);
    const get = parsedUrl.protocol === 'https:' ? https.get : http.get;
    
    get(parsedUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, parsedUrl).href;
        file.close();
        fs.unlink(dest, () => {});
        return download(nextUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to download ${urlStr}: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${dest} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync('vendor')) fs.mkdirSync('vendor');
  
  try {
    console.log('Downloading vendor libraries...');
    await download('https://unpkg.com/react@18/umd/react.production.min.js', 'vendor/react.min.js');
    await download('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', 'vendor/react-dom.min.js');
    await download('https://unpkg.com/@babel/standalone/babel.min.js', 'vendor/babel.min.js');
    await download('https://cdn.tailwindcss.com', 'vendor/tailwind.js');
    console.log('All vendor libraries downloaded successfully!');
  } catch (e) {
    console.error('Download error:', e.message);
  }
}

main();
