"build": "babel src --out-file dist/index.cjs.js --presets=@babel/preset-env && terser dist/index.cjs.js --compress --mangle --output dist/index.cjs.min.js"
