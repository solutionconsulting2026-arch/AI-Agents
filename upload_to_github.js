const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'solutionconsulting2026-arch';
const REPO = 'AI-Agents';
const BRANCH = 'main';

// Get token from arguments or environment variable
const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.log('------------------------------------------------------------');
  console.log('GitHub Token Required to Push to: ' + OWNER + '/' + REPO);
  console.log('Usage: agy-node upload_to_github.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>');
  console.log('------------------------------------------------------------');
  process.exit(1);
}

function githubRequest(endpoint, method = 'GET', body = null, retries = 3) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'AI-Agents-Uploader',
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        ...(postData ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } : {})
      }
    };

    const attempt = (remaining) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(data);
            }
          } else {
            if (remaining > 0 && (res.statusCode >= 500 || res.statusCode === 429)) {
              setTimeout(() => attempt(remaining - 1), 1000);
            } else {
              reject(new Error(`GitHub API Error (${res.statusCode}): ${data}`));
            }
          }
        });
      });

      req.on('error', (err) => {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 1000);
        } else {
          reject(err);
        }
      });

      if (postData) req.write(postData);
      req.end();
    };

    attempt(retries);
  });
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip ignored directories, duplicate export folders, and temporary files
    if (
      file === '.git' ||
      file === 'node_modules' ||
      file === '.gemini' ||
      file === '.system_generated' ||
      file === 'scratch' ||
      file === '.vercel' ||
      file === 'GitHub_Upload_Folder'
    ) {
      continue;
    }
    if (
      file.endsWith('.log') ||
      file.startsWith('scratch_') ||
      file === 'test_net.js' ||
      file === 'verify_bundle.js' ||
      file === 'check_github_repo.js' ||
      file === 'verify_github_commits.js' ||
      file === 'AI-Agents-Repository.zip'
    ) {
      continue;
    }

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function upload() {
  try {
    console.log(`🚀 Starting push to GitHub repository: https://github.com/${OWNER}/${REPO}`);
    const files = getAllFiles('.');
    console.log(`📦 Found ${files.length} clean project files to upload.`);

    const treeItems = [];

    // Step 1: Upload Blobs with small delay between requests
    for (let i = 0; i < files.length; i++) {
      const relPath = files[i].replace(/\\/g, '/');
      const content = fs.readFileSync(files[i]);
      
      console.log(`[${i + 1}/${files.length}] Uploading blob: ${relPath}...`);
      const blobRes = await githubRequest(`/repos/${OWNER}/${REPO}/git/blobs`, 'POST', {
        content: content.toString('base64'),
        encoding: 'base64'
      });

      treeItems.push({
        path: relPath,
        mode: '100644',
        type: 'blob',
        sha: blobRes.sha
      });

      // Small throttling delay to avoid network congestion
      await new Promise(r => setTimeout(r, 100));
    }

    // Step 2: Create Tree
    console.log('🌳 Creating Git Tree with all files...');
    const treeRes = await githubRequest(`/repos/${OWNER}/${REPO}/git/trees`, 'POST', {
      tree: treeItems
    });
    console.log(`✓ Tree created. SHA: ${treeRes.sha}`);

    // Step 3: Create Commit
    console.log('📝 Creating Commit: "Fix Vercel static deployment build"...');
    const commitRes = await githubRequest(`/repos/${OWNER}/${REPO}/git/commits`, 'POST', {
      message: 'Fix Vercel static deployment build',
      tree: treeRes.sha,
      parents: []
    });
    console.log(`✓ Commit created. SHA: ${commitRes.sha}`);

    // Step 4: Create or Update Branch Ref (main)
    console.log(`🌿 Updating branch ref: refs/heads/${BRANCH}...`);
    try {
      await githubRequest(`/repos/${OWNER}/${REPO}/git/refs`, 'POST', {
        ref: `refs/heads/${BRANCH}`,
        sha: commitRes.sha
      });
      console.log(`✓ Branch ${BRANCH} created and pointed to commit!`);
    } catch (e) {
      // If ref already exists, update it
      await githubRequest(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, 'PATCH', {
        sha: commitRes.sha,
        force: true
      });
      console.log(`✓ Branch ${BRANCH} updated to latest commit!`);
    }

    console.log('------------------------------------------------------------');
    console.log('🎉 SUCCESS! Repository successfully pushed to:');
    console.log(`👉 https://github.com/${OWNER}/${REPO}`);
    console.log('------------------------------------------------------------');

  } catch (err) {
    console.error('❌ Upload Failed:', err.message);
  }
}

upload();
