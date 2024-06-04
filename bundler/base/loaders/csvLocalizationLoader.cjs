/* eslint-disable import/no-extraneous-dependencies */
const parseCsvLocalization = require('./utils/parseCsvLocalization.cjs')

/**
 * @param {string} text
 */
function csvLocalizationLoader(text) {
    const [{ options }] = this.loaders
    const localization = options.localization.toUpperCase()
    const result = parseCsvLocalization(text, localization)
    if (this.cacheable) this.cacheable()
    return `export default ${JSON.stringify(result)}`
}

module.exports = csvLocalizationLoader
