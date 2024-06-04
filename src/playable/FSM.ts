import { EventEmitter } from '@pixi/utils'

export default class FSM extends EventEmitter {
    private clearState: () => void = () => { }
    public state: string

    constructor() {
        super()
        this.state = 'none'
    }

    enableState(
        state: string,
        onEnd = () => { },
    ) {
        console.log('enableState', state)
        this.clearState()
        this.clearState = onEnd
        this.state = state
    }
}