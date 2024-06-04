import { DisplayObject } from '@pixi/display'
import { Point, IPointData, Rectangle, Circle, RoundedRectangle } from '@pixi/math'
import { Group } from 'tween-es'
import BaseHand from './BaseHand'
import HintFade from './HintFade'

type ITarget = {
    object: DisplayObject
    offset?: IPointData
}

type IRepeater = {
    startActionIndex: number
    count: number
}

class Action {
    private startTime: number
    private tweenGroup: Group
    private targets: ITarget[]
    private actionStartCallback: (points: Point[], hand: BaseHand, tweenGroup: Group, startTime: number) => void

    constructor(targets: ITarget[], startCallback: (points: Point[], hand: BaseHand, tweenGroup: Group, startTime: number) => void) {
        this.startTime = -1
        this.targets = targets
        this.actionStartCallback = startCallback
        this.tweenGroup = new Group()
    }

    private getLocalPoints(hand: BaseHand): Point[] {
        const localPoints: Point[] = []
        this.targets.forEach((target: ITarget) => {
            localPoints.push(hand.parent.toLocal(target.offset ?? new Point(0, 0), target.object))
        })
        return localPoints
    }

    public update() {
        this.tweenGroup.update(Time.time)
    }

    public start(hand: BaseHand) {
        const points = this.getLocalPoints(hand)
        if (this.startTime === -1) {
            this.startTime = Time.time
        } else {
            this.tweenGroup.removeAll()
        }
        this.actionStartCallback(points, hand, this.tweenGroup, this.startTime)
    }

    public stop() {
        this.tweenGroup.removeAll()
        this.startTime = -1
    }
}

export default class Hint {
    public hand: BaseHand
    public fade: HintFade|null

    private currentActionIndex: number = -1

    private readonly actions: Action[] = []
    private readonly repeaters: IRepeater[] = []

    private readonly refUpdateFunction: () => void = this.update.bind(this)

    public get isPlaying() { return (this.currentActionIndex !== -1) }

    constructor(hand: BaseHand, fade: HintFade|null = null) {
        this.hand = hand
        this.fade = fade
    }

    public start() {
        this.currentActionIndex = 0
        this.startCurrentAction()
        App.beforeRender.add(this.refUpdateFunction)
        return this
    }

    public stop() {
        App.beforeRender.remove(this.refUpdateFunction)
        if (this.currentActionIndex > 0 && this.currentActionIndex < this.actions.length) {
            this.actions[this.currentActionIndex].stop()
        }
        this.currentActionIndex = -1
        this.fade?.hide()
        this.hand.tryHide()
    }

    public stopAndClear() {
        this.stop()
        this.currentActionIndex = -1
        this.actions.splice(0)
        this.repeaters.splice(0)
    }

    public resize(): void {
        this.fade?.resize()
        this.startCurrentAction()
    }

    private addAction(targets: ITarget[], callback: (points: Point[], hand: BaseHand, tweenGroup: Group, startTime: number) => void) {
        this.actions.push(new Action(targets, callback))
    }

    private update() {
        if ((this.currentActionIndex !== -1) && (this.currentActionIndex < this.actions.length)) {
            this.actions[this.currentActionIndex].update()
        } else {
            this.stop()
        }
    }

    private startCurrentAction(): void {
        if ((this.currentActionIndex !== -1) && (this.currentActionIndex < this.actions.length)) {
            this.actions[this.currentActionIndex].start(this.hand)
        }
    }

    private nextAction(): void {
        if ((this.currentActionIndex !== -1) && (this.currentActionIndex < this.actions.length)) {
            this.actions[this.currentActionIndex].stop()
            this.currentActionIndex++
            this.startCurrentAction()
        }
    }

    // #region Repeat
    private addRepeat(startActionIndex: number, repeatCount: number): void {
        this.repeaters.push({ startActionIndex, count: repeatCount })
    }

    private tryRepeat(): void {
        const repeater = this.repeaters[this.repeaters.length - 1]
        repeater.count--
        if (repeater.count > 0) {
            this.currentActionIndex = repeater.startActionIndex
        } else {
            this.repeaters.pop()
        }
        this.nextAction()
    }
    // #endregion

    // #region Repeat Actions
    public beginRepeat(repeatCount: number): Hint {
        this.addAction([], () => {
            this.addRepeat(this.currentActionIndex, repeatCount)
            this.nextAction()
        })
        return this
    }

    public endRepeat(): Hint {
        this.addAction([], () => {
            this.tryRepeat()
        })
        return this
    }
    // #endregion

    // #region Hand Actions
    public beginHand(): Hint {
        this.addAction([], () => {
            this.hand.tryShow()
            this.nextAction()
        })
        return this
    }

    public endHand(): Hint {
        this.addAction([], () => {
            this.hand.tryHide()
            this.nextAction()
        })
        return this
    }
    // #endregion

    // #region Fade Actions
    /**
     * @param object объект который подсвечивает затемнение
     * @param offset сдвиг относительно объекта
     * @param shape кастомная форма
     */
    public beginFade(options: {
        object?: DisplayObject,
        offset?: IPointData,
        shape?: Rectangle|Circle|RoundedRectangle,
    }): Hint {
        this.addAction([], () => {
            this.fade?.addTarget(options.object, options.offset, options.shape)
            this.fade?.show()
            this.nextAction()
        })
        return this
    }

    public endFade(): Hint {
        this.addAction([], () => {
            this.fade?.hide()
            this.nextAction()
        })
        return this
    }
    // #endregion

    // #region Actions
    /**
     * @param fromObject объект от которого движется рука
     * @param fromOffset (optional) отступ
     * @param toObject объект в который движется рука
     * @param toOffset (optional) отступ
     * @param time время движения
     * @param start (optional) сallback
     * @param update (optional) сallback
     * @param complete (optional) сallback
     */
    public move(options: {
        fromObject: DisplayObject,
        fromOffset?: IPointData,
        toObject: DisplayObject,
        toOffset?: IPointData,
        time: number,
        start?: () => void,
        update?: () => void,
        complete?: () => void,
    }): Hint {
        this.addAction(
            [{ object: options.fromObject, offset: options.fromOffset }, { object: options.toObject, offset: options.toOffset }],
            (points, hand, tweenGroup, startTime) => {
                hand.position.set(points[0].x, points[0].y)
                hand.move(points[1], options.time, tweenGroup, startTime, options.start, options.update, () => {
                    options.complete?.()
                    this.nextAction()
                })
            },
        )
        return this
    }

    /**
     * @param object объект над которым висит рука
     * @param offset (optional) отступ
     * @param start (optional) сallback
     * @param tap (optional) сallback
     * @param complete (optional) сallback
     */
    public tap(options: {
        object: DisplayObject,
        offset?: IPointData,
        start?: () => void,
        tap?: () => void,
        complete?: () => void,
    }): Hint {
        this.addAction(
            [{ object: options.object, offset: options.offset }],
            (points, hand, tweenGroup, startTime) => {
                hand.position.set(points[0].x, points[0].y)
                hand.tap(tweenGroup, startTime, options.start, options.tap, () => {
                    options.complete?.()
                    this.nextAction()
                })
            },
        )
        return this
    }

    /**
     * @param object объект над которым висит рука
     * @param offset (optional) отступ
     * @param time время ожидания
     * @param start (optional) сallback
     * @param complete (optional) сallback
     */
    public wait(options: {
        object: DisplayObject,
        offset?: IPointData,
        time: number,
        start?: () => void,
        complete?: () => void,
    }): Hint {
        this.addAction(
            [{ object: options.object, offset: options.offset }],
            (points, hand, tweenGroup, startTime) => {
                hand.position.set(points[0].x, points[0].y)
                hand.wait(tweenGroup, startTime, options.time, options.start, () => {
                    options.complete?.()
                    this.nextAction()
                })
            },
        )
        return this
    }

    /**
     * @param object объект над которым висит рука
     * @param offset (optional) отступ
     * @param start (optional) сallback
     * @param complete (optional) сallback
     */
    public fingerDown(options: {
        object: DisplayObject,
        offset?: IPointData,
        start?: () => void,
        complete?: () => void,
    }): Hint {
        this.addAction(
            [{ object: options.object, offset: options.offset }],
            (points, hand, tweenGroup, startTime) => {
                hand.position.set(points[0].x, points[0].y)
                hand.fingerDown(tweenGroup, startTime, options.start, () => {
                    options.complete?.()
                    this.nextAction()
                })
            },
        )
        return this
    }

    /**
     * @param object объект над которым висит рука
     * @param offset (optional) отступ
     * @param start (optional) сallback
     * @param complete (optional) сallback
     */
    public fingerUp(options: {
        object: DisplayObject,
        offset?: IPointData,
        start?: () => void,
        complete?: () => void,
    }): Hint {
        this.addAction(
            [{ object: options.object, offset: options.offset }],
            (points, hand, tweenGroup, startTime) => {
                hand.position.set(points[0].x, points[0].y)
                hand.fingerUp(tweenGroup, startTime, options.start, () => {
                    options.complete?.()
                    this.nextAction()
                })
            },
        )
        return this
    }
    // #endregion
}
