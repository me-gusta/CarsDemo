/* eslint-disable import/no-extraneous-dependencies */
const Papa = require('papaparse')

/**
 * @param {string} csvString
 * @param {string} localization
 */
const parseCsvLocalization = (csvString, localization) => {
    /** @type {{ data: string[][] }} */
    const { data } = Papa.parse(csvString, { skipEmptyLines: true })

    if (data.length === 0) {
        throw new Error('Empty csv!')
    }

    const localizationIndex = data[0].findIndex((value) => (
        value.toLowerCase() === localization.toLowerCase()
    ))

    if (localizationIndex === -1) {
        throw new Error(`localization ${localization} not found.`)
    }

    /** @type {Record<string, string>} */
    const result = {}
    for (let i = 1; i < data.length; i++) {
        const key = data[i][0]
        const value = data[i][localizationIndex]
        result[key] = value
    }

    return result
}

module.exports = parseCsvLocalization
