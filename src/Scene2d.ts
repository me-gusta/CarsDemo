import { Container } from '@pixi/display'
import { Text } from '@pixi/text'
import { IScene2d } from './applications/2d/App2d'
import { Graphics } from '@pixi/graphics'
import { colors } from './settings'
import { createSprite, defaultFuncSetParams, defaultParams } from './utils/Utility'
import { getPositionActive, getPositionParked } from './playable/space'
import Blowfish from 'blowfish-resizer'
import { Sprite } from '@pixi/sprite'
import { range } from './playable/utils'
import { defaultParamsCar, defaultParamsParkingLine, defaultParamsParkingSymbol } from './playable/defaultParams'
import { createSpriteParkingLine, createSpriteParkingSymbol } from './playable/createSprites'

export default class Scene2d extends Container implements IScene2d {
    private blowfish?: Blowfish

    private bg = new Graphics()
    private carYellow: Sprite
    private carRed: Sprite
    private parkingLines: Container[]
    private parkingSymbolRed: Sprite
    private parkingSymbolYellow: Sprite

    constructor() {
        super()
        this.addChild(this.bg)

        this.carYellow = createSprite('car_yellow')
        this.carYellow.anchor.set(0.5)
        this.carYellow.rotation = -Math.PI
        this.carYellow.position.copyFrom(
            getPositionActive(3),
        )
        this.addChild(this.carYellow)

        this.carRed = createSprite('car_red')
        this.carRed.anchor.set(0.5)
        this.carRed.rotation = -Math.PI
        this.carRed.position.copyFrom(
            getPositionActive(1),
        )
        this.addChild(this.carRed)

        this.parkingLines = range(5).map(() => createSpriteParkingLine())
        this.parkingLines.forEach((el) => this.addChild(el))

        this.parkingSymbolRed = createSpriteParkingSymbol(colors.parking.red)
        this.addChild(this.parkingSymbolRed)

        this.parkingSymbolYellow = createSpriteParkingSymbol(colors.parking.yellow)
        this.addChild(this.parkingSymbolYellow)
    }

    public start() {
    }

    public update(deltaTime: number): void
    public update() { }

    public resize(width: number, height: number): void
    public resize(width: number, height: number) {
        // draw bg
        this.bg.clear()
            .beginFill(colors.background)
            .drawRect(0, 0, width, height)
            .endFill()

        if (!this.blowfish) {
            const elements = {
                carRed: {
                    target: this.carRed,
                    params: defaultParamsCar(true),
                },
                carYellow: {
                    target: this.carYellow,
                    params: defaultParamsCar(false),
                },
                parkingSymbolRed: {
                    target: this.parkingSymbolRed,
                    params: defaultParamsParkingSymbol(1),
                },
                parkingSymbolYellow: {
                    target: this.parkingSymbolYellow,
                    params: defaultParamsParkingSymbol(2),
                },
                ...Object.fromEntries(this.parkingLines.map((parkingLine, i) => ([`parkingLine${i}`, {
                    target: parkingLine,
                    params: defaultParamsParkingLine(i),
                }]))),

                field: {
                    target: [],
                    params: {
                        testNumber: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
                        isVisible: { value: true, interpolation: Blowfish.Interpolation.Left },
                    },
                    fncSetParams: (target: any[], params: any, screenSize: any) => {
                        console.log('setter call', params)
                    },
                },
            }
            // eslint-disable-next-line
            const config = { carRed: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.2, y: 0.8, scale: 1.8 } }, { type: 'single', aspectRatio: 0.8573, params: { x: 0.2, y: 0.8, scale: 1.5 } }, { type: 'single', aspectRatio: 2.2222, params: { x: 0.2, y: 0.8, scale: 2 } }], carYellow: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.8, y: 0.8, scale: 1.8 } }, { type: 'single', aspectRatio: 0.8573, params: { x: 0.8, y: 0.8, scale: 1.5 } }, { type: 'single', aspectRatio: 2.2222, params: { x: 0.8, y: 0.8, scale: 2 } }], parkingSymbolRed: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.412, y: 0.25, scale: 2 } }, { type: 'single', aspectRatio: 0.7489, params: { x: 0.412, y: 0.4001, scale: 2 } }, { type: 'single', aspectRatio: 2.2222, params: { x: 0.4, y: 0.25, scale: 2 } }], parkingSymbolYellow: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.612, y: 0.25, scale: 2 } }, { type: 'single', aspectRatio: 0.7489, params: { x: 0.612, y: 0.4001, scale: 2 } }, { type: 'single', aspectRatio: 2.2222, params: { x: 0.6, y: 0.25, scale: 2 } }], parkingLine0: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.1, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.7501, params: { x: 0.1, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.9991, params: { x: 0.1, y: 0, scale: 1.5065 } }, { type: 'single', aspectRatio: 1.7792, params: { x: 0.1, y: 0, scale: 1.2 } }], parkingLine1: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.3, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.7501, params: { x: 0.3, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.9991, params: { x: 0.3, y: 0, scale: 1.5065 } }, { type: 'single', aspectRatio: 1.7792, params: { x: 0.3, y: 0, scale: 1.2 } }], parkingLine2: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.5, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.7501, params: { x: 0.5, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.9991, params: { x: 0.5, y: 0, scale: 1.5065 } }, { type: 'single', aspectRatio: 1.7792, params: { x: 0.5, y: 0, scale: 1.2 } }], parkingLine3: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.7, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.7501, params: { x: 0.7, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.9991, params: { x: 0.7, y: 0, scale: 1.5065 } }, { type: 'single', aspectRatio: 1.7792, params: { x: 0.7, y: 0, scale: 1.2 } }], parkingLine4: [{ type: 'single', aspectRatio: 0.45, params: { x: 0.9, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.7501, params: { x: 0.9, y: 0, scale: 2 } }, { type: 'single', aspectRatio: 0.9991, params: { x: 0.9, y: 0, scale: 1.5065 } }, { type: 'single', aspectRatio: 1.7792, params: { x: 0.9, y: 0, scale: 1.2 } }] }
            console.log(config)

            this.blowfish = new Blowfish(this.constructor.name, elements, config, defaultParams, defaultFuncSetParams)
        }
        this.blowfish.Update(width, height)
    }
}
