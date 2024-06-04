import { Howler } from 'howler'
import { apiUrl } from '../../playable.config'
import AbstractApi from './AbstractApi'

declare const mraid: {
    getState: () => string,
    isViewable: () => boolean,
    addEventListener: (event: string, callback: Function) => void,
    removeEventListener: (event: string, callback: Function) => void,
    open: (url: string) => void,
}

class Api extends AbstractApi {
    private resizeTimerId = -1
    private readyHandlerRef = this.readyHandler.bind(this)

    public init() {
        if (mraid.getState() === 'loading') {
            mraid.addEventListener('ready', this.readyHandlerRef)
        } else {
            this.readyHandler()
        }
    }

    public openApp() {
        const userAgent = navigator.userAgent || navigator.vendor
        if (/android/i.test(userAgent)) {
            mraid.open(apiUrl.googlePlay)
        } else {
            mraid.open(apiUrl.appStore)
        }
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
        mraid.removeEventListener('ready', this.readyHandlerRef)

        this.emit('ready')

        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler.bind(this), false)

        this.viewableHandler(mraid.isViewable())
        mraid.addEventListener('viewableChange', this.viewableHandler.bind(this))
    }

    private resizeHandler() {
        this.resize()
        this.delayedResize()
    }

    private delayedResize() {
        if (this.resizeTimerId !== -1) {
            window.clearTimeout(this.resizeTimerId)
        }
        this.resizeTimerId = window.setTimeout(this.resize.bind(this), 200)
    }

    private resize() {
        this.emit('resize', window.innerWidth, window.innerHeight)
    }

    private viewableHandler(isViewable: boolean) {
        if (isViewable) {
            this.emit('pause', false)
            Howler.mute(false)
        } else {
            this.emit('pause', true)
            Howler.mute(true)
        }
    }
}

/**
 * Unity
 *
 * [Documentation](https://docs.unity.com/acquire/en/manual/playable-ads)
 *
 * [Best practises and guides](https://storage.googleapis.com/unity-ads-aui-prod-deployments/external-app/UnityAds_Playable_guide.pdf)
 */
const api = new Api()
export default api
