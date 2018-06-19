node_modules/browserify/bin/cmd.js dist/index.js -t [ babelify --presets [ env ] ] -o dist/browserified.js 
uglifyjs --compress --mangle toplevel dist/browserified.js  -o dist/bundle.js
rm -rf dist/browserified.js
size="$(cat dist/bundle.js  | wc -c )"
echo "bundle.js=${size}"
