import type {
    ForgeConfig
} from '@electron-forge/shared-types';
import {
    MakerSquirrel
} from '@electron-forge/maker-squirrel';
import {
    MakerZIP
} from '@electron-forge/maker-zip';
import {
    MakerDeb
} from '@electron-forge/maker-deb';
import {
    MakerRpm
} from '@electron-forge/maker-rpm';
import {
    WebpackPlugin
} from '@electron-forge/plugin-webpack';

import {
    mainConfig
} from './webpack.main.config';
import {
    rendererConfig
} from './webpack.renderer.config';

const config: ForgeConfig = {
    packagerConfig: {
        icon: '.\\src\\assets\\images\\logo256',
        name: "Shark Panel"
    },
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [{
                    html: './src/index.html',
                    js: './src/renderer.ts',
                    name: 'main_window',
                    preload: {
                        js: './src/preload.ts',
                    },
                }, ],

            },
            devContentSecurityPolicy: "default-src * https: blob: 'unsafe-eval' 'unsafe-inline' data:;"
        }),
    ],
};

export default config;