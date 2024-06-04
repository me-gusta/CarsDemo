/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import webpack from 'webpack'

/**
 * @param {string} pattern
 * @param {string} replacement
 */
const useReplacment = (pattern, replacement) => new webpack.NormalModuleReplacementPlugin(
    new RegExp(`_${pattern}($|\\.)`),
    (resource) => {
        resource.request = resource.request.replace(`_${pattern}`, `_${replacement}`)
    },
)

export default useReplacment
