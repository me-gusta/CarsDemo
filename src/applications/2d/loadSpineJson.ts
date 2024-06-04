import { BaseTexture } from '@pixi/core'
import { TextureAtlas } from '@pixi-spine/base'
import { AtlasAttachmentLoader, SkeletonJson } from '@pixi-spine/runtime-4.1'

export const loadSpineJson = (name: string, dataURI: string, dataJson: NonNullable<object>, atlas: string) => {
    const baseTexture = new BaseTexture(dataURI)
    const spineTextureAtlas = new TextureAtlas(atlas, (line, callback) => { callback(baseTexture) })
    const spineAtlasAttachmentLoader = new AtlasAttachmentLoader(spineTextureAtlas)
    const spineSkeletonJson = new SkeletonJson(spineAtlasAttachmentLoader)
    const spineData = spineSkeletonJson.readSkeletonData(dataJson)
    AssetsStorage.addAssets(name, spineData)
    return baseTexture
}

export default loadSpineJson
