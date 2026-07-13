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
if git log -1 > /dev/null 2>&1; then
    echo "$(git log -1 --format="%ct")000" > ./dist/date.txt
    git log -1 --format="%s" >> ./dist/date.txt
else
    echo "$(date +"%s000")" > ./dist/date.txt
    echo "Local Build" >> ./dist/date.txt
fi

echo "GitHub Pages build complete!"
echo "Deployment structure ready in ./dist/"