import { Howler } from 'howler'
import { apiUrl } from '../../playable.config'
import AbstractApi from './AbstractApi'

class Api extends AbstractApi {
    private isGameClosed = false

    public openApp() {
        if (window.confirm('Store')) {
            if (apiUrl.googlePlay !== '') {
                window.open(apiUrl.googlePlay, '_blank')
            }
            if (apiUrl.appStore !== '') {
                window.open(apiUrl.appStore, '_blank')
            }
        }
    }

    public init() {
        const isTimeout = Math.random() > 0.5
        if (isTimeout) {
            setTimeout(() => this.readyHandler(), Math.floor(100 + Math.random() * 900))
        } else {
            this.readyHandler()
        }
    }

    public gameReady() {
        this.gameStart()
    }

    public gameRetry() {
        // eslint-disable-next-line no-console
        console.log('Game Retry.')
    }

    public gameEnd() {
        // eslint-disable-next-line no-console
        console.log('Game End.')
        const isTimeout = Math.random() > 0.5
        if (isTimeout) {
            setTimeout(() => this.gameClose(), Math.floor(100 + Math.random() * 900))
        } else {
            this.gameClose()
        }
    }

    private gameStart() {
        this.emit('gamestart')
    }

    private gameClose() {
        this.emit('gameclose')

        this.isGameClosed = true
        Howler.mute(document.hidden || this.isGameClosed)
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
 * Development API
 * @example
 * api.once("ready", onApiReady)      // onApiReady()
 * api.once("gamestart", gameStart)   // gameStart()
 * api.on("resize", gameResize)       // gameResize(width, height)
 * api.on("pause", gameSetPause)      // gameSetPause(isPause)
 * api.init()
 *
 * function onApiReady() {
 *     if (assetsLoader.isComplete && api.isReady) {
 *         // api and game ready to start
 *         api.gameReady()
 *     }
 * }
 *
 * // click store button
 * api.openApp()
 * // gameplay complete
 * api.gameEnd()
 */
const api = new Api()
export default api
