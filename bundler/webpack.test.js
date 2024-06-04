/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
// @ts-check
import { merge } from 'webpack-merge'
import ApiListItem from './base/ApiListItem.js'
import getBaseConfig from './base/getBaseConfig.js'
import useHtml from './base/plugins/useHtml.js'
import getAllUrlParams from './base/utils/getAllUrlParams.js'

const api = new ApiListItem({ includeScript: false })

const version = {
    name: 'v1',
    replacements: ['vconf1', 'vconf1'],
}
const localization = 'en'

/** @type { import('./base/types.js').IWebpackConfiguration } */
const config = {
    entry: './src/test/index.ts',
    devServer: {
        hot: true,
        open: [`/index.html${getAllUrlParams()}`],
    },
    plugins: [
        ...useHtml({
            entry: './src/template.html',
            htmlName: 'index.html',
            scriptName: 'bundle.js',
            includeScript: api.includeScript,
            title: 'TEST',
            metaTag: api.meta,
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
                            localization,
                            fontRules: {
                                'secular_one.ttf': {
                                    chars: '1234567890',
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
}

export default merge(
    getBaseConfig('development', api, localization, version),
    config,
)
