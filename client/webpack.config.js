const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin'); //We had to use a beta version so we could deal with an exception - to fix the issue, we followed the post: https://stackoverflow.com/questions/51383618/chunk-entrypoints-use-chunks-groupsiterable-and-filter-by-instanceof-entrypoint

const pathToDistfolder = path.resolve(__dirname, 'dist');
const minimizeResult = process.env.NODE_ENV === 'production';

let plugins = [];
plugins.push(new extractTextPlugin("style.css")); //This plugin is going to be used 'cause we need to spit the css inside a <style> tag (before this congfiguration, the CSS was beeing put inside the HTML by the JScript, and that was generating a little delay where the user could see the site without the styles and only then with loaded then - it's an effect called FOUC, wich means Flash Of Unstyled Content). We want to load the style inside the <link> to use the optimizations to load the CSS that the browser has.

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
                use: extractTextPlugin.extract({
                    fallback: 'style-loader', //It is going to use this loader in caso of fails
                    use: 'css-loader' //It's going yo use this loader by default
                })
            }
        ]
    },
    optimization: {
        minimize: minimizeResult
    },
    plugins
}