/* eslint-disable import/no-extraneous-dependencies */
import type { Configuration as WebpackBaseConfiguration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

export type playableTitle = string
export type playableIndex = string

export type apiName = 'dev' | 'f' | 'u' | 'is' | 'g' | 'm' | 'vungle'

export interface IApiListItemOptions {
    prefix?: string,
    apiName?: apiName,
    meta?: string,
    script?: string,
    includeScript?: boolean,
    packZip?: boolean,
    replacements?: [string, string],
}

export interface IWebpackConfiguration extends WebpackBaseConfiguration {
    devServer?: DevServerConfiguration
}

export interface IBuildData {
    apiPrefix: string
    apiName: apiName
    localization: string
    version: string
    packageVersion: string
}

export interface IFontRule {
    /** path to CSV from assets folder */
    csv?: string
    chars?: string
}

export interface IFontOptimizerParams {
    localization: string
    fontRules: Record<string, IFontRule>
}
