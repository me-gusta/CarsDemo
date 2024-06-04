/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import useReplacment from './useReplacment.js'

/**
 * @param {string[][]} replacements
 * @returns {import('webpack').NormalModuleReplacementPlugin[]}
 */
const useReplacments = (replacements) => {
    /** @type {import('webpack').NormalModuleReplacementPlugin[]} */
    const plugins = []
    replacements.forEach((replacement) => {
        plugins.push(
            useReplacment(replacement[0], replacement[1]),
        )
    })
    return plugins
}

export default useReplacments
