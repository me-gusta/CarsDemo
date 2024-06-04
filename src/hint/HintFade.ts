import { RenderTexture } from '@pixi/core'
import { Container, DisplayObject } from '@pixi/display'
import { BlurFilter } from '@pixi/filter-blur'
import { Graphics } from '@pixi/graphics'
import { Matrix, Circle, Rectangle, RoundedRectangle, SHAPES, IPointData, Point } from '@pixi/math'
import { Sprite } from '@pixi/sprite'
import { Group, Tween } from 'tween-es'

enum EHintFadeState { SHOW, HIDE }

type IHintFadeTarget = {
    displayObject: DisplayObject
    offset: IPointData
    shape: null|Rectangle|Circle|RoundedRectangle
}

export default class HintFade extends Container {
    private state: EHintFadeState = EHintFadeState.HIDE
    private sprite: Sprite
    private drawFill: { color: number, alpha: number }
    private blurFilter: BlurFilter|null
    private targets: IHintFadeTarget[] = []
    private tweenGroup: Group = new Group()
    private needClearTargets: boolean = false
    private renderTexture: RenderTexture = RenderTexture.create({ width: 1024, height: 1024 })

    /**
     * @param {number} color 0x000000 - 0xffffff
     * @param {number} alpha 0.0 - 1.0
     * @param {number} blurSize BlurFilter strength
     */
    constructor(color: number = 0x000000, alpha: number = 0.6, blurSize: number = 8) {
        super()

        this.drawFill = { color, alpha }
        this.blurFilter = (blurSize === 0) ? null : new BlurFilter(blurSize, 6)

        this.sprite = new Sprite(this.renderTexture)
        this.sprite.visible = false
        this.addChild(this.sprite)

        App.beforeRender.add(this.update.bind(this))
    }

    private update(): void {
        this.tweenGroup.update(Time.time)
    }

    public resize(): void {
        this.redraw()
    }

    public addTarget(displayObject?: DisplayObject, offset: IPointData = { x: 0, y: 0 }, shape:null|Rectangle|Circle|RoundedRectangle = null): void {
        if (this.needClearTargets) {
            this.clearTargets()
        }

        if (displayObject) {
            this.targets.push({ displayObject, offset, shape })
        }
        this.redraw()
    }

    private clearTargets(): void {
        this.needClearTargets = false
        this.targets = []
    }

    // first pass
    // render targets hole to temporaly renderTexture
    // second pass
    // render temporaly renderTexture width blur to this.renderTexture
    private redraw(): void {
        const app = App.modules['2d']

        const minPos = this.toLocal(new Point(0, 0))
        const invertResolution = 1 / app.renderer.resolution
        const maxPos = this.toLocal(new Point(app.renderer.width * invertResolution, app.renderer.height * invertResolution))
        const fadeWidth = maxPos.x - minPos.x
        const fadeHeight = maxPos.y - minPos.y

        const graphics = new Graphics()
        graphics.beginFill(...Object.values(this.drawFill))
        // draw size x2 for draw hole outside screen border
        graphics.drawRect(-fadeWidth / 2, -fadeHeight / 2, fadeWidth * 2, fadeHeight * 2)
        graphics.beginHole()
        this.targets.forEach((target: IHintFadeTarget) => {
            if (target.shape != null) {
                const x = target.offset.x + target.shape.x
                const y = target.offset.y + target.shape.y
                const leftTop = this.toLocal(new Point(x, y), target.displayObject)
                switch (target.shape.type) {
                    case SHAPES.RECT: {
                        const tRect = target.shape
                        const lRightBottom = this.toLocal(new Point(x + tRect.width, y + tRect.height), target.displayObject)
                        graphics.drawRect(leftTop.x, leftTop.y, lRightBottom.x - leftTop.x, lRightBottom.y - leftTop.y)
                        break;
                    }
                    case SHAPES.RREC: {
                        const tRRect = target.shape
                        const lRRightBottom = this.toLocal(new Point(x + tRRect.width, y + tRRect.height), target.displayObject)
                        graphics.drawRoundedRect(leftTop.x, leftTop.y, lRRightBottom.x - leftTop.x, lRRightBottom.y - leftTop.y, tRRect.radius)
                        break;
                    }
                    case SHAPES.CIRC: {
                        const tCirc = target.shape
                        const lRad = (this.toLocal(new Point(x + tCirc.radius, y), target.displayObject).x - leftTop.x)
                        graphics.drawCircle(leftTop.x, leftTop.y, lRad)
                        break;
                    }
                    default: break;
                }
            } else {
                const targetBounds = target.displayObject.getBounds()

                const offset = target.displayObject.toGlobal(target.offset)
                const tgZero = target.displayObject.toGlobal(new Point(0, 0))
                targetBounds.x += (offset.x - tgZero.x)
                targetBounds.y += (offset.y - tgZero.y)

                const lLeftTop = this.toLocal(new Point(targetBounds.x, targetBounds.y))
                const lRightBottom = this.toLocal(new Point(targetBounds.x + targetBounds.width, targetBounds.y + targetBounds.height))
                graphics.drawRect(lLeftTop.x, lLeftTop.y, lRightBottom.x - lLeftTop.x, lRightBottom.y - lLeftTop.y)
            }
        })
        graphics.endHole()
        graphics.endFill()

        const graphicsScale = Math.min(this.renderTexture.width / fadeWidth, this.renderTexture.height / fadeHeight)
        const transform = new Matrix()
        transform.scale(graphicsScale, graphicsScale)

        if (this.blurFilter == null) {
            app.renderer.render(graphics, { renderTexture: this.renderTexture, transform }) // TODO app renderer
        } else {
            const renderTexture = RenderTexture.create({ width: this.renderTexture.width, height: this.renderTexture.height })
            app.renderer.render(graphics, { renderTexture, transform }) // TODO app renderer

            const sprite = new Sprite(renderTexture)
            sprite.filters = [this.blurFilter]
            app.renderer.render(sprite, { renderTexture: this.renderTexture }) // TODO app renderer

            renderTexture.destroy()
            sprite.destroy()
        }
        graphics.destroy()

        this.sprite.scale.set(1 / graphicsScale)
    }

    public show(): void {
        if (this.state === EHintFadeState.HIDE) {
            this.state = EHintFadeState.SHOW
            this.sprite.visible = true

            if (this.tweenGroup.getAll().length > 0) {
                this.tweenGroup.removeAll()
                this.sprite.alpha = 1.0
            } else {
                this.sprite.alpha = 0.0
                new Tween(this.sprite, this.tweenGroup)
                    .to({ alpha: 1.0 }, 100)
                    .start(Time.time)
            }
        }
    }

    public hide(): void {
        if (this.state === EHintFadeState.SHOW) {
            this.state = EHintFadeState.HIDE
            this.needClearTargets = true

            this.tweenGroup.removeAll()
            new Tween(this.sprite, this.tweenGroup)
                .to({ alpha: 0.0 }, 100)
                .start(Time.time)
                .onComplete(() => {
                    this.sprite.visible = false
                    this.clearTargets()
                })
        }
    }
}
