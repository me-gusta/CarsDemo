/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import webpack from 'webpack'
import path from 'path'
import useReplacment from './plugins/useReplacment.js'
import addReplacements from './plugins/useReplacments.js'

import packageJson from '../../package.json' assert { type: 'json' }

// TODO fix version any

/**
 * @param { 'development' | 'production' } mode
 * @param { import('./ApiListItem.js').default } apiListItem
 * @param { string } localization
 * @param { any } version
 */
const getBaseConfig = (mode, apiListItem, localization, version) => {
    const CWD = process.cwd();

    /** @type { import('./types.js').IBuildData } */
    const buildData = {
        apiName: apiListItem.apiName,
        apiPrefix: apiListItem.prefix,
        localization,
        version: version.name,
        packageVersion: packageJson.version,
    }

    /** @type { import('./types.js').IWebpackConfiguration } */
    const baseConfig = {
        mode,
        devtool: mode === 'development' ? 'inline-source-map' : false,
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                src: path.resolve(CWD, './src/'),
                assets: path.resolve(CWD, './assets/'),
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                BUILD: JSON.stringify(buildData),
            }),
            useReplacment('dev', apiListItem.apiName),
            useReplacment('en', localization),
            // @ts-ignore
            useReplacment(...apiListItem.replacements),
            ...addReplacements(version.replacements),
        ],
        module: {
            rules: [
                { // image
                    test: /\.(png|jpe?g|webp)$/i,
                    type: 'asset/inline',
                },
                { // audio
                    test: /\.(mp3)$/i,
                    type: 'asset/inline',
                },
                { // any text files
                    test: /\.(fnt|atlas|glsl)$/i,
                    type: 'asset/source',
                },
                { // spine binary
                    test: /\.(skel)$/i,
                    type: 'asset/inline',
                    generator: {
                        /** @param { Buffer } content */
                        dataUrl: (content) => content.toString('base64'),
                    },
                },
                { // 3d formats
                    test: /\.(fbx|glb)$/i,
                    type: 'asset/inline',
                    generator: {
                        /** @param { Buffer } content */
                        dataUrl: (content) => `data:@file/octet-stream;base64,${content.toString('base64')}`,
                    },
                },
                {
                    test: /\.(csv)$/i,
                    use: {
                        loader: './bundler/base/loaders/csvLocalizationLoader.cjs',
                        options: { localization },
                    },
                },
            ],
        },
    }

    if (mode === 'development') {
        baseConfig.module.rules.push(
            {
                test: /\.js$/,
                resolve: { fullySpecified: false },
            },
            {
                test: /\.ts$/i,
                use: { loader: 'ts-loader', options: { onlyCompileBundledFiles: true } },
                exclude: /node_modules/,
            },
        )
    } else {
        baseConfig.module.rules.push(
            {
                test: /\.js$/,
                resolve: { fullySpecified: false },
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/i,
                use: ['babel-loader', { loader: 'ts-loader', options: { onlyCompileBundledFiles: true } }],
                exclude: /node_modules/,
            },
        )
    }

    return baseConfig
}

export default getBaseConfig
