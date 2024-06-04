import { Container } from '@pixi/display'
import { IPointData } from '@pixi/math'
import { Group } from 'tween-es'

const enum EHandState { SHOW, HIDE }

export default abstract class BaseHand extends Container {
    private state: EHandState = EHandState.HIDE
    private tweenGroupShowHide: Group = new Group()

    constructor() {
        super()
        this.visible = false

        App.beforeRender.add(this.update.bind(this))
    }

    private update(): void {
        this.tweenGroupShowHide.update(Time.time)
    }

    // #region override methods
    public abstract move(
        targetPosition: IPointData,
        moveTime: number,
        tweenGroup: Group,
        startTime: number,
        callbackStart?: () => void,
        callbackUpdate?: () => void,
        callbackComplete?: () => void,
    ): void;

    public abstract tap(
        tweenGroup: Group,
        startTime: number,
        callbackStart?: () => void,
        callbackTap?: () => void,
        callbackComplete?: () => void,
    ): void;

    public abstract wait(
        tweenGroup: Group,
        startTime: number,
        time: number,
        callbackStart?: () => void,
        callbackComplete?: () => void,
    ): void;

    public abstract fingerDown(tweenGroup: Group, startTime: number, callbackStart?: () => void, callbackComplete?: () => void): void;

    public abstract fingerUp(tweenGroup: Group, startTime: number, callbackStart?: () => void, callbackComplete?: () => void): void;

    public abstract show(tweenGroup: Group): void;

    public abstract hide(tweenGroup: Group, completeCallback: () => void): void;
    // #endregion

    public tryShow() {
        if (this.state === EHandState.HIDE) {
            this.state = EHandState.SHOW
            this.visible = true
            this.tweenGroupShowHide.removeAll()
            this.show(this.tweenGroupShowHide)
        }
    }

    public tryHide() {
        if (this.state === EHandState.SHOW) {
            this.state = EHandState.HIDE
            this.tweenGroupShowHide.removeAll()
            this.hide(this.tweenGroupShowHide, () => { this.visible = false })
        }
    }
}
