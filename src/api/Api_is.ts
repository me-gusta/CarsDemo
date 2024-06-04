import { Howler } from 'howler'
import AbstractApi from './AbstractApi'

declare const dapi: {
    isReady: () => boolean,
    isViewable: () => boolean,
    getAudioVolume: () => number,
    getScreenSize: () => { width: number, height: number },
    addEventListener: (event: string, callback: Function) => void,
    removeEventListener: (event: string, callback: Function) => void,
    openStoreUrl: () => void,
}

class Api extends AbstractApi {
    private readyHandlerRef = this.readyHandler.bind(this)

    public init() {
        if (dapi.isReady()) {
            this.readyHandler()
        } else {
            dapi.addEventListener('ready', this.readyHandlerRef)
        }
    }

    public openApp() {
        dapi.openStoreUrl()
    }

    public gameReady() {
        this.gameStart()
    }

    public gameRetry() {}

    public gameEnd() {}

    private gameStart() {
        this.emit('gamestart')
    }

    private readyHandler() {
        this._isReady = true
        dapi.removeEventListener('ready', this.readyHandlerRef)

        this.emit('ready')

        this.resizeHandler(dapi.getScreenSize())
        dapi.addEventListener('adResized', this.resizeHandler.bind(this))

        this.viewableHandler({ isViewable: dapi.isViewable() })
        dapi.addEventListener('viewableChange', this.viewableHandler.bind(this))

        this.audioVolumeHandler(dapi.getAudioVolume())
        dapi.addEventListener('audioVolumeChange', this.audioVolumeHandler.bind(this))
    }

    private resizeHandler(event: { width: number, height: number }) {
        if (event.width <= 0 || event.height <= 0) {
            this.emit('resize', 1, 1)
        } else {
            this.emit('resize', event.width, event.height)
        }
    }

    private viewableHandler(event: { isViewable: boolean }) {
        if (event.isViewable) {
            this.emit('pause', false)
            Howler.mute(false)
        } else {
            this.emit('pause', true)
            Howler.mute(true)
        }
    }

    private audioVolumeHandler(volume: number) {
        const isAudioEnabled = !!volume
        if (isAudioEnabled) {
            Howler.mute(false)
        } else {
            Howler.mute(true)
        }
    }
}

// TODO найти актуальную документицию ironSource
/**
 * ironSource
 */
const api = new Api()
export default api
