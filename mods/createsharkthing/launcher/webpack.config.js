const path = require('path');

module.exports = {
    entry: './assets/js/index.js', // We wants our entry point to this path
    output: {
        path: path.join(__dirname, "assets/bundle/"),
        filename: 'assetbundle.js'
    },
    module: {
        rules: [{
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: "defaults"
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    }
};