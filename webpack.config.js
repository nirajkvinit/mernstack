const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['./src/App.jsx'],
        vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-router', 'react-router-bootstrap'],
    },
    output: {
        path: `${__dirname}./static`,
        filename: 'app.bundle.js',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    ],
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                },
            },
        ],
    },
    devServer: {
        port: 8000,
        contentBase: 'static',
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
            },
        },
        historyApiFallback: true,
    },
};
