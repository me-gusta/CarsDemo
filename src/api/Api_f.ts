import { Howler } from 'howler'
import AbstractApi from './AbstractApi'

declare const FbPlayableAd: { onCTAClick: () => void }

class Api extends AbstractApi {
    public init() {
        this.readyHandler()
    }

    public openApp() {
        FbPlayableAd.onCTAClick()
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
        this.emit('resize', window.innerWidth, window.innerHeight)
    }

    private viewableHandler() {
        this.emit('pause', document.hidden)
        Howler.mute(document.hidden)
    }
}

/**
 * Facebook
 *
 * [Documentation](https://developers.facebook.com/docs/app-ads/formats/playable-ad/)
 *
 * [Documentation](https://www.facebook.com/business/help/412951382532338) (нужен аккаунт в Facebook)
 */
const api = new Api()
export default api
