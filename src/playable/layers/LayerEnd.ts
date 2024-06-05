import ContainerChain from '../lib/ContainerChain'
import { createSprite } from 'src/utils/Utility'
import ContainerBgColor from '../ContainerBgColor'
import { editorConfFloat } from '../editorConf'
import { Easing, Tween } from 'tween-es'
import { chainTweens } from '../lib/utils'
import api from 'src/api/Api_dev'
import Audio from 'src/core/Audio'

export default class LayerEnd extends ContainerChain {
    fail: ContainerChain
    blackScreen: ContainerBgColor
    gameLogo: ContainerChain
    btnPlay: ContainerChain

    constructor() {
        super()

        this.zIndex = 2

        this.fail = new ContainerChain()
            .pushChild(createSprite('fail'))
            .setAnchor(0.5)
            .setAlpha(0)
            .addTo(this)

        this.blackScreen = new ContainerBgColor(0x000000)
            .setAlpha(0.4)
            .setAlpha(0)
            .addTo(this)

        this.gameLogo = new ContainerChain()
            .pushChild(createSprite('game_logo'))
            .setAnchor(0.5)
            .setAlpha(0)
            .setPosition(100, 100)
            .addTo(this)

        this.btnPlay = new ContainerChain()
            .pushChild(createSprite('button'))
            .setInteractive()
            .setAnchor(0.5)
            .setAlpha(0)
            .addTo(this)
        this.btnPlay.addListener('pointerdown', api.openApp)

        this.visible = false
    }

    public startFail() {
        this.visible = true
        chainTweens(
            { mode: 'sequential' },
            new Tween({ alpha: 0 })
                .to({ alpha: 1 }, 1200)
                .easing(Easing.quarticOut)
                .onUpdate((object) => {
                    this.fail.alpha = object.alpha
                })
                .onComplete(() => {
                    // Audio.play()
                }),
            new Tween({ alpha: 1 })
                .to({ alpha: 0 }, 1200)
                .easing(Easing.quarticOut)
                .onUpdate((object) => {
                    this.fail.alpha = object.alpha
                })
                .onComplete(() => {
                    this.startTitle()
                })
                .delay(500),
        )
    }

    public startTitle() {
        this.visible = true
        chainTweens(
            { mode: 'parallel' },
            new Tween({ alpha: 0 })
                .to({ alpha: 0.5 }, 1200)
                .easing(Easing.quarticOut)
                .onUpdate((object) => {
                    this.blackScreen.alpha = object.alpha
                }),
            new Tween({ alpha: 0, scale: 0.8 })
                .to({ alpha: 1, scale: this.gameLogo.scale.x }, 1200)
                .easing(Easing.quarticOut)
                .onUpdate((object) => {
                    this.gameLogo.alpha = object.alpha
                    this.gameLogo.scale.set(object.scale)
                }),
            new Tween({ alpha: 0, scale: 0.6 })
                .to({ alpha: 1, scale: this.btnPlay.scale.x }, 1200)
                .easing(Easing.quarticOut)
                .onUpdate((object) => {
                    this.btnPlay.alpha = object.alpha
                    this.btnPlay.scale.set(object.scale)
                }),
        )
    }

    public blowfishConfig() {
        return {
            target: {},
            params: {
                marginGameLogo: editorConfFloat(),
                scaleGameLogo: editorConfFloat(0.5, 5),

                marginFail: editorConfFloat(),
                scaleFail: editorConfFloat(0.5, 5),

                marginBtnPlay: editorConfFloat(),
                scaleBtnPlay: editorConfFloat(0.5, 5),
            },
            fncSetParams: (target: any[], params: any, screenSize: any) => {
                const { width, height } = screenSize
                const {
                    marginGameLogo,
                    marginFail,
                    marginBtnPlay,
                    scaleGameLogo,
                    scaleFail,
                    scaleBtnPlay,
                } = params

                this.blackScreen.resize(width, height)

                this.gameLogo.x = width / 2
                this.gameLogo.y = height * marginGameLogo
                this.gameLogo.scale.set(scaleGameLogo)

                this.fail.x = width / 2
                this.fail.y = height * marginFail
                this.fail.scale.set(scaleFail)
                this.fail.scale.set(scaleFail)

                this.btnPlay.x = width / 2
                this.btnPlay.y = height * marginBtnPlay
                this.btnPlay.scale.set(scaleBtnPlay)
                this.btnPlay.scale.set(scaleBtnPlay)
            },
        }
    }
}
