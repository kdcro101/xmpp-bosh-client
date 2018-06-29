node_modules/browserify/bin/cmd.js ./node/index.js --standalone lib |  node_modules/derequire/bin/cmd.js > ./browser/_index.js 
uglifyjs --compress --mangle toplevel ./browser/_index.js  -o ./browser/index.js
rm -rf browser/_index.js 

size="$(cat browser/index.js  | wc -c )"
echo "browser/index.js=${size}"
