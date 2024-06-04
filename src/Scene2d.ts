import { Container } from '@pixi/display'
import { Text } from '@pixi/text'
import { IScene2d } from './applications/2d/App2d'
import { Graphics } from '@pixi/graphics'
import { colors } from './settings'
import { createSprite, defaultFuncSetParams, defaultParams } from './utils/Utility'
import { getParkingDimentions, findIntersections, calculateDistance } from './playable/math'
import Blowfish from 'blowfish-resizer'
import { Sprite } from '@pixi/sprite'
import { range } from './playable/utils'
import { createSpriteParkingLine, createSpriteParkingSymbol } from './playable/createSprites'
import DrawingSystem from './playable/DrawingSystem'
import ContainerChain from './playable/Renderable'
import { AlphaFilter } from '@pixi/filter-alpha'
import { BlurFilter } from '@pixi/filter-blur'
import { IPointData } from '@pixi/math'
import CarSystem from './playable/CarSystem'
import { EventEmitter } from '@pixi/utils'

export default class Scene2d extends Container implements IScene2d {
    private blowfish?: Blowfish

    private bg = new Graphics()
    private carYellow: Sprite
    private carRed: Sprite
    private parkingLines: Container[]

    private parkingSymbolRed: Sprite
    private parkingSymbolYellow: Sprite

    private drawingSystemRed: DrawingSystem
    private drawingSystemYellow: DrawingSystem

    private carSystemRed: CarSystem
    private carSystemYellow: CarSystem
    private carCrashCheckSystem = new EventEmitter()

    constructor() {
        super()
        this.interactive = true

        this.addChild(this.bg)

        const layerGround = new ContainerChain()
            .setFilters([new BlurFilter(0.2), new AlphaFilter(0.5)])
            .addTo(this)

        this.carYellow = createSprite('car_yellow')
        this.carYellow.anchor.set(0.5)
        this.carYellow.rotation = -Math.PI
        this.addChild(this.carYellow)

        // this.carYellow.mask = layerGroundRed

        this.carRed = createSprite('car_red')
        this.carRed.anchor.set(0.5)
        this.carRed.rotation = -Math.PI
        this.addChild(this.carRed)

        this.parkingLines = range(5).map(() => createSpriteParkingLine())
        this.parkingLines.forEach((el) => this.addChild(el))

        this.parkingSymbolRed = createSpriteParkingSymbol(colors.parking.red)
        this.addChild(this.parkingSymbolRed)

        this.parkingSymbolYellow = createSpriteParkingSymbol(colors.parking.yellow)
        this.addChild(this.parkingSymbolYellow)

        this.drawingSystemRed = new DrawingSystem(this, layerGround, colors.parking.red)
        this.drawingSystemYellow = new DrawingSystem(this, layerGround, colors.parking.yellow)

        this.carSystemRed = new CarSystem(this.carRed)
        this.carSystemYellow = new CarSystem(this.carYellow)

        this.carCrashCheckSystem.once('crash', () => {
            this.carSystemRed.toStateFinished(this.carYellow.position)
            this.carSystemYellow.toStateFinished(this.carRed.position)
        })
    }

    public start() {
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
        // draw bg
        this.bg.clear()
            .beginFill(colors.background)
            .drawRect(0, 0, width, height)
            .endFill()

        if (!this.blowfish) {
            const elements = {

                field: {
                    target: {},
                    params: {
                        percentMargin: { value: 0, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
                        percentScaleHeight: { value: 1, editor: { min: 0.1, max: 1, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
                        percentCarMarginBottom: { value: 0.5, editor: { min: 0.1, max: 1, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
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
            }
            // eslint-disable-next-line
            const config = { field: [{ type: 'single', aspectRatio: 0.45, params: { percentMargin: 0.028, percentScaleHeight: 0.406, percentCarMarginBottom: 0.9 } }, { type: 'single', aspectRatio: 0.9993, params: { percentMargin: 0.052, percentScaleHeight: 0.222, percentCarMarginBottom: 0.9 } }, { type: 'single', aspectRatio: 2.2222, params: { percentMargin: 0.28, percentScaleHeight: 0.233, percentCarMarginBottom: 0.839 } }] }
            this.blowfish = new Blowfish(this.constructor.name, elements, config, defaultParams, defaultFuncSetParams)
        }
        this.blowfish.Update(width, height)
    }
}
