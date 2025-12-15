#!/bin/bash

# Build script for GitHub Pages deployment
# Builds the project and prepares files in dist/ folder for deployment

set -e

echo "Building for GitHub Pages deployment..."

# Clean dist directory if it exists
if [ -d "./dist" ]; then
    echo "Cleaning existing dist directory..."
    rm -rf ./dist
fi

# Run the production build
echo "Running production build..."
npm run build

# Create dist directory
echo "Creating dist directory..."
mkdir -p ./dist

# Copy all files from public to dist (excluding .DS_Store)
echo "Copying built files to dist/..."
rsync -av --exclude='.DS_Store' ./public/ ./dist/

# Create date file
echo "Creating date file..."
date +"%s000" | tee ./dist/date.txt

echo "GitHub Pages build complete!"
echo "Deployment structure ready in ./dist/"