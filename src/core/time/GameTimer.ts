export default class GameTimer {
    constructor(
        public callback: Function,
        public msecond: number,
    ) {}

    public complete() {
        this.callback()
        this.msecond = 0
    }

    public update(deltaTime: number) {
        if (this.msecond > 0) {
            this.msecond -= deltaTime
            if (this.msecond <= 0) {
                this.complete()
            }
        }
    }

    public getIsComplete() {
        return this.msecond <= 0
    }
}
