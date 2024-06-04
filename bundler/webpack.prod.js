/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import path from 'path'
import fs from 'fs'
import TerserPlugin from 'terser-webpack-plugin'
import { fileURLToPath } from 'url'
import packZip from './base/utils/packZip.js'
import replaceApiScript from './base/utils/replaceApiScript.js'
import replaceXMLHttpRequest from './base/utils/replaceXMLHttpRequest.js'
import ApiListItem from './base/ApiListItem.js'

import { fontRules, prodConfig } from '../playable.config.js'
import { merge } from 'webpack-merge'
import getBaseConfig from './base/getBaseConfig.js'
import usePostProcessing from './base/plugins/usePostProcessing.js'
import useHtml from './base/plugins/useHtml.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_PATH = path.resolve(__dirname, '..')
const DIST_PATH = path.resolve(ROOT_PATH, './dist')

const { index: playableIndex, apiList, versionList, localizationList } = prodConfig

/**
 * @param {import('./base/types.js').playableIndex} index
 * @param {ApiListItem} api
 * @param {*} version
 * @param {*} localization
 */
function createExportProd(index, api, version, localization) {
    const postName = `_${index}${api.prefix}_${version.name}_${localization}`
    const htmlName = `Playable${postName}.html`
    const scriptName = `bundle${postName}.js`

    /** @type { import('./base/types.js').IWebpackConfiguration } */
    const config = {
        entry: path.resolve(ROOT_PATH, './src/index.ts'),
        output: {
            path: DIST_PATH,
            filename: scriptName,
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({ extractComments: false })],
        },
        plugins: [
            ...useHtml({
                entry: './src/template.html',
                htmlName,
                scriptName,
                includeScript: api.includeScript,
                title: prodConfig.title,
                metaTag: api.meta,
            }),
            usePostProcessing(() => {
                {
                    const htmlPath = path.resolve(DIST_PATH, `./${htmlName}`)
                    let dataHtml = fs.readFileSync(htmlPath, 'utf8')
                    dataHtml = replaceApiScript(ROOT_PATH, dataHtml, api.script)
                    dataHtml = replaceXMLHttpRequest(dataHtml)
                    fs.writeFileSync(htmlPath, dataHtml)
                }

                if (!api.includeScript) {
                    const jsPath = path.resolve(DIST_PATH, `./${scriptName}`)
                    let dataJs = fs.readFileSync(jsPath, 'utf8')
                    dataJs = replaceXMLHttpRequest(dataJs)
                    fs.writeFileSync(jsPath, dataJs)
                }

                if (api.packZip) {
                    packZip(ROOT_PATH, htmlName, api.includeScript ? [] : [scriptName])
                }
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
                                fontRules,
                            },
                        },
                    },
                },
            ],
        },
    }

    return merge(
        getBaseConfig('production', api, localization, version),
        config,
    )
}

if (!fs.existsSync(DIST_PATH)) fs.mkdirSync(DIST_PATH)

/** @type {any[]} */
const exportsList = []
apiList.forEach((api) => {
    versionList.forEach((version) => {
        localizationList.forEach((localization) => {
            exportsList.push(createExportProd(playableIndex, api, version, localization))
        })
    })
})

export default exportsList
