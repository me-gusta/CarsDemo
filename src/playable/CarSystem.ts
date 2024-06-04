import { DisplayObject } from '@pixi/display'
import { IPointData, Point } from '@pixi/math'
import FSM from './FSM'
import { Easing, Interpolation, Tween } from 'tween-es'
import Vector from './vector'

export default class CarSystem extends FSM {
    private spriteCar

    constructor(spriteCar: DisplayObject) {
        super()
        this.spriteCar = spriteCar
    }

    toStateIdle() {

    }

    toStateProcess(path: IPointData[]) {
        const positionPrevious = new Point().copyFrom(this.spriteCar.position)
        const tween = new Tween(this.spriteCar.position)
            .to({
                x: path.map((p) => p.x),
                y: path.map((p) => p.y),
            }, 2000)
            .easing(Easing.linear)
            .interpolation(Interpolation.catmullRom)
            .onUpdate((positionNew) => {
                const velocity = new Point(
                    positionNew.x - positionPrevious.x,
                    positionNew.y - positionPrevious.y,
                )
                positionPrevious.copyFrom(positionNew)
                this.spriteCar.rotation = Math.atan2(-velocity.x, velocity.y)
            })
            .start()
        this.enableState(
            'process',
            () => {
                tween.stop()
            },
        )
    }

    toStateFinished(positionBumpFrom: Point) {
        const posA = this.spriteCar.position
        const posB = positionBumpFrom
        const velocity = new Vector(
            posA.x - posB.x,
            posA.y - posB.y,
        ).normalize().mulScalar(60).add(posA)

        const rotationInitial = this.spriteCar.rotation
        const rotationScale = Math.round(Math.random()) ? 1 : -1

        new Tween(this.spriteCar.position)
            .to(velocity, 400)
            .easing(Easing.quadraticOut)
            .start()

        new Tween({ rotation: rotationInitial })
            .to({ rotation: rotationInitial + rotationScale * (Math.PI / 4) }, 500)
            .onUpdate((rotationNew) => {
                this.spriteCar.rotation = rotationNew.rotation
            })
            .easing(Easing.quadraticOut)
            .start()

        this.enableState('finished')
    }
}