const path = require('path');
const pathToDistfolder = path.resolve(__dirname, 'dist');
const minimizeResult = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle-file.js',
        path: pathToDistfolder
    },
    module:{
        rules: [
            {
                test: /\.js$/,  //Regular expression to inform that webpack shall get all the files that ends with .js
                exclude: /node-modules/, //Ignores all files inside the node-modules
                use: {
                    loader: 'babel-loader' //Informs how webpack shall process the file. We use babel-loader so the typescript scripts inside our project could be processed as a JS code before webpack process it and creathe the bundle file
                }
            }
        ]
    },
    optimization: {
        minimize: minimizeResult
    }
}