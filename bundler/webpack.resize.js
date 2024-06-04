/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import path from 'path'
import { fileURLToPath } from 'url'
import exportsList from './webpack.dev.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.resolve(__dirname, '../node_modules/blowfish-resizer/lib/editor')

/** @type { import('./base/types.js').IWebpackConfiguration } */
exportsList.devServer = {
    static: distPath,
    open: './blowfish-resizer-editor.html',
    hot: false,
    liveReload: false,
}

export default exportsList
