// @ts-check
/* eslint-disable import/extensions */
import ApiListItem from './bundler/base/ApiListItem.js'

export const apiUrl = {
    appStore: 'https://apps.apple.com/',
    googlePlay: 'https://play.google.com/',
}

export const devConfig = {
    currentLocalization: 'en',
    currentVersion: { name: 'v1', replacements: [['vconf1', 'vconf1']] },
    currentApi: new ApiListItem({ includeScript: false }),
}

/** @type {import('./bundler/base/types').IFontOptimizerParams['fontRules']} */
export const fontRules = {}

export const prodConfig = {
    title: 'ADS',
    index: 'M001',
    localizationList: ['en'],
    versionList: [
        { name: 'v1', replacements: [['vconf1', 'vconf1']] },
    ],
    apiList: [
        new ApiListItem({ // Dev
            prefix: 'dev',
            apiName: 'dev',
        }),
        // new ApiListItem({ // Vungle
        //     prefix: 'vungle',
        //     apiName: 'vungle',
        //     packZip: true,
        // }),
        // new ApiListItem({ // Mintegral
        //     prefix: 'm',
        //     apiName: 'm',
        //     packZip: true,
        // }),
        // new ApiListItem({ // Facebook
        //     prefix: 'f',
        //     apiName: 'f',
        //     packZip: true,
        //     includeScript: false,
        // }),
        // new ApiListItem({ // moloco
        //     prefix: 'moloco',
        //     apiName: 'f',
        //     packZip: true,
        //     includeScript: false,
        // }),
        // new ApiListItem({ // myTarget
        //     prefix: 'mt',
        //     apiName: 'f',
        //     meta: '<meta name="ad.size" content="width=100%,height=100%">',
        //     packZip: true,
        // }),
        // new ApiListItem({ // Unity
        //     prefix: 'u',
        //     apiName: 'u',
        // }),
        // new ApiListItem({ // Applovin
        //     prefix: 'a',
        //     apiName: 'u',
        // }),
        // new ApiListItem({ // IronSource
        //     prefix: 'is',
        //     apiName: 'is',
        //     script: 'webpack.prod.script_is.txt',
        // }),
        // new ApiListItem({ // Google
        //     prefix: 'g',
        //     apiName: 'g',
        //     meta: '<meta name="ad.orientation" content="portrait,landscape">',
        //     script: 'webpack.prod.script_g.txt',
        //     packZip: true,
        // }),
    ],
}
