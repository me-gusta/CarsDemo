import { Container } from '@pixi/display'
import { IScene2d } from './applications/2d/App2d'
import { colors } from './settings'
import { createSprite, defaultFuncSetParams, defaultParams } from './utils/Utility'
import { getParkingDimentions, findIntersections, calculateDistance } from './playable/math'
import Blowfish from 'blowfish-resizer'
import { Sprite } from '@pixi/sprite'
import { range } from './playable/lib/utils'
import { createSpriteParkingLine, createSpriteParkingSymbol } from './playable/createSprites'
import DrawingSystem from './playable/systems/DrawingSystem'
import ContainerChain from './playable/lib/ContainerChain'
import CarSystem from './playable/systems/CarSystem'
import { EventEmitter } from '@pixi/utils'
import LayerEnd from './playable/layers/LayerEnd'
import ContainerBgColor from './playable/ContainerBgColor'
import { editorConfFloat } from './playable/editorConf'
import Hint from './hint/Hint'
import Hand from './playable/Hand'
import Audio from 'src/core/Audio'
import FSM from './playable/lib/FSM'

export default class Scene2d extends Container implements IScene2d {
    private blowfish?: Blowfish

    private bg = new ContainerBgColor(colors.background)
    private carYellow: Sprite
    private carRed: Sprite
    private carGreen: Sprite
    private carBlue: Sprite
    private parkingLines: Container[]

    private parkingSymbolRed: Sprite
    private parkingSymbolYellow: Sprite

    private drawingSystemRed: DrawingSystem
    private drawingSystemYellow: DrawingSystem

    private layerEnd: LayerEnd

    private carSystemRed: CarSystem
    private carSystemYellow: CarSystem
    private carCrashCheckSystem = new EventEmitter()
    private interactionCheckSystem = new EventEmitter()

    private hint = new Hint(new Hand())
    private scheduleTitleScreen: number = 0

    constructor() {
        super()
        this.interactive = true

        this.addChild(this.bg)

        const layerGround = new ContainerChain()
            .addTo(this)

        const layerDeadZones = new ContainerChain().addTo(this)

        this.carYellow = createSprite('car_yellow')
        this.carYellow.anchor.set(0.5)
        this.carYellow.rotation = -Math.PI
        this.addChild(this.carYellow)

        // Sprites

        this.carRed = createSprite('car_red')
        this.carRed.anchor.set(0.5)
        this.carRed.rotation = -Math.PI
        this.addChild(this.carRed)

        this.carBlue = createSprite('car_blue')
        this.carBlue.anchor.set(0.5)
        this.addChild(this.carBlue)
        this.carGreen = createSprite('car_green')
        this.carGreen.anchor.set(0.5)
        this.addChild(this.carGreen)

        this.parkingLines = range(5).map(() => createSpriteParkingLine())
        this.parkingLines.forEach((el) => this.addChild(el))

        this.parkingSymbolRed = createSpriteParkingSymbol(colors.parking.red)
        this.addChild(this.parkingSymbolRed)

        this.parkingSymbolYellow = createSpriteParkingSymbol(colors.parking.yellow)
        this.addChild(this.parkingSymbolYellow)

        // hint
        this.addChild(
            this.hint.hand,
        )

        // Layers
        this.layerEnd = new LayerEnd().addTo(this)

        // Systems
        this.drawingSystemRed = new DrawingSystem(this, layerGround, layerDeadZones, colors.parking.red, this.carRed)
        this.drawingSystemYellow = new DrawingSystem(this, layerGround, layerDeadZones, colors.parking.yellow, this.carYellow)

        this.carSystemRed = new CarSystem(this.carRed)
        this.carSystemYellow = new CarSystem(this.carYellow)

        this.carCrashCheckSystem.once('crash', () => {
            this.carSystemRed.toStateFinished(this.carYellow.position)
            this.carSystemYellow.toStateFinished(this.carRed.position)
            this.enableFailScene()
        })

        this.interactionCheckSystem = new EventEmitter()
        this.interactionCheckSystem.once('interacted', () => {
            Time.clearTimeout(this.scheduleTitleScreen)
            this.hint.stop()
        })
        this.addListener('pointerdown', () => this.interactionCheckSystem.emit('interacted'))
    }

    public enableFailScene() {
        Time.setTimeout(() => {
            this.layerEnd.startFail()
        }, 500)
    }

    public start() {
        this.scheduleTitleScreen = Time.setTimeout(() => {
            this.hint.stop()
            this.layerEnd.startTitle()
        }, 20000)
        Audio.playMusic('bg_music', 1.0)
        this.hint
            .wait({
                object: this,
                time: 1,
            })
            .beginHand()
            .beginRepeat(Infinity)
            .move({ fromObject: this.carRed, toObject: this.parkingSymbolRed, time: 2000 })
            .endRepeat()
            .endHand()
            .start()

        const drawingSystems = [this.drawingSystemRed, this.drawingSystemYellow]

        drawingSystems.forEach((el) => el.addListener('finished', () => {
            console.log(drawingSystems.every((elem) => elem.state === 'finished'))

            // check that every DrawingSystem is in state finished
            if (!drawingSystems.every((elem) => elem.state === 'finished')) return

            const pathsWithIntersection = findIntersections(this.drawingSystemRed.points, this.drawingSystemYellow.points)

            if (!pathsWithIntersection) throw Error('Paths do not intersect')

            this.carSystemRed.toStateProcess(
                pathsWithIntersection[0].slice(1),
            )
            this.carSystemYellow.toStateProcess(
                pathsWithIntersection[1].slice(1),
            )
        }))
    }

    public update(deltaTime: number): void
    public update() {
        const distance = calculateDistance(this.carRed.position, this.carYellow.position)
        if (distance < 60) this.carCrashCheckSystem.emit('crash')
    }

    public resize(width: number, height: number): void
    public resize(width: number, height: number) {
        this.bg.resize(width, height)

        if (!(this.drawingSystemRed.state === 'finished' && this.drawingSystemYellow.state === 'finished')) {
            this.drawingSystemRed.toStateIdle()
            this.drawingSystemYellow.toStateIdle()
        }

        if (!this.blowfish) {
            const elements = {
                main: {
                    target: {},
                    params: {
                        percentMargin: editorConfFloat(),
                        percentScaleHeight: editorConfFloat(),
                        percentCarMarginBottom: editorConfFloat(),
                    },
                    fncSetParams: (target: any[], params: any, screenSize: any) => {
                        const { percentMargin, percentScaleHeight, percentCarMarginBottom } = params

                        const pxMargin = screenSize.width * percentMargin
                        const {
                            heightParking,
                            widthParkingLot,
                        } = getParkingDimentions(screenSize.width, screenSize.height, pxMargin, percentScaleHeight)

                        const parkingSpot = (n: number) => pxMargin + widthParkingLot * n
                        const parkingSpotHalf = widthParkingLot / 2

                        this.parkingLines.forEach((el, i) => {
                            el.position.x = parkingSpot(i)
                            el.position.y = heightParking - el.height
                        })

                        this.parkingSymbolRed.position.x = parkingSpot(2) + parkingSpotHalf
                        this.parkingSymbolRed.position.y = heightParking - 50

                        this.parkingSymbolYellow.position.x = parkingSpot(1) + parkingSpotHalf
                        this.parkingSymbolYellow.position.y = heightParking - 50

                        this.carRed.position.x = parkingSpot(1) + parkingSpotHalf
                        this.carRed.position.y = screenSize.height * percentCarMarginBottom

                        this.carYellow.position.x = parkingSpot(2) + parkingSpotHalf
                        this.carYellow.position.y = screenSize.height * percentCarMarginBottom

                        this.carGreen.position.x = parkingSpot(0) + parkingSpotHalf
                        this.carGreen.position.y = heightParking - 100

                        this.carBlue.position.x = parkingSpot(3) + parkingSpotHalf
                        this.carBlue.position.y = heightParking - 100

                        const cars: Sprite[] = [this.carBlue, this.carGreen, this.carYellow, this.carRed]
                        cars.forEach((el) => {
                            const widthReal = el.width / el.scale.x
                            el.scale.set((widthParkingLot * (2 / 4)) / widthReal)
                        })

                        this.drawingSystemRed.resize(
                            this.carRed.position,
                            this.parkingSymbolRed.position,
                            heightParking,
                            widthParkingLot,
                            pxMargin,
                            screenSize.width,
                            true,
                        )
                        this.drawingSystemYellow.resize(
                            this.carYellow.position,
                            this.parkingSymbolYellow.position,
                            heightParking,
                            widthParkingLot,
                            pxMargin,
                            screenSize.width,
                            false,
                        )
                    },
                },
                end: this.layerEnd.blowfishConfig(),
            }
            // eslint-disable-next-line
            const config = { main: [{ type: 'single', aspectRatio: 0.45, params: { percentMargin: 0.028, percentScaleHeight: 0.406, percentCarMarginBottom: 0.9 } }, { type: 'single', aspectRatio: 0.9993, params: { percentMargin: 0.052, percentScaleHeight: 0.222, percentCarMarginBottom: 0.85 } }, { type: 'single', aspectRatio: 2.2222, params: { percentMargin: 0.28, percentScaleHeight: 0.233, percentCarMarginBottom: 0.839 } }], end: [{ type: 'single', aspectRatio: 0.45, params: { marginGameLogo: 0.322, scaleGameLogo: 1.647, marginFail: 0.526, scaleFail: 1.526, marginBtnPlay: 0.791, scaleBtnPlay: 1.526 } }, { type: 'single', aspectRatio: 1.1634, params: { marginGameLogo: 0.3099, scaleGameLogo: 1.5258, marginFail: 0.5155, scaleFail: 1.1062, marginBtnPlay: 0.7886, scaleBtnPlay: 1.4777 } }, { type: 'single', aspectRatio: 2.2222, params: { marginGameLogo: 0.292, scaleGameLogo: 1.346, marginFail: 0.5, scaleFail: 1.226, marginBtnPlay: 0.785, scaleBtnPlay: 1.406 } }] }
            this.blowfish = new Blowfish(this.constructor.name, elements, config, defaultParams, defaultFuncSetParams)
        }
        this.blowfish.Update(width, height)

        this.hint.resize()
    }
}
