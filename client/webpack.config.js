const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // used instead of 'extract-text-webpack-plugin' (see the reason in: https://github.com/webpack-contrib/extract-text-webpack-plugin). It is going to be used 'cause we need to spit the css inside a <style> tag (before this congfiguration, the CSS was beeing put inside the HTML by the JScript, and that was generating a little delay where the user could see the site without the styles and only then with loaded then - it's an effect called FOUC, wich means Flash Of Unstyled Content). We want to load the style inside the <link> to use the optimizations to load the CSS that the browser has.
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // Plugin added to make a minify file with the bootstrap´css that webpack will manage
const webpack = require("webpack");

const pathToDistfolder = path.resolve(__dirname, "dist");
const isProductionEnvironment = process.env.NODE_ENV === "production";

let plugins = [];

plugins.push(new MiniCssExtractPlugin({ filename: "styles.css" }));
plugins.push(
  new webpack.ProvidePlugin({
    //This will provide the Jquery variables '$' and 'jQuery' as global to every js file that will be aggregated in the bundle
    $: "jquery/dist/jquery.js",
    jQuery: "jquery/dist/jquery.js",
  })
);

if (isProductionEnvironment) {
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin()); // This is a option that helps to optimize the bundle generation. As the explanation in class: "Cada módulo do nosso bundle é envolvido por um wrapper, que resumidamente se trata de uma função. Contudo, a existência desses wrappers tornam a execução do script um pouco mais lenta no navegador. Existe uma técnica chamada Scope Hosting, que consiste em concatenar o escopo de todos os módulos em um único wrapper, permitindo assim que nosso código seja executado mais rapidamente no navegador."
  plugins.push(new OptimizeCSSAssetsPlugin({}));
}

module.exports = {
  entry: {
    app: "./app-src/app.js",
    vendor: ["jquery", "popper.js", "bootstrap", "reflect-metadata"], //This is where we specify witch modules will be aggregated in the bundle named "external" (defined above)
  },
  // entry: './app-src/app.js',
  output: {
    filename: "bundle-file.js",
    path: pathToDistfolder,
    publicPath: "dist", //Informs the public path where webpack will spit the bundle-file.js (we started to use webpack-dev-server and, without this information, it generates the bundle file on a virtually path http://localhost:8080/bundle-file.js. Now, adding this, it will put the file on http://localhost:8080/dist/bundle-file.js)
  },
  module: {
    rules: [
      {
        test: /\.js$/, //Regular expression to inform that webpack shall get all the files that ends with .js
        exclude: /node-modules/, //Ignores all files inside the node-modules
        use: {
          loader: "babel-loader", //Informs how webpack shall process the file. We use babel-loader so the typescript scripts inside our project could be processed as a JS code before webpack process it and creathe the bundle file
        },
      },
      {
        test: /\.css$/, //Regular expressions to apply this rule only for files that ends with .css. Since we wanna read the .css files inside node-modules, we are not going to specify any exclude type
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: isProductionEnvironment,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          enforce: true,
        },
        vendor: {
          //Plugin used to create another block (chunk) of bundle.js. This one will be used so we can separate the app code from the external libraries we are using (bootstrap, Jquery, etc). In class it was used 'CommonsChunkPlugin', but it does not exist in WebPack 4+ anymore.
          chunks: "all",
          name: "vendor",
          test: /[\\/]node_modules[\\/](jquery|bootstrap|bootstrap-4-theme|popper.js|reflect-metadata)[\\/]/,
          enforce: true,
        },
      },
    },
  },
  plugins,
};
