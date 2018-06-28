node_modules/browserify/bin/cmd.js ./dist/index.js --standalone lib -o dist/main.js 
# node_modules/browserify/bin/cmd.js dist/index.js -t [ babelify --presets [ env ] ] -o dist/main.js 
size="$(cat dist/main.js  | wc -c )"
echo "bundle.js=${size}"
