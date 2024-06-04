import { Ticker } from '@pixi/ticker'
import { IApplicationModule } from '../applications/types'

class CallbackData<Cb extends Function> {
    public readonly data: Cb[] = []

    public add(callback: Cb) {
        this.data.push(callback)
    }

    public remove(callback: Cb) {
        const index = this.data.indexOf(callback)
        if (index !== -1) {
            this.data.splice(index, 1)
        }
    }
}

class ApplicationTicker extends Ticker {
    constructor() {
        super()
        this.maxFPS = 60
    }
}

const app = class {
    private static _modulesArray: IApplicationModule[]
    private static _modulesList: __GlobalMixins.IModulesList
    private static _screenSize = { width: 0, height: 0 }
    /** use only for api pause */
    private static isPlayed = true

    public static readonly ticker = new ApplicationTicker()
    public static readonly beforeUpdate = new CallbackData<(deltaTime: number) => void>()
    public static readonly beforeRender = new CallbackData()

    public static mount?: () => void

    public static get modules() {
        return this._modulesList
    }

    public static get screenSize(): Readonly<{ width: number, height: number }> {
        return this._screenSize
    }

    public static setModules({ modules }: { modules: __GlobalMixins.IModulesList }) {
        this._modulesList = modules
        this._modulesArray = Object.values(modules)
    }

    public static init() {
        this._modulesArray.forEach((module) => module.init())
        if (this.mount) this.mount()
    }

    public static start() {
        this._modulesArray.forEach((module) => module.start())
        this.ticker.add(this.update.bind(this))
        if (this.isPlayed) {
            this.ticker.start()
        }
    }

    public static setPause(isPaused: boolean) {
        this.isPlayed = !isPaused
        if (this.isPlayed) this.ticker.start()
        else this.ticker.stop()
    }

    public static update() {
        const deltaTime = this.ticker.deltaMS
        this.beforeUpdate.data.forEach((callback) => { callback(deltaTime) })
        this._modulesArray.forEach((module) => module.update(deltaTime))
        this.beforeRender.data.forEach((callback) => { callback() })
        this.render()
    }

    public static resize(width: number, height: number) {
        this._screenSize.width = width
        this._screenSize.height = height
        this._modulesArray.forEach((module) => module.resize(width, height))
    }

    private static render() {
        this._modulesArray.forEach((module) => module.render())
    }
}

declare global {
    interface Window { App: typeof app }
    const App: typeof app
}

window.App = app

export default {}
