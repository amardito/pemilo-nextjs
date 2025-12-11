const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Copy static files if they don't exist in standalone
const standaloneDir = path.join(__dirname, '.next/standalone');
const standaloneStaticDir = path.join(standaloneDir, '.next/static');
const standalonePubicDir = path.join(standaloneDir, 'public');

const staticDir = path.join(__dirname, '.next/static');
const publicDir = path.join(__dirname, 'public');

// Create .next directory in standalone if it doesn't exist
const nextDirInStandalone = path.join(standaloneDir, '.next');
if (!fs.existsSync(nextDirInStandalone)) {
  fs.mkdirSync(nextDirInStandalone, { recursive: true });
}

// Copy static files
if (fs.existsSync(staticDir) && !fs.existsSync(standaloneStaticDir)) {
  console.log('Copying .next/static to standalone...');
  fs.cpSync(staticDir, standaloneStaticDir, { recursive: true });
}

// Copy public files
if (fs.existsSync(publicDir) && !fs.existsSync(standalonePubicDir)) {
  console.log('Copying public to standalone...');
  fs.cpSync(publicDir, standalonePubicDir, { recursive: true });
}

console.log('Starting Next.js standalone server...');
require('./.next/standalone/server.js');
