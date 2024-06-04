import { EventEmitter } from '@pixi/utils'

export type IApiEvents = 'gamestart' | 'gameclose' | 'ready' | 'resize' | 'pause'

export default abstract class AbstractApi {
    protected _isReady = false

    protected eventEmitter = new EventEmitter<IApiEvents>()

    protected emit(...args: Parameters<typeof this.eventEmitter.emit>) {
        this.eventEmitter.emit(...args)
        return this
    }

    public on(...args: Parameters<typeof this.eventEmitter.on>) {
        this.eventEmitter.on(...args)
        return this
    }

    public once(...args: Parameters<typeof this.eventEmitter.once>) {
        this.eventEmitter.once(...args)
        return this
    }

    /** @readonly */
    public get isReady() { return this._isReady }

    /** вызывается после подписки на события API */
    public abstract init(): void

    public abstract openApp(): void

    /** вызывается после загрузки всех ассетов */
    public abstract gameReady(): void

    public abstract gameRetry(): void

    /** вызывается в конце игры */
    public abstract gameEnd(): void
}
