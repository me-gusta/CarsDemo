import { RenderTexture, Texture } from '@pixi/core'
import { Container } from '@pixi/display'
import { BlurFilter } from '@pixi/filter-blur'
import { Graphics } from '@pixi/graphics'
import { IPointData, Matrix, Point } from '@pixi/math'
import { Sprite } from '@pixi/sprite'
import { hex2rgb, rgb2hex } from '@pixi/utils'
import Blowfish from 'blowfish-resizer'
import { Group } from 'tween-es'

type vec2 = { x: number, y: number }

class _CONFIG {
    static get renderer() {
        return App.modules['2d'].renderer
    }
}

// #region Utility

/** @const 57.2957... */
export const Rad2Deg = 180.0 / Math.PI

/** @const 0.0174... */
export const Deg2Rad = Math.PI / 180.0

/**
 * @example
 * clamp(5, 1, 2)            // return 2
 * clamp(-3, 1, 2)           // return 1
 * clamp(2) = clamp(2, 0, 1) // return 1
 */
export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

/**
 * @example
 * lerp(0, 2, 0.5)  // return 1
 * lerp(1, 5, 0.75) // return 4
 * lerp(0, 2, 1.5)  // return 3
 */
export const lerp = (min: number, max: number, t: number) => (min * (1 - t) + max * t)

/**
 * @example
 * lerpClamped(0, 2, 0.5)  // return 1
 * lerpClamped(0, 2, -1)   // return 0
 * lerpClamped(0, 2, 1.5)  // return 2
 */
export const lerpClamped = (min: number, max: number, t: number) => lerp(min, max, clamp(t))

/**
 * @example
 * lerpInversed(0, 2, 1) // return 0.5
 * lerpInversed(1, 5, 4) // return 0.75
 */
export const lerpInversed = (min: number, max: number, value: number) => ((value - min) / (max - min))

/**
 * @example
 * remap(0, 2, 0, 20, 1)  // return 10
 * remap(0, 2, 10, 20, 1) // return 15
 * remap(0, 2, 5, 7, 2)   // return 7
 */
export const remap = (imin: number, imax: number, omin: number, omax: number, value: number) => (
    lerp(omin, omax, lerpInversed(imin, imax, value))
)

/**
 * @example
 * repeat(0, 3) // 0
 * repeat(1, 3) // 1
 * repeat(2, 3) // 2
 * repeat(3, 3) // 0
 * repeat(4, 3) // 1
 * repeat(5, 3) // 2
 * repeat(6, 3) // 0
 */
export const repeat = (value: number, length: number) => value % length

/**
 * @example
 * pingPong(0, 3) // 0
 * pingPong(1, 3) // 1
 * pingPong(2, 3) // 2
 * pingPong(3, 3) // 1
 * pingPong(4, 3) // 0
 * pingPong(5, 3) // 1
 * pingPong(6, 3) // 2
 */
export const pingPong = (value: number, length: number) => {
    length--
    if (Math.floor(value / length) % 2 === 0) return repeat(value, length)
    return length - repeat(value, length)
}

/**
 * @example
 * ceilPowerOfTwo(7) // 8
 * ceilPowerOfTwo(8) // 8
 * ceilPowerOfTwo(129) // 256
 */
export const ceilPowerOfTwo = (value: number) => (2 ** Math.ceil(Math.log2(value)))

export const angleLookAt = (x1: number, y1: number, x2: number, y2: number) => Math.atan2(y2 - y1, x2 - x1)

export const distanceCoordinates = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2
    const deltaY = y1 - y2
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

export const distancePoints = (p1: vec2, p2: vec2) => distanceCoordinates(p1.x, p1.y, p2.x, p2.y)

export const magnitudePoint = (point: vec2) => Math.sqrt(point.x * point.x + point.y * point.y)

export const magnitudeCoordinates = (x: number, y: number) => Math.sqrt(x * x + y * y)

export const intToString = (int: number, countSymbol: number) => String(int).padStart(countSymbol, '0')
// #endregion Utility

//
// #region Utility Pixi
export const createTestPoint = (radius = 10, color = 0x000000) => {
    const graphics = new Graphics()
    graphics.beginFill(color, 0.9).drawCircle(0, 0, radius).endFill()
    return graphics
}

/** @example createSprite('my_sprite') */
export const createSprite = (spriteName: string) => new Sprite(AssetsStorage.getAsset(spriteName))

/** @deprecated use AssetsStorage.getAsset(nameSprite) */
export const getSpriteTexture = (nameSprite: string) => AssetsStorage.getAsset(nameSprite)

/** @example GetGradientTexture(128, 128, 64, 0, 64, 128, ['#77cee5', '#5fa3b6'], [0, 1]) */
export const getGradientTexture = (
    width: number,
    height: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    colors: string[],
    offsets: number[],
) => {
    const gradientCanvas = document.createElement('canvas')
    gradientCanvas.width = width
    gradientCanvas.height = height
    const ctx = gradientCanvas.getContext('2d')!
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
    for (let i = 0; i < colors.length; i++) gradient.addColorStop(offsets[i], colors[i])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    return Texture.from(gradientCanvas)
}

/**
 * @example
 * lerpColors(0x888888, 0x000000, 0.25) == 0x666666
 * lerpColors(0x000000, 0x888888, 0.5) == 0x444444
 */
export const lerpColors = (color1: number, color2: number, t: number) => {
    const ar1 = hex2rgb(color1)
    const ar2 = hex2rgb(color2)
    for (let i = 0; i < 3; i++) {
        ar1[i] = lerp(ar1[i], ar2[i], t)
    }
    return rgb2hex(ar1)
}

export const createShadowTexture = (width: number, height: number, color: number, alpha: number, blurSize: number) => {
    const shape = new Graphics()
    shape.beginFill(color, alpha).drawEllipse(width / 2 + blurSize, height / 2 + blurSize, width / 2, height / 2).endFill()
    shape.filters = [new BlurFilter(blurSize, 8)]

    const renderTexture = RenderTexture.create({ width: width + blurSize * 2, height: height + blurSize * 2 })
    _CONFIG.renderer.render(shape, { renderTexture })
    shape.destroy()

    return renderTexture
}

export const renderToTexture = (() => {
    const tParent = new Container()
    const tTransform = new Matrix()
    const tAnchor = new Point()
    const tPadding = new Point()

    return (
        object: Container,
        params: {
            padding?: IPointData | number,
            useObjectScale?: boolean,
            skipUpdate?: boolean,
        } = {},
    ) => {
        if (params.padding) {
            if (typeof params.padding === 'number') {
                tPadding.set(params.padding)
            } else {
                tPadding.copyFrom(params.padding)
            }
        }

        const skipUpdate = params.skipUpdate ?? false
        const useObjectScale = params.useObjectScale ?? false

        if (!skipUpdate) {
            if (!object.parent) object.parent = tParent
            object.updateTransform()
        }

        let { width, height } = object

        let translateX: number
        let translateY: number
        if (useObjectScale) {
            translateX = tPadding.x / 2 / object.scale.x
            translateY = tPadding.y / 2 / object.scale.y
        } else {
            width /= object.scale.x
            height /= object.scale.y
            tPadding.x /= object.scale.x
            tPadding.y /= object.scale.y
            translateX = tPadding.x / 2
            translateY = tPadding.y / 2
        }

        if ('anchor' in object) tAnchor.copyFrom(object.anchor as any)

        translateX += width * tAnchor.x
        translateY += height * tAnchor.y

        tTransform.translate(translateX, translateY)
        if (useObjectScale) tTransform.scale(object.scale.x, object.scale.y)
        tTransform.append(object.worldTransform.clone().invert())

        const renderTexture = RenderTexture.create({ width: width + tPadding.x, height: height + tPadding.y })
        _CONFIG.renderer.render(object, { renderTexture, transform: tTransform })

        // #region reset to default after render
        if (object.parent === tParent) object.parent = null as any
        tTransform.identity()
        tPadding.set(0)
        tAnchor.set(0)
        // #endregion

        return renderTexture
    }
})()
// #endregion Utility Pixi

// #region TWEEN
// eslint-disable-next-line arrow-body-style
export const getBackIn = (s: number) => {
    // eslint-disable-next-line arrow-body-style
    return ((t: number) => {
        return t * t * ((s + 1) * t - s)
    })
}

// eslint-disable-next-line arrow-body-style
export const getBackOut = (s: number) => {
    // eslint-disable-next-line arrow-body-style
    return ((t: number) => {
        return --t * t * ((s + 1) * t + s) + 1
    })
}

// eslint-disable-next-line arrow-body-style
export const getBackInOut = (s: number) => {
    return ((t: number) => {
        // eslint-disable-next-line no-cond-assign
        if ((t *= 2) < 1) {
            return 0.5 * (t * t * ((s + 1) * t - s))
        }
        // eslint-disable-next-line no-return-assign
        return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
    })
}

export const removeTweenByObject = (object: any, group: Group = Group.shared, callCompleteEvent = false) => {
    const tweens = group.getAll()
    for (let i = tweens.length - 1; i >= 0; i--) {
        // @ts-ignore
        if (tweens[i]._object === object) {
            // @ts-ignore
            if (callCompleteEvent && tweens[i]._onCompleteCallback) {
                // @ts-ignore
                tweens[i]._onCompleteCallback(tweens[i]._object)
            }
            // @ts-ignore
            tweens[i]._chainedTweens = []
            tweens[i].stop()
        }
    }
}
// #endregion TWEEN

export class ContainerSeries extends Container {
    constructor(...containerNames: string[]) {
        super()
        // @ts-ignore
        this[containerNames[0]] = this

        // @ts-ignore
        // eslint-disable-next-line prefer-destructuring
        this[containerNames[0]].name = containerNames[0]
        for (let i = 1; i < containerNames.length; i++) {
            // @ts-ignore
            this[containerNames[i]] = new Container()
            // @ts-ignore
            this[containerNames[i]].name = containerNames[i]
            // @ts-ignore
            this[containerNames[i - 1]].addChild(this[containerNames[i]])
        }
        // @ts-ignore
        this.last = this[containerNames[containerNames.length - 1]]
    }

    // @ts-ignore
    addChildToLast(...children) { this.last.addChild(...children) }
}

// #region blowfish-resizer
export const defaultParams = {
    x: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
}

export const defaultFuncSetParams = (target: Container, params: any, screenSize: any) => {
    target.x = params.x * screenSize.width
    target.y = params.y * screenSize.height
    target.scale.set(params.scale)
}

export const defaultParamsPx = {
    x: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
}

export const defaultFuncSetParamsPx = (target: Container, params: any) => {
    target.x = params.x
    target.y = params.y
    target.scale.set(params.scale)
}
// #endregion blowfish-resizer
