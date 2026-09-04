const fs = require('fs');

const reactCode = fs.readFileSync('vendor/react.min.js', 'utf8');
const reactDomCode = fs.readFileSync('vendor/react-dom.min.js', 'utf8');
const tailwindCode = fs.readFileSync('vendor/tailwind.js', 'utf8');
const appBundleCode = fs.readFileSync('dist/app.bundle.js', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Borrower Financial Document Extraction Agent · Flow 01</title>
  
  <!-- Embedded Tailwind CSS Engine -->
  <script>${tailwindCode}</script>
  
  <!-- Embedded React 18 & ReactDOM 18 -->
  <script>${reactCode}</script>
  <script>${reactDomCode}</script>

  <script>
    if (window.tailwind) {
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
              mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
              serif: ['Georgia', 'Cambria', 'serif']
            },
            colors: {
              slate: {
                950: '#0a0f1d',
                900: '#0f172a',
                850: '#151f38',
                800: '#1e293b',
                750: '#283548'
              }
            }
          }
        }
      };
    }
  </script>

  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
      user-select: none;
      background-color: #f1f5f9;
      color: #0f172a;
    }
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(241, 245, 249, 0.6);
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    .scrollbar-dark::-webkit-scrollbar-track {
      background: #0f172a;
    }
    .scrollbar-dark::-webkit-scrollbar-thumb {
      background: #334155;
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-900">
  <div id="root"></div>

  <!-- Pre-compiled Enterprise Banking CRM Application Bundle -->
  <script>
    (function() {
      function initApp() {
        try {
          ${appBundleCode}
        } catch (err) {
          console.error("Critical render error:", err);
          document.getElementById('root').innerHTML = '<div style="padding:40px;color:red;font-family:sans-serif;"><h3>Application Load Error</h3><pre>' + err.stack + '</pre></div>';
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
      } else {
        initApp();
      }
    })();
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('Regenerated self-contained index.html with immediate bootstrap! Size: ' + htmlContent.length + ' bytes');
