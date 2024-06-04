/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
const path = require('node:path')
const fs = require('node:fs')
const Fontmin = require('fontmin')
const parseCsvLocalization = require('./utils/parseCsvLocalization.cjs')

const pathToAssets = path.join(__dirname, '../../../assets/')

/** @param {Buffer} content */
function fontLoader(content) {
    const callback = this.async()

    let chars = ''

    /** @type {import('../lib/types').IFontOptimizerParams} */
    const fontOptimizer = this.getOptions().fontOptimizer

    if (fontOptimizer) {
        const fontName = path.basename(this.resourcePath)
        const rule = fontOptimizer.fontRules[fontName]

        if (rule) {
            if (rule.csv) {
                const localization = fontOptimizer.localization.toUpperCase()
                const fullCsvPath = path.resolve(pathToAssets, rule.csv)
                if (fs.existsSync(fullCsvPath)) {
                    const csvContent = fs.readFileSync(fullCsvPath, 'utf-8')
                    const res = Object.values(parseCsvLocalization(csvContent, localization))
                    res.forEach((str) => { chars += str })
                } else {
                    throw new Error(`"${rule.csv}" not found in ${pathToAssets}`)
                }
            }

            if (rule.chars) {
                chars += rule.chars
            }
        }
    }

    if (chars) {
        const fontmin = new Fontmin()
            .src(content)
            .use(Fontmin.glyph({ text: chars, hinting: false }))

        fontmin.run((err, files) => {
            if (err) callback(err)
            const [file] = files
            /** @type {Buffer} */
            const _contents = file._contents
            if (_contents.length === content.length) {
                // eslint-disable-next-line no-console
                console.warn(`\x1b[33mfile ${this.resourcePath} could not be optimized\x1b[0m`)
            }
            const string = `data:font/ttf;base64,${_contents.toString('base64')}`
            callback(null, `export default ${JSON.stringify(string)}`)
        })
    } else {
        const string = `data:font/ttf;base64,${content.toString('base64')}`
        callback(null, `export default ${JSON.stringify(string)}`)
    }
}

module.exports = fontLoader
module.exports.raw = true
