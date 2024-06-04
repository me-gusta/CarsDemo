/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import fs from 'fs'
import archiver from 'archiver'

/**
 * @param {string} mainPath
 * @param {string} htmlFileName
 * @param {string[]} aditionalFiles
 */
const packZip = (mainPath, htmlFileName, aditionalFiles) => {
    const archivName = `${htmlFileName.replace(/\.\w+$/, '')}.zip`
    const output = fs.createWriteStream(`${mainPath}/dist/${archivName}`)
    const archive = archiver('zip', { zlib: { level: 1 } })
    archive.pipe(output)

    const archivFiles = [htmlFileName, ...aditionalFiles]

    output.on('finish', () => {
        archivFiles.forEach((archivFile) => {
            const filePath = `${mainPath}/dist/${archivFile}`
            fs.unlinkSync(filePath)
        })
    })

    archivFiles.forEach((archivFile, i) => {
        const filePath = `${mainPath}/dist/${archivFile}`
        const name = (i === 0) ? 'index.html' : archivFile
        archive.append(fs.createReadStream(filePath), { name })
    })
    archive.finalize()
}

export default packZip
