const path = require('path');
const pathToDistfolder = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle-file.js',
        path: pathToDistfolder
    }
}