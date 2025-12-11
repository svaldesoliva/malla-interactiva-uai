#!/bin/bash


npx terser js/init.js ./js/malla.js ./js/ramo.js -c -m -o ./js/min1.js
echo ./js/min1.js



# moves assets to root
cp ./assets/* ./