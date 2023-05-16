import type {
    Configuration
} from 'webpack';
//import CopyWebpackPlugin from "copy-webpack-plugin"
//import * as path from "path"

import {
    rules
} from './webpack.rules';
import {
    plugins
} from './webpack.plugins';

/*
const assets = ['data', 'images'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'src', asset),
      to: asset
    }
  ]);
});
*/


rules.push({
    test: /\.css$/,
    use: [{
        loader: 'style-loader'
    }, {
        loader: 'css-loader'
    }],
});

export const rendererConfig: Configuration = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        fallback: {
            path: require.resolve("path-browserify")
        }
    }
};