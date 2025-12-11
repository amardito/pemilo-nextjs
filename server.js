const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Copy static files
const staticSource = path.join(__dirname, '.next/static');
const staticDest = path.join(__dirname, '.next/standalone/.next/static');

const publicSource = path.join(__dirname, 'public');
const publicDest = path.join(__dirname, '.next/standalone/public');

console.log('Copying .next/static to standalone...');
if (fs.existsSync(staticSource)) {
  fs.cpSync(staticSource, staticDest, { recursive: true });
  console.log('✓ Static files copied');
}

console.log('Copying public to standalone...');
if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicDest, { recursive: true });
  console.log('✓ Public files copied');
}

// Start the Next.js standalone server
console.log('Starting Next.js standalone server...');

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Set environment variables for the Next.js server
process.env.PORT = port;
process.env.HOSTNAME = hostname;

const server = spawn('node', ['.next/standalone/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname,
  }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.kill('SIGINT');
});
