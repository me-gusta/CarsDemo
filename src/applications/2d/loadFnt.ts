import { BaseTexture, Texture } from '@pixi/core'
import { BitmapFont } from '@pixi/text-bitmap'

const loadFnt = (name: string, dataURI: string, dataFnt: string) => {
    const matches = dataFnt.match(/file="(.+)"/)
    if (!matches) throw new Error('error')

    const fileName = matches[1]
    const baseTexture = new BaseTexture(dataURI)
    const bitmapFont = BitmapFont.install(dataFnt, { [fileName]: new Texture(baseTexture) })
    AssetsStorage.addAssets(name, bitmapFont)

    return baseTexture
}

export default loadFnt
