#!/usr/bin/env node

/**
 * Development Server
 * Simple HTTP server for local development
 * Serves files from the public directory
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Serve static files
 */
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

/**
 * Request handler
 */
const server = http.createServer((req, res) => {
  // Remove query string and decode URL
  let pathname = decodeURIComponent(req.url.split('?')[0]);
  
  // Default to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Construct file path
  const filePath = path.join(PUBLIC_DIR, pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    // If it's a directory, try to serve index.html
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      serveFile(res, indexPath);
    } else {
      serveFile(res, filePath);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Development Server Started               ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`  🚀 Server running at: http://localhost:${PORT}`);
  console.log(`  📁 Serving files from: ${PUBLIC_DIR}`);
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error('   Try using a different port: PORT=3001 node scripts/dev-server.js\n');
  } else {
    console.error('\n❌ Server error:', err.message, '\n');
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server stopped. Goodbye!\n');
  process.exit(0);
});