import { EventEmitter } from '@pixi/utils'

export type IObservableModelParam = { [key: string | symbol]: number | string | Boolean }

interface IObservable<TModel extends IObservableModelParam> {
    onChange<TKey extends keyof TModel>(
        key: TKey,
        listener: (value: TModel[typeof key]) => void
    ): (() => void)
    onceChange<TKey extends keyof TModel>(
        key: TKey,
        listener: (value: TModel[typeof key]) => void
    ): void
    offChange<TKey extends keyof TModel>(
        key: TKey,
        listener: (value: TModel[typeof key]) => void
    ): void
}

const mixinObserver = <T extends IObservableModelParam>(model: T, eventEmitter: EventEmitter) => {
    (model as T & IObservable<T>).onChange = (key, listener) => {
        eventEmitter.on(key as any, listener)
        return () => { listener(model[key]) }
    }
    (model as T & IObservable<T>).onceChange = (key, listener) => {
        eventEmitter.once(key as any, listener)
    }
    (model as T & IObservable<T>).offChange = (key, listener) => {
        eventEmitter.off(key as any, listener)
    }
    return model as T & IObservable<T>
}

const observableModel = <T extends IObservableModelParam>(model: T) => {
    const eventEmitter = new EventEmitter()

    const proxyHandler: ProxyHandler<T> = {
        set: (target, p: keyof T, newValue) => {
            target[p] = newValue
            eventEmitter.emit(p as any, newValue)
            return true
        },
    }

    const mixed = mixinObserver(model, eventEmitter)

    return new Proxy(mixed, proxyHandler) as typeof mixed
}

export default observableModel
