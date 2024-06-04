import { Group } from 'tween-es'
import api from '../api/Api_dev'
import { AssetsLoadFunction } from './loaders/AbstractAssetsLoader'
import DocumentResizer from './DocumentResizer'
import AssetsLoadersManager from './loaders/AssetsLoadersManager'
import SafeAreaInsets from './SafeAreaInsets'

export default class Game {
    private loadingManager: AssetsLoadersManager | null = null

    public init(assetsLoadFunction: AssetsLoadFunction) {
        api.once('ready', this.onLoad, this)
            .once('gamestart', this.start, this)
            .on('pause', (isPaused: boolean) => { App.setPause(isPaused) })
            .on('resize', this.onResize, this)

        SafeAreaInsets.onChange(() => {
            this.resize(App.screenSize.width, App.screenSize.height)
        })

        this.loadingManager = new AssetsLoadersManager(
            assetsLoadFunction(),
            this.onLoad.bind(this),
        )

        api.init()
        this.loadingManager.init()
    }

    private onLoad() {
        if (api.isReady && this.loadingManager!.isComplete) {
            this.loadingManager = null!

            App.init()

            api.gameReady()
        }
    }

    private start() {
        App.beforeUpdate.add((deltaTime) => {
            Time.update(deltaTime)
            Group.shared.update(Time.time)
        })

        App.start()
        this.resize(App.screenSize.width, App.screenSize.height, true)

        DocumentResizer.resize(
            DocumentResizer.size.width,
            DocumentResizer.size.height,
        )
    }

    private onResize(width: number, height: number) {
        const isUnity = BUILD.apiPrefix === 'u'
        const saTop = isUnity ? SafeAreaInsets.top : 0
        const saRight = isUnity ? SafeAreaInsets.right : 0
        const saBottom = 0
        const saLeft = isUnity ? SafeAreaInsets.left : 0

        const croppedWidth = width - saRight - saLeft
        const croppedHeight = height - saTop - saBottom

        const root = document.getElementById('root')!
        root.style.width = `${croppedWidth}px`
        root.style.height = `${croppedHeight}px`
        document.body.style.marginTop = `${saTop}px`
        document.body.style.marginLeft = `${saLeft}px`

        this.resize(croppedWidth, croppedHeight)
        DocumentResizer.resize(width, height)
    }

    private resize(width: number, height: number, ignoreCheckSameSize = false) {
        if (width <= 0) width = 1
        if (height <= 0) height = 1

        const maxAspectRatio = 20 / 9
        if (width / height > maxAspectRatio) {
            width = height * maxAspectRatio
        } else
        if (height / width > maxAspectRatio) {
            height = width * maxAspectRatio
        }

        if (ignoreCheckSameSize || App.screenSize.width !== width || App.screenSize.height !== height) {
            App.resize(width, height)
        }
    }
}
