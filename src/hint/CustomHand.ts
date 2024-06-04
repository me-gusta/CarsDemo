import { Graphics } from '@pixi/graphics'
import { IPointData } from '@pixi/math'
import { Easing, Group, Tween } from 'tween-es'
import HintBaseHand from './BaseHand'

export default class CustomHand extends HintBaseHand {
    private hand: Graphics
    private finger: Graphics

    constructor() {
        super()

        this.hand = new Graphics()
        this.hand.beginFill(0x888888).drawRect(-20, -20, 100, 80).drawRect(-40, -20, 20, 60).endFill()
        this.addChild(this.hand)

        this.finger = new Graphics()
        this.finger.beginFill(0x666666).drawRect(-20, -80, 40, 100).endFill()
        this.hand.addChild(this.finger)

        this.hand.pivot.set(-5, -65)
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

        tween.start(startTime)
        if (callbackStart != null) tween.onStart(callbackStart)
        if (callbackUpdate != null) tween.onUpdate(callbackUpdate)
        if (callbackComplete != null) tween.onComplete(callbackComplete)
    }

    public tap(
        tweenGroup: Group,
        startTime: number,
        callbackStart: () => void,
        callbackTap: () => void,
        callbackComplete: () => void,
    ): void {
        this.finger.angle = 0
        this.finger.scale.set(1.0, 1.0)
        const tween0 = new Tween(this.finger, tweenGroup)
            .to({ angle: -5.0, scale: { x: 1.0, y: 0.9 } }, 300)
            .easing(Easing.cubicOut)
        const tween1 = new Tween(this.finger, tweenGroup)
            .delay(50)
            .to({ angle: 0.0, scale: { x: 1.0, y: 1.0 } }, 300)
            .easing(Easing.cubicInOut)

        tween0.chain(tween1)
        tween0.start(startTime)

        if (callbackStart != null) tween0.onStart(callbackStart)
        if (callbackTap != null) tween0.onComplete(callbackTap)
        if (callbackComplete != null) tween1.onComplete(callbackComplete)
    }

    public fingerDown(tweenGroup: Group, startTime: number, callbackStart: () => void, callbackComplete: () => void): void {
        this.finger.angle = 0
        this.finger.scale.set(1.0, 1.0)

        new Tween(this.hand, tweenGroup).to({ scale: { x: 0.9, y: 0.9 } }, 300).start(Time.time)
        const tween0 = new Tween(this.finger, tweenGroup)
            .to({ angle: -15.0, scale: { x: 1.0, y: 0.9 } }, 300)
            .easing(Easing.cubicOut)

        tween0.start(startTime)

        if (callbackStart != null) tween0.onStart(callbackStart)
        if (callbackComplete != null) tween0.onComplete(callbackComplete)
    }

    public fingerUp(tweenGroup: Group, startTime: number, callbackStart: () => void, callbackComplete: () => void): void {
        this.finger.scale.set(1.0, 0.9)
        new Tween(this.hand, tweenGroup).to({ scale: { x: 1, y: 1 } }, 300).start(Time.time)
        const tween0 = new Tween(this.finger, tweenGroup)
            .to({ angle: 0.0, scale: { x: 1.0, y: 1.0 } }, 300)
            .easing(Easing.cubicInOut)

        tween0.start(startTime)

        if (callbackStart != null) tween0.onStart(callbackStart)
        if (callbackComplete != null) tween0.onComplete(callbackComplete)
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
}
