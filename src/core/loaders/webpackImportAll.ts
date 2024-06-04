// TODO написать нормальную регулярку

export interface IFileDataElement {
    name: string
    uri: string
}

const extractFileNameRegExp = /[^\\/]+\.[^\\/]+$/
const replaceExtensionRegExp = /\.\w+$/

const extractAssetName = (fileName: string) => {
    const fileNameWithExtention = fileName.match(extractFileNameRegExp)
    if (fileNameWithExtention) {
        return fileNameWithExtention[0].replace(replaceExtensionRegExp, '')
    }

    throw new Error(`${fileName} is invalid file name`)
}

/**
 * @example
 * importAll(require.context('../assets/seq', false, /\.(jpg)$/))
 */
const webpackImportAll = (webpackRequireContext: __WebpackModuleApi.RequireContext) => {
    const filesData: IFileDataElement[] = []
    webpackRequireContext.keys().forEach((fileName) => {
        const name = extractAssetName(fileName)
        filesData.push({ name, uri: webpackRequireContext(fileName) })
    })
    return filesData
}

export default webpackImportAll
