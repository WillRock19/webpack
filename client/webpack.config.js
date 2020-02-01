const path = require('path');
const pathToDistfolder = path.resolve(__dirname, 'dist');
const minimizeResult = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle-file.js',
        path: pathToDistfolder,
        publicPath: 'dist' //Informs the public path where webpack will spit the bundle-file.js (we started to use webpack-dev-server and, without this information, it generates the bundle file on a virtually path http://localhost:8080/bundle-file.js. Now, adding this, it will put the file on http://localhost:8080/dist/bundle-file.js)
    },
    module:{
        rules: [
            {
                test: /\.js$/,  //Regular expression to inform that webpack shall get all the files that ends with .js
                exclude: /node-modules/, //Ignores all files inside the node-modules
                use: {
                    loader: 'babel-loader' //Informs how webpack shall process the file. We use babel-loader so the typescript scripts inside our project could be processed as a JS code before webpack process it and creathe the bundle file
                }
            },
            {
                test: /\.css$/, //Regular expressions to apply this rule only for files that ends with .css. Since we wanna read the .css files inside node-modules, we are not going to specify any exclude type
                loader: 'style-loader!css-loader', //This is going to apply first the css-loader, and then the style-loader (it executes from right to left). The css-loader will read the css files and transform it in JSON's properties, and the second one will take that json and convert it to an css inline to be styled on the browser
            }
        ]
    },
    optimization: {
        minimize: minimizeResult
    }
}