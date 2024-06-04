import { Tween } from 'tween-es'

declare module 'tween-es' {
    interface Tween<T> {
        startAsync(time?: number): Promise<T>
    }
}

Tween.prototype.startAsync = function startAsync(time?: number) {
    return new Promise((resolve) => {
        const prevCompleteCallback: ((object: any) => void) | undefined = (
            this as any
        )._onCompleteCallback

        this.onComplete((object) => {
            if (prevCompleteCallback) prevCompleteCallback(object)
            resolve(object)
        })
        this.start(time)
    })
}
