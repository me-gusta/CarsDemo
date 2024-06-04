import { BaseTexture, Texture } from '@pixi/core'
import { Spritesheet } from '@pixi/spritesheet'
import { Dict } from '@pixi/utils'
import { pixiDefaultTextureAnchor } from 'src/settings'

const spritesheetParser = (textureDict: Dict<Texture> | undefined) => {
    if (textureDict) {
        const dictEntries = Object.entries(textureDict)
        dictEntries.forEach(([name, texture]) => {
            if (texture.defaultAnchor.x === 0 && texture.defaultAnchor.y === 0) {
                texture.defaultAnchor.copyFrom(pixiDefaultTextureAnchor)
            }
            AssetsStorage.addAssets(name, texture)
        })
    }
}

const animationParser = ({ animations }: Spritesheet) => {
    const animationsEntries = Object.entries(animations)
    if (animationsEntries.length > 0) {
        animationsEntries.forEach(([name, textures]) => {
            AssetsStorage.addAssets(name, textures)
        })
    }
}

const loadSpritesheet = (dataURI: string, dataObject: any) => {
    const baseTexture = new BaseTexture(dataURI)
    const spritesheet = new Spritesheet(baseTexture, dataObject)
    spritesheet.parse().then(spritesheetParser)
    animationParser(spritesheet)

    return baseTexture
}

export default loadSpritesheet
