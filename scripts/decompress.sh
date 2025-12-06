#!/bin/bash
# Decompress .gz JavaScript files if they don't exist or are older than the .gz files

cd "$(dirname "$0")/.." || exit 1

for gzfile in js/*.gz; do
    if [ -f "$gzfile" ]; then
        jsfile="${gzfile%.gz}"
        # Decompress if .js doesn't exist or if .gz is newer
        if [ ! -f "$jsfile" ] || [ "$gzfile" -nt "$jsfile" ]; then
            echo "Decompressing $gzfile..."
            gunzip -k -f "$gzfile"
        fi
    fi
done

echo "All JavaScript files ready."
