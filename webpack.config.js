const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const EXCLUDED_VENDOR_DEPENDENCIES = new Set([
    'bootstrap-sass',
    'babel-polyfill',
    'font-awesome'
]);
function getRuntimeDependencies() {
    const packageJson = require('./package.json');
    return Object.keys(packageJson.dependencies).filter(
        p => !EXCLUDED_VENDOR_DEPENDENCIES.has(p)
    );
}

module.exports = {
    entry: {
        app: 'src/'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js',
        // This is replaced by the server.js in dev
        publicPath: '/',
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            new TsConfigPathsPlugin('tsconfig.json')
        ]
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        isolatedModules: true,
                        useCache: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        // Extract css files into their own file - improved parallel loading and caching
        new ExtractTextPlugin({
            filename: '[name]-[contenthash].css',
            allChunks: true
        }),
        // Build our index.html so we don't have to keep updating it with new hashed chunks
        new HtmlWebpackPlugin({
            template: 'assets/templates/index.ejs',
            title: 'Test',
            chunksSortMode: 'dependency'
        }),
        new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/)
    ]
};
