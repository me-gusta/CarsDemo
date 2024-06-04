// @ts-check
/* eslint-disable import/no-extraneous-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin'

/**
 * @param {string} template
 * @param {string} htmlName
 * @param {string} scriptName
 * @param {string} title
 * @param {string} metaTag
 * @param {boolean} includeScript
 */

/**
 * @param {{
 * entry: string,
 * htmlName: string,
 * scriptName: string,
 * title: string,
 * metaTag: string,
 * includeScript: boolean,
 * }} options
 */
const useHtml = (options) => {
    /** @type {import('webpack').WebpackPluginInstance[]} */
    const plugins = [
        new HtmlWebpackPlugin({
            template: options.entry,
            filename: options.htmlName,
            minify: false,
            inject: 'body',
            scriptLoading: 'blocking',
            ejs: {
                title: options.title,
                metaTag: options.metaTag,
            },
        }),
    ]
    if (options.includeScript) {
        plugins.push(
            new HtmlInlineScriptPlugin({
                htmlMatchPattern: [new RegExp(options.htmlName)],
                scriptMatchPattern: [new RegExp(options.scriptName)],
            }),
        )
    }

    return plugins
}

export default useHtml
