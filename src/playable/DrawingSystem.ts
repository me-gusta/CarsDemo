import { Container } from '@pixi/display'
import { getPositionActive, getPositionParked } from './space'
import { Graphics } from '@pixi/graphics'
import ContainerChain from './Renderable'

export default class DrawingSystem {
    private btnStart: ContainerChain
    private btnEnd: ContainerChain

    constructor(isLeft: boolean, layer: Container) {
        const positionStart = getPositionActive(isLeft ? 1 : 3) // position for moveable car
        const positionEnd = getPositionParked(isLeft ? 2 : 1) // position for parking spot

        const radius = 10
        this.btnStart = new ContainerChain()
            .pushChild(
                new Graphics()
                    .beginFill(0xffffff)
                    .drawCircle(0, 0, radius)
                    .endFill(),
            )
            .setInteractive(true)
            .setPositionPoint(positionStart)
            .addTo(layer)

        this.btnEnd = new ContainerChain()
            .pushChild(
                new Graphics()
                    .beginFill(0xffffff)
                    .drawCircle(0, 0, radius / 1.2)
                    .endFill(),
            )
            .setInteractive()
            .setAlpha(0)
            .setPositionPoint(positionEnd)
            .addTo(layer)
    }
}