import { BaseTexture, Texture } from '@pixi/core'
import { pixiDefaultTextureAnchor } from 'src/settings'

export const loadImage = (name: string, dataURI: string) => {
    const baseTexture = new BaseTexture(dataURI)
    AssetsStorage.addAssets(name, new Texture(
        baseTexture, /* baseTexture */
        undefined, /* frame */
        undefined, /* orig */
        undefined, /* trim */
        undefined, /* rotate */
        pixiDefaultTextureAnchor, /* anchor */
    ))
    return baseTexture
}

export default loadImage
