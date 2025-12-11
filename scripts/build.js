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
const SRC = path.join(ROOT, 'src', 'js');
const OUT = path.join(ROOT, 'js');

// Check if terser is available
function checkDependencies() {
  try {
    execSync('npx terser --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ Error: terser is not installed.');
    console.error('Run: npm install');
    process.exit(1);
  }
}

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(SRC)) {
    console.error(`❌ Error: Source directory not found: ${SRC}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT)) {
    fs.mkdirSync(OUT, { recursive: true });
  }
}

// Minify JavaScript files
function minifyJS(inputFiles, outputFile, options = {}) {
  const { compress = true, mangle = true } = options;
  
  console.log(`📦 Bundling: ${outputFile}`);
  
  const flags = [];
  if (compress) flags.push('-c');
  if (mangle) flags.push('-m');
  
  const cmd = `npx terser ${inputFiles.join(' ')} ${flags.join(' ')} -o ${outputFile}`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Created: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error creating ${outputFile}`);
    throw error;
  }
}

// Build configurations
const BUNDLES = [
  {
    name: 'Main bundle (min1.js)',
    inputs: [
      path.join(SRC, 'init.js'),
      path.join(OUT, 'malla.js'),
      path.join(OUT, 'ramo.js')
    ],
    output: path.join(OUT, 'min1.js')
  },
  {
    name: 'Prioridad bundle (min2.js)',
    inputs: [
      path.join(SRC, 'init.js'),
      path.join(OUT, 'malla.js'),
      path.join(OUT, 'ramo.js'),
      path.join(OUT, 'selectableRamo.js'),
      path.join(OUT, 'semesterManager.js'),
      path.join(OUT, 'priorix.js'),
      path.join(OUT, 'mallaEditor.js')
    ],
    output: path.join(OUT, 'min2.js')
  },
  {
    name: 'Generator bundle (min3.js)',
    inputs: [
      path.join(SRC, 'init.js'),
      path.join(OUT, 'malla.js'),
      path.join(OUT, 'ramo.js'),
      path.join(OUT, 'selectableRamo.js'),
      path.join(OUT, 'semesterManager.js'),
      path.join(OUT, 'generator.js'),
      path.join(OUT, 'mallaEditor.js')
    ],
    output: path.join(OUT, 'min3.js')
  },
  {
    name: 'Custom Malla bundle (min4.js)',
    inputs: [
      path.join(SRC, 'init.js'),
      path.join(OUT, 'malla.js'),
      path.join(OUT, 'ramo.js'),
      path.join(OUT, 'customMalla.js')
    ],
    output: path.join(OUT, 'min4.js')
  }
];

// Main build function
function build(mode = 'development') {
  console.log('\n🚀 Starting build process...');
  console.log(`📂 Source: ${SRC}`);
  console.log(`📂 Output: ${OUT}`);
  console.log(`🔧 Mode: ${mode}\n`);

  checkDependencies();
  ensureDirectories();

  // First, copy init.js from source to output (for development)
  const initSrc = path.join(SRC, 'init.js');
  const initOut = path.join(OUT, 'init.js');
  
  if (mode === 'development') {
    console.log('📋 Copying init.js for development...');
    fs.copyFileSync(initSrc, initOut);
    console.log('✅ init.js copied (unminified)\n');
  } else {
    console.log('🗜️  Minifying init.js for production...');
    minifyJS([initSrc], initOut);
    console.log('');
  }

  // Build all bundles
  console.log('📦 Building bundles...\n');
  
  for (const bundle of BUNDLES) {
    // Check if all input files exist
    const missingFiles = bundle.inputs.filter(f => !fs.existsSync(f));
    if (missingFiles.length > 0) {
      console.warn(`⚠️  Skipping ${bundle.name}: Missing files:`);
      missingFiles.forEach(f => console.warn(`   - ${path.basename(f)}`));
      continue;
    }

    try {
      minifyJS(
        bundle.inputs,
        bundle.output,
        { compress: mode === 'production', mangle: mode === 'production' }
      );
    } catch (error) {
      console.error(`❌ Failed to build ${bundle.name}`);
      if (mode === 'production') {
        process.exit(1);
      }
    }
  }

  console.log('\n✨ Build complete!\n');
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
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}