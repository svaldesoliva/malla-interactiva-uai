#!/usr/bin/env node

/**
 * Modern Build Script for Malla Interactiva UAI
 * 
 * This script handles the build process:
 * - Reads source files from src/js/
 * - Minifies and bundles them
 * - Outputs to js/ directory
 * - Ensures clean separation between source and build artifacts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const ROOT = path.resolve(__dirname, '..');
const SRC_JS = path.join(ROOT, 'src', 'js');
const SRC_CORE = path.join(SRC_JS, 'core');
const SRC_INIT = path.join(SRC_JS, 'init');
const SRC_VIEWS = path.join(ROOT, 'src', 'views');
const SRC_CSS = path.join(ROOT, 'src', 'css');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'js');
const PUBLIC_VIEWS = path.join(PUBLIC, 'views');
const PUBLIC_CSS = path.join(PUBLIC, 'css');

// Check if terser is available
function checkDependencies() {
  try {
    execSync('npx terser --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('Error: terser is not installed.');
    console.error('Run: npm install');
    process.exit(1);
  }
}

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(SRC_JS)) {
    console.error(`Error: Source directory not found: ${SRC_JS}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT)) {
    fs.mkdirSync(OUT, { recursive: true });
  }
}

// Minify JavaScript files
function minifyJS(inputFiles, outputFile, options = {}) {
  const { compress = true, mangle = true } = options;
  
  const flags = [];
  if (compress) flags.push('-c');
  if (mangle) flags.push('-m');
  
  const cmd = `npx terser ${inputFiles.join(' ')} ${flags.join(' ')} -o ${outputFile}`;
  
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (error) {
    console.error(`Error creating ${outputFile}`);
    throw error;
  }
}

// Build configurations
const BUNDLES = [
  {
    name: 'Main bundle (min1.js)',
    inputs: [
      path.join(OUT, 'init.js'),
      path.join(OUT, 'malla.js'),
      path.join(OUT, 'ramo.js')
    ],
    output: path.join(OUT, 'min1.js')
  }
];

// Main build function
function build(mode = 'development') {
  checkDependencies();
  ensureDirectories();

  // Copy/minify core files
  const mallaSrc = path.join(SRC_CORE, 'Malla.js');
  const mallaOut = path.join(OUT, 'malla.js');
  const ramoSrc = path.join(SRC_CORE, 'Ramo.js');
  const ramoOut = path.join(OUT, 'ramo.js');
  const initSrc = path.join(SRC_INIT, 'main.js');
  const initOut = path.join(OUT, 'init.js');
  
  if (mode === 'development') {
    fs.copyFileSync(mallaSrc, mallaOut);
    fs.copyFileSync(ramoSrc, ramoOut);
    fs.copyFileSync(initSrc, initOut);
  } else {
    minifyJS([mallaSrc], mallaOut);
    minifyJS([ramoSrc], ramoOut);
    minifyJS([initSrc], initOut);
  }

  // Copy views to public
  if (!fs.existsSync(PUBLIC_VIEWS)) {
    fs.mkdirSync(PUBLIC_VIEWS, { recursive: true });
  }
  const viewFiles = fs.readdirSync(SRC_VIEWS);
  viewFiles.forEach(file => {
    fs.copyFileSync(
      path.join(SRC_VIEWS, file),
      path.join(PUBLIC_VIEWS, file)
    );
  });

  // Copy CSS to public
  if (!fs.existsSync(PUBLIC_CSS)) {
    fs.mkdirSync(PUBLIC_CSS, { recursive: true });
  }
  const cssFiles = fs.readdirSync(SRC_CSS);
  cssFiles.forEach(file => {
    fs.copyFileSync(
      path.join(SRC_CSS, file),
      path.join(PUBLIC_CSS, file)
    );
  });

  // Build all bundles
  
  for (const bundle of BUNDLES) {
    // Check if all input files exist
    const missingFiles = bundle.inputs.filter(f => !fs.existsSync(f));
    if (missingFiles.length > 0) {
      console.error(`Error: Skipping ${bundle.name} - missing files: ${missingFiles.map(f => path.basename(f)).join(', ')}`);
      continue;
    }

    try {
      minifyJS(
        bundle.inputs,
        bundle.output,
        { compress: mode === 'production', mangle: mode === 'production' }
      );
    } catch (error) {
      console.error(`Error: Failed to build ${bundle.name}`);
      if (mode === 'production') {
        process.exit(1);
      }
    }
  }
}

// CLI
const args = process.argv.slice(2);
const mode = args.includes('--production') || args.includes('-p') ? 'production' : 'development';

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/build.js [options]

Options:
  --production, -p    Build for production (minified)
  --help, -h          Show this help message

Examples:
  node scripts/build.js              # Development build
  node scripts/build.js --production # Production build
  `);
  process.exit(0);
}

// Run build
try {
  build(mode);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}