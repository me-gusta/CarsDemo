import GameTimer from './GameTimer'

class GameTime {
    static isPlayed = true
    static time = 0
    static deltaTime = 0
    static lastTimerId = -1
    static listTimers = new Map<number, GameTimer>()

    /** Вызовет callback спустя msecond */
    static setTimeout(callback: Function, msecond: number) {
        this.lastTimerId++
        this.listTimers.set(this.lastTimerId, new GameTimer(callback, msecond))
        return this.lastTimerId
    }

    /** Останавливает таймер */
    static clearTimeout(timerId: number) {
        return this.listTimers.delete(timerId)
    }

    /** Завершает таймер раньше времени выполняя его функцию */
    static completeTimeout(timerId: number) {
        const timer = this.listTimers.get(timerId)
        if (timer !== undefined) {
            timer.complete()
            return true
        }
        return false
    }

    /** Возвращает оставшееся время */
    static getTime(timerId: number) {
        const timer = this.listTimers.get(timerId)
        if (timer) return timer.msecond
        return -1
    }

    static update(deltaTime: number) {
        this.deltaTime = deltaTime
        this.time += deltaTime

        this.listTimers.forEach((timer, timerId) => {
            timer.update(deltaTime)
            if (timer.getIsComplete()) {
                this.clearTimeout(timerId)
            }
        })
    }
}

declare global {
    interface Window { Time: typeof GameTime }
    const Time: typeof GameTime
}

window.Time = GameTime

export default {}
