import {
    Configuration,
    ProvidePlugin
} from 'webpack';

import polyp from "./plugin"

import {
    rules
} from './webpack.rules';
import { resolve } from 'path';



export const mainConfig: Configuration = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/index.ts',
    // Put your normal webpack config below here
    module: {
        rules,
    },
    plugins: [new polyp({
        css: "src\\assets\\css\\index.css",
        jsonemit: "src\\assets\\other\\css.json",
        timetochange: 2
    })],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    }
};