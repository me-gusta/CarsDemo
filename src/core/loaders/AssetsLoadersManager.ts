import AbstractAssetsLoader from './AbstractAssetsLoader'

export default class AssetsLoadersManager {
    private _isComplete = false
    private loaders: AbstractAssetsLoader[]
    private onComplete: Function

    constructor(loaders: AbstractAssetsLoader[], onComplete: Function) {
        this.loaders = loaders
        this.onComplete = onComplete
    }

    public get isComplete() { return this._isComplete }

    public init() {
        if (!this.loaders.length) {
            this.complete()
        } else {
            const onLoad = this.onLoad.bind(this)
            this.loaders.forEach((loader) => {
                loader.onComplete = onLoad
                loader.init()
            })
        }
    }

    private onLoad() {
        if (!this.checkLoaders()) return
        this.complete()
    }

    private complete() {
        this._isComplete = true
        this.onComplete()
        this.loaders = null!
    }

    /** true - если все loaders завершены */
    private checkLoaders() {
        return !this.loaders.find((loader) => !loader.getIsComplete())
    }
}
