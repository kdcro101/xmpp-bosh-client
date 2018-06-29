node_modules/browserify/bin/cmd.js node/index.js -t [ babelify --presets [ env ] ] -o browser-bundle/_index.js 
uglifyjs --compress --mangle toplevel browser-bundle/_index.js   -o browser-bundle/index.js
rm -rf browser-bundle/_index.js 
size="$(cat browser-bundle/index.js  | wc -c )"
echo "browser-bundle/index.js=${size}"
