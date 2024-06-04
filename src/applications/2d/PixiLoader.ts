import { BaseTexture } from '@pixi/core'
import AbstractAssetsLoader from 'src/core/loaders/AbstractAssetsLoader'

export default class PixiLoader extends AbstractAssetsLoader {
    private textures: BaseTexture[] = []
    private timerId = -1

    public init() {
        if (this.textures.length === 0) {
            this.complete()
        } else {
            this.timerId = window.setInterval(this.checkLoad.bind(this), 1000 / 60)
        }
    }

    public addTexture(texture: BaseTexture) {
        this.textures.push(texture)
    }

    private onAssetsLoaded() {
        if (this.textures.length === 0) {
            clearInterval(this.timerId)
            this.complete()
        }
    }

    private checkLoad() {
        for (let i = this.textures.length - 1; i >= 0; i--) {
            if (this.textures[i].valid) {
                this.textures.splice(i, 1)
                this.onAssetsLoaded()
            }
        }
    }
}
