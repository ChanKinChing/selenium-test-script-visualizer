const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8088;
const ROOT = __dirname;

const MIME = {
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.css':'text/css',
  '.csv':'text/csv; charset=utf-8',
  '.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml',
};

function getLANIPs() {
  const ips = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404); res.end('404 Not Found');
      } else {
        res.writeHead(500); res.end('500 Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const filePath = path.join(ROOT, url);
  // Basic path traversal protection
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden');
    return;
  }
  serveFile(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  const lanIPs = getLANIPs();
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  Selenium Test Script Visualizer — LAN   ║');
  console.log(`║  Port: ${PORT}                              ║`);
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  本地: http://localhost:' + PORT + '              ║');
  for (const ip of lanIPs) {
    const url = `http://${ip}:${PORT}`;
    const padding = ' '.repeat(Math.max(0, 40 - url.length - 6));
    console.log(`║  網路: ${url}${padding}║`);
  }
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  按 Ctrl+C 停止伺服器                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n  正在停止伺服器...');
  server.close(() => {
    console.log('  伺服器已關閉');
    process.exit(0);
  });
});
