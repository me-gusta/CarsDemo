declare namespace GlobalMixins {
    /** список модулей */
    interface IModulesList {}
}

declare const BUILD: Readonly<{
    apiName: string,
    apiPrefix: string,
    localization: string,
    version: string,
    packageVersion: string,
}>
