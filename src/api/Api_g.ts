import { Howler } from 'howler'
import AbstractApi from './AbstractApi'

declare const ExitApi: { exit: () => void }

class Api extends AbstractApi {
    public init() {
        this.readyHandler()
    }

    public openApp() {
        ExitApi.exit()
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

        this.emit('ready')

        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler.bind(this), false)

        this.viewableHandler()
        document.addEventListener('visibilitychange', this.viewableHandler.bind(this), false)
    }

    private resizeHandler() {
        const width = window.innerWidth
        const height = window.innerHeight
        this.emit('resize', width, height)
    }

    private viewableHandler() {
        this.emit('pause', document.hidden)
        Howler.mute(document.hidden)
    }
}

/**
 * Google
 *
 * [Documentation](https://support.google.com/google-ads/answer/9981650?hl=ru)
 *
 * [Validator](https://h5validator.appspot.com/adwords/asset)
 */
const api = new Api()
export default api
