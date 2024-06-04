import { Howl } from 'howler'
import AbstractAssetsLoader from './AbstractAssetsLoader'

const loadAudio = (name: string, dataURI: string) => {
    const sound = new Howl({ src: dataURI })
    AssetsStorage.addAssets(name, sound)
    return sound
}

export default class AudioLoader extends AbstractAssetsLoader {
    public onComplete: Function | null = null

    private loadingAudiosLength = 0
    private audios: Howl[] = []

    public addAudio(name: string, dataURI: string) {
        this.audios.push(loadAudio(name, dataURI))
    }

    public init() {
        if (this.audios.length === 0) {
            this.complete()
            return
        }

        for (let i = 0; i < this.audios.length; i++) {
            if (this.audios[i].state() === 'loaded') {
                this.audios.splice(i, 1)
                i--
            } else {
                this.audios[i].once('load', () => { this.onAssetLoad() })
                this.loadingAudiosLength++
            }
        }

        if (this.loadingAudiosLength === 0) this.complete()
    }

    private onAssetLoad() {
        this.loadingAudiosLength--
        if (this.loadingAudiosLength === 0) this.complete()
    }
}
