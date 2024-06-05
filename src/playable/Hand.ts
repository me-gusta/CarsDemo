import { IPointData } from '@pixi/math'
import { Sprite } from '@pixi/sprite'
import BaseHand from 'src/hint/BaseHand'
import { createSprite } from 'src/utils/Utility'
import { Easing, Group, Tween } from 'tween-es'

export default class Hand extends BaseHand {
    private hand: Sprite

    constructor() {
        super()
        this.hand = createSprite('hand')
        this.addChild(this.hand)
    }

    public move(
        targetPosition: IPointData,
        moveTime: number,
        tweenGroup: Group,
        startTime: number,
        callbackStart: () => void,
        callbackUpdate: () => void,
        callbackComplete: () => void,
    ): void {
        const tween = new Tween(this, tweenGroup)
            .to({ x: targetPosition.x, y: targetPosition.y }, moveTime)
            .easing(Easing.quadraticInOut)

        tween.start()
        if (callbackStart != null) tween.onStart(callbackStart)
        if (callbackUpdate != null) tween.onUpdate(callbackUpdate)
        if (callbackComplete != null) tween.onComplete(callbackComplete)
    }

    public tap(tweenGroup: Group, startTime: number, callbackStart?: (() => void) | undefined, callbackTap?: (() => void) | undefined, callbackComplete?: (() => void) | undefined): void {
        throw new Error('Method not implemented.')
    }

    public wait(
        tweenGroup: Group,
        startTime: number,
        time: number,
        callbackStart: () => void,
        callbackComplete: () => void,
    ): void {
        const tweenWait = new Tween(this, tweenGroup).to({ }, time)

        tweenWait.start(startTime)

        if (callbackStart != null) tweenWait.onStart(callbackStart)
        if (callbackComplete != null) tweenWait.onComplete(callbackComplete)
    }

    public fingerDown(tweenGroup: Group, startTime: number, callbackStart?: (() => void) | undefined, callbackComplete?: (() => void) | undefined): void {
        throw new Error('Method not implemented.')
    }

    public fingerUp(tweenGroup: Group, startTime: number, callbackStart?: () => void, callbackComplete?: () => void): void {
        throw new Error('Method not implemented.')
    }

    public show(tweenGroup: Group): void {
        this.alpha = 0.0
        new Tween(this, tweenGroup)
            .to({ alpha: 1.0 }, 200)
            .start(Time.time)
    }

    public hide(tweenGroup: Group, completeCallback: () => void): void {
        new Tween(this, tweenGroup)
            .to({ alpha: 0.0 }, 200)
            .start(Time.time)
            .onComplete(completeCallback)
    }

    setVisibility(value:boolean) {
        this.hand.visible = value
    }
}