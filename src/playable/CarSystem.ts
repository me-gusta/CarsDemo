type CarSystemState = 'idle' | 'process' | 'finished'

export default class CarSystem {
    switchState(to: CarSystemState, args: any = {}) {
        this.clearState()
        this.state = to

        switch (to) {
            case "idle": {
                this.clearState = () => {
                }
                break
            }
            case "process": {
                const { path }: { path: Point[] } = args
                let positionPrevious = new Point().copyFrom(this.rCar.position)
                const tween = new TWEEN.Tween(this.rCar.position)
                    .to({
                        x: path.map(p => p.x),
                        y: path.map(p => p.y)
                    }, 2000)
                    .easing(TWEEN.Easing.Linear.None)
                    .interpolation(TWEEN.Interpolation.CatmullRom)
                    .onUpdate(positionNew => {
                        const velocity = new Point(
                            positionNew.x - positionPrevious.x,
                            positionNew.y - positionPrevious.y
                        )
                        positionPrevious.copyFrom(positionNew)
                        this.rCar.rotation = Math.atan2(-velocity.x, velocity.y)
                    })
                    .start()
                this.clearState = () => {
                    tween.stop()
                }
                break
            }
            case "finished": {
                const { positionBumpFrom }: { positionBumpFrom: Point } = args
                const posA = this.rCar.position
                const posB = positionBumpFrom
                const velocity = new Vector(
                    posA.x - posB.x,
                    posA.y - posB.y
                ).normalize().mulScalar(60).add(posA)

                const rotation_initial = this.rCar.rotation
                const rotation_scale = Math.round(Math.random()) ? 1 : -1

                new TWEEN.Tween(this.rCar.position)
                    .to(velocity, 400)
                    .easing(TWEEN.Easing.Quartic.Out).start()

                new TWEEN.Tween({ rotation: rotation_initial })
                    .to({ rotation: rotation_initial + rotation_scale * Math.PI / 4 }, 500)
                    .onUpdate(rotationNew => {
                        this.rCar.rotation = rotationNew.rotation
                    })
                    .easing(TWEEN.Easing.Quartic.Out).start()
                this.clearState = () => {
                }
                break
            }
            default: { /* empty */ }
        }
    }
}