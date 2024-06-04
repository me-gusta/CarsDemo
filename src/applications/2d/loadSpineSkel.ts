import { BaseTexture } from '@pixi/core'
import { TextureAtlas } from '@pixi-spine/base'
import { AtlasAttachmentLoader, SkeletonBinary } from '@pixi-spine/runtime-4.1'
import { toUint8Array } from 'src/utils/base64utils'

export const loadSpineSkel = (name: string, dataURI: string, dataSkel: any, atlas: string) => {
    const baseTexture = new BaseTexture(dataURI)
    const spineTextureAtlas = new TextureAtlas(atlas, (textureName, callback) => {
        callback(baseTexture)
    })
    const spineSkeletonBinary = new SkeletonBinary(new AtlasAttachmentLoader(spineTextureAtlas))
    const spineData = spineSkeletonBinary.readSkeletonData(toUint8Array(dataSkel))

    AssetsStorage.addAssets(name, spineData)

    return baseTexture
}

export default loadSpineSkel
