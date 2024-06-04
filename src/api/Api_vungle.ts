import { Howler } from 'howler'
import AbstractApi from './AbstractApi'

/*
 * window.parent.postMessage('download','*') - ctaClick
 * window.parent.postMessage('complete','*') - gameEnd
 * window.addEventListener('ad-event-pause', ...) - pause on
 * window.addEventListener('ad-event-resume', ...) - pause off
 */

class Api extends AbstractApi {
    public openApp() {
        window.parent.postMessage('download', '*')
    }

    public init() {
        this.readyHandler()
    }

    public gameReady() {
        this.gameStart()
    }

    public gameRetry() {}

    public gameEnd() {
        window.parent.postMessage('complete', '*')
    }

    private gameStart() {
        this.emit('gamestart')
    }

    private readyHandler() {
        this._isReady = true

        this.emit('ready')

        // Resize
        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler.bind(this), false)

        // Viewable
        window.addEventListener('ad-event-pause', () => {
            this.viewableHandler(false)
        })
        window.addEventListener('ad-event-resume', () => {
            this.viewableHandler(true)
        })
    }

    private resizeHandler() {
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
 * Vungle
 *
 * [Documentation](https://support.vungle.com/hc/en-us/articles/360057120251#download-0-0)
 *
 * [Demo repository](https://bitbucket.org/vungle_creative_labs/vcl-templates/src/master/)
 *
 * [Testing docs](https://support.vungle.com/hc/en-us/articles/4908908675355-Test-Your-Playable-Asset-With-Our-Creative-Verifier)
 */
const api = new Api()
export default api
