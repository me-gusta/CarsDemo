import { Tween } from 'tween-es'

export const range = (amount: number) => [...Array(amount).keys()]

type TweenMode = 'parallel' | 'sequential'
type TweenCommand = {
    mode: TweenMode,
    delay?: number
}

type TweenBatch = {
    mode: TweenMode,
    delay?: number,
    tweens: Tween<any>[]
}

const isCommand = (obj: Tween<any> | TweenCommand): obj is TweenCommand => (<TweenCommand>obj).mode !== undefined

const getExistingOnComplete = (tween: Tween<any>) => {
    // @ts-ignore
    const onComplete = tween._onCompleteCallback
    return onComplete || (() => {})
}

// this function can be solved in O(n)
export const chainTweens = (...objs: (Tween<any> | TweenCommand)[]) => {
    const batches: TweenBatch[] = []

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]
        if (isCommand(obj)) {
            batches.push({ ...obj, tweens: [] })
        } else {
            const batch = batches[batches.length - 1]
            batch.tweens.push(obj)
        }
    }

    let batchPrev: TweenBatch | undefined

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        if (batch.mode === 'sequential') {
            for (let j = 0; j < batch.tweens.length - 1; j++) {
                const tween = batch.tweens[j]
                const tweenNext = batch.tweens[j + 1]
                // @ts-ignore : decorate existing callback
                const onComplete = getExistingOnComplete(tween)
                tween.onComplete(() => {
                    onComplete()
                    tweenNext.start()
                })
            }
            if (batchPrev) {
                const lastTween = batchPrev.tweens[batchPrev.tweens.length - 1]
                const onComplete = getExistingOnComplete(lastTween)
                lastTween.onComplete(() => {
                    onComplete()
                    batch.tweens[0].start()
                })
            } else {
                batch.tweens[0].start()
            }
        } else if (batch.mode === 'parallel') {
            if (batchPrev) {
                const lastTween = batchPrev.tweens[batchPrev.tweens.length - 1]
                const onComplete = getExistingOnComplete(lastTween)
                lastTween.onComplete(() => {
                    onComplete()
                    batch.tweens.forEach((el) => {
                        el.start()
                    })
                })
            } else {
                batch.tweens.forEach((el) => {
                    el.start()
                })
            }
        }
        batchPrev = batch
    }
}