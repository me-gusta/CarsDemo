import { Graphics } from '@pixi/graphics'
import ContainerChain from './lib/ContainerChain'

export default class ContainerBgColor extends ContainerChain {
    color: number
    bg: Graphics

    constructor(color: number) {
        super()

        this.color = color
        this.bg = new Graphics()
            .beginFill(this.color)
            .drawRect(0, 0, 1, 1)
            .endFill()
        this.pushChild(this.bg)
    }

    resize(width: number, height: number) {
        this.bg.clear()
            .beginFill(this.color)
            .drawRect(0, 0, width, height)
            .endFill()
    }
}