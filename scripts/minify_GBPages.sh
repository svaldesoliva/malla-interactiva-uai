#!/bin/bash

# Build script for GitHub Pages deployment
# Builds the project and prepares files at root level for deployment

set -e

echo "🚀 Building for GitHub Pages deployment..."

# Run the production build
echo "📦 Running production build..."
npm run build

# Copy files from public to root for GitHub Pages
echo "📋 Copying files to root..."

# Copy index.html
cp ./public/index.html ./index.html

# Create directories at root
mkdir -p ./css
mkdir -p ./views  
mkdir -p ./data
mkdir -p ./assets
mkdir -p ./js

# Copy all necessary files
cp -r ./public/css/* ./css/
cp -r ./public/views/* ./views/
cp -r ./public/data/* ./data/
cp -r ./public/assets/* ./assets/
cp -r ./public/js/* ./js/
cp ./public/browserconfig.xml ./browserconfig.xml 2>/dev/null || true
cp ./public/site.webmanifest ./site.webmanifest 2>/dev/null || true
cp ./public/serviceWorker.js ./serviceWorker.js 2>/dev/null || true

# Create date file
echo "📅 Creating date file..."
date +"%s000" | tee date.txt
cp date.txt ./public/date.txt 2>/dev/null || true

echo "✨ GitHub Pages build complete!"
echo "📂 Deployment structure ready at root level"