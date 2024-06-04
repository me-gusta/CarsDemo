// @ts-check
import fs from 'fs'
import path from 'path'

/**
 * @param {string} mainPath
 * @param {string} dataHtml
 * @param {string} scriptFile
 */
const ReplaceApiScript = (mainPath, dataHtml, scriptFile) => {
    if (scriptFile !== undefined && scriptFile !== '') {
        const PATH_TO_API_SCRIPTS = path.resolve(mainPath, './bundler/api-scripts')
        const pathToScript = path.resolve(PATH_TO_API_SCRIPTS, `./${scriptFile}`)
        const scriptStringInFile = fs.readFileSync(pathToScript, 'utf8')
        dataHtml = dataHtml.replace('<!--api-->', scriptStringInFile)
    } else {
        dataHtml = dataHtml.replace('<!--api-->', '')
    }
    return dataHtml
}

export default ReplaceApiScript
