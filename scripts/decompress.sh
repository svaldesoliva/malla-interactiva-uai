#!/bin/bash
set -e  # Exit on error

# Decompress .gz JavaScript files if they don't exist or are older than the .gz files

cd "$(dirname "$0")/.." || exit 1

# Enable nullglob to handle case where no .gz files exist
shopt -s nullglob

for gzfile in js/*.gz; do
    jsfile="${gzfile%.gz}"
    # Decompress if .js doesn't exist or if .gz is newer
    if [ ! -f "$jsfile" ] || [ "$gzfile" -nt "$jsfile" ]; then
        echo "Decompressing $gzfile..."
        gunzip -k -f "$gzfile"
    fi
done

echo "All JavaScript files ready."
