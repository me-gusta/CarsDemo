import { Howler } from 'howler'
import AbstractApi from './AbstractApi'

declare const window: Window & typeof globalThis & {
    install?: Function,
    gameReady?: Function,
    gameRetry?: Function,
    gameEnd?: Function,

    gameStart?: Function,
    gameClose?: Function,
}

class Api extends AbstractApi {
    private isGameClosed = false

    constructor() {
        super()
        window.gameStart = this.gameStart.bind(this)
        window.gameClose = this.gameClose.bind(this)
    }

    public openApp() {
        if (window.install) window.install()
    }

    public init() {
        this.readyHandler()
    }

    public gameReady() {
        if (window.gameReady) window.gameReady()
    }

    public gameRetry() {
        // if (window.gameRetry) window.gameRetry()
    }

    public gameEnd() {
        if (window.gameEnd) window.gameEnd()
    }

    private gameStart() {
        this.emit('gamestart')
    }

    private gameClose() {
        this.isGameClosed = true
        Howler.mute(document.hidden || this.isGameClosed)

        this.emit('gameclose')
    }

    private readyHandler() {
        this._isReady = true

        this.emit('ready')

        // Resize
        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler.bind(this), false)

        // Viewable
        this.viewableHandler()
        document.addEventListener('visibilitychange', this.viewableHandler.bind(this), false)
    }

    private resizeHandler() {
        this.emit('resize', window.innerWidth, window.innerHeight)
    }

    private viewableHandler() {
        this.emit('pause', document.hidden || this.isGameClosed)
        Howler.mute(document.hidden || this.isGameClosed)
    }
}

/**
 * Mindworks by mintegral
 *
 * [Documentation](https://www.mindworks-creative.com/review/doc)
 *
 * [Testing](https://www.mindworks-creative.com/review/)
 */
const api = new Api()
export default api
