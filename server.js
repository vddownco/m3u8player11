const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.mp4': 'video/mp4'
};

// proxy remote file
function proxyRemoteFile(remotePath, res) {
  // Parse the remote URL from the path
  let remoteUrl;
  if (remotePath.startsWith('/http') || remotePath.startsWith('http')) {
    // If the path starts with /http, remove the leading slash and use it as the full URL
    remoteUrl = remotePath.substring(1);
  } else {
    console.log(`invalid remote path: ${remotePath}`);
    return;
  }
  
  console.log(`proxyRemoteFile: ${remoteUrl}`);
  
  const client = remoteUrl.startsWith('https') ? https : http;
  
  client.get(remoteUrl, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // If the remote path ends with .m3u8, we need to handle the path
    if (remotePath.endsWith('.m3u8')) {
      let body = '';
      proxyRes.setEncoding('utf8');
      
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      
      proxyRes.on('end', () => {
        // You can modify the m3u8 file content here, for example, modify the TS file path
        res.end(body);
      });
    } else {
      // For other files, directly pipe the connection
      proxyRes.pipe(res);
    }
  }).on('error', (err) => {
    console.error(`proxy request error: ${err.message}`);
    res.writeHead(500);
    res.end(`Server Error: ${err.message}`);
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  console.log(`request received: ${req.url}`);
  
  // Handle root request
  let filePath = reqUrl.pathname === '/' ? './index.html' : '.' + reqUrl.pathname;
  
  // Determine content type
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Add CORS headers to allow video playback
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Check if it's a TS file request
  if (filePath.endsWith('.ts')) {
    const tsPath = reqUrl.pathname;
    console.log(`attempting to proxy TS file: ${tsPath}`);
    proxyRemoteFile(tsPath, res);
    return;
  }
  
  // Special handling for M3U8 files
  if (filePath.endsWith('.m3u8')) {
    const m3u8Path = reqUrl.pathname;
    console.log(`attempting to proxy M3U8 file: ${m3u8Path}`);
    proxyRemoteFile(m3u8Path, res);
    return;
  }
  
  // Handle other file requests
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`file not found: ${filePath}`);
        res.writeHead(404);
        res.end('File not found');
      } else {
        console.error(`server error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      console.log(`serving: ${filePath} as ${contentType}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
  console.log(`Open your browser and visit http://localhost:${PORT}/ to view the player`);
}); 