const webpack = require('webpack')
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: __dirname + '/public',
    },

    // output: {
    //     filename: 'main.js',
    //     path: __dirname + '/public'
    // }
}

