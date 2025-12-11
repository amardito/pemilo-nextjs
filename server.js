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

// Set environment for standalone server
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// Start the Next.js standalone server
console.log('Starting Next.js standalone server...');
require('./.next/standalone/server.js');
