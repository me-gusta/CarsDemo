/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import { merge } from 'webpack-merge'
import getAllUrlParams from './base/utils/getAllUrlParams.js'
import { devConfig, fontRules } from '../playable.config.js'
import getBaseConfig from './base/getBaseConfig.js'
import useHtml from './base/plugins/useHtml.js'

const { currentApi, currentLocalization, currentVersion } = devConfig

/** @type { import('./base/types.js').IWebpackConfiguration } */
const config = {
    entry: './src/index.ts',
    watchOptions: {
        ignored: [
            '**/node_modules',
            '**/playable.config.js',
            '**/package.json',
        ],
    },
    devServer: {
        hot: false,
        liveReload: true,
        watchFiles: ['./assets/**/*'],
        open: [`/index.html${getAllUrlParams()}`],
    },
    plugins: [
        ...useHtml({
            entry: './src/template.html',
            htmlName: 'index.html',
            scriptName: 'bundle.js',
            includeScript: currentApi.includeScript,
            title: 'ADS',
            metaTag: currentApi.meta,
        }),
    ],
    module: {
        rules: [
            {
                // font
                test: /\.(ttf)$/i,
                use: {
                    loader: './bundler/base/loaders/fontLoader.cjs',
                    options: {
                        fontOptimizer: {
                            localization: currentLocalization,
                            fontRules,
                        },
                    },
                },
            },
        ],
    },
}

export default merge(
    getBaseConfig('development', currentApi, currentLocalization, currentVersion),
    config,
)
