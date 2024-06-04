import { Object3D, Vector3 } from 'three'

const _vector = new Vector3()

export default class KeyboardControls {
    public target: Object3D
    public speed = new Vector3(80, 80, 100)
    public shiftMultiplier = 2
    public isActive = false

    private direction = new Vector3()

    private isMoveForward = false
    private isMoveBackward = false

    private isMoveLeft = false
    private isMoveRight = false

    private isMoveUp = false
    private isMoveDown = false

    private isShiftPressed = false

    private velocity = new Vector3(0, 0, 0)

    constructor(target: Object3D) {
        this.target = target

        document.addEventListener('keydown', this.onKeyDown.bind(this), true)
        document.addEventListener('keyup', this.onKeyUp.bind(this), true)

        App.beforeRender.add(() => this.update(Time.deltaTime))
    }

    private update(deltaTimeMS: number) {
        if (!this.isActive) return

        const deltaTimeSec = deltaTimeMS / 1000

        this.direction.x = Number(this.isMoveRight) - Number(this.isMoveLeft)
        this.direction.y = Number(this.isMoveUp) - Number(this.isMoveDown)
        this.direction.z = Number(this.isMoveForward) - Number(this.isMoveBackward)

        this.direction.normalize().multiply(this.speed).multiplyScalar(deltaTimeSec)

        if (this.isShiftPressed) {
            this.direction.multiplyScalar(this.shiftMultiplier)
        }

        this.velocity.sub(this.direction)

        this.velocity.x -= this.velocity.x * 8.0 * deltaTimeSec
        this.velocity.z -= this.velocity.z * 8.0 * deltaTimeSec
        this.velocity.y -= this.velocity.y * 8.0 * deltaTimeSec

        const { x, y, z } = this.velocity

        this.moveRight(-x * deltaTimeSec)
        this.moveForward(-z * deltaTimeSec)
        this.moveUp(-y * deltaTimeSec)
    }

    private onKeyDown(event: KeyboardEvent) {
        if (!this.isActive) return

        switch (event.code) {
            case 'KeyW':
                this.isMoveForward = true
                event.stopPropagation()
                break;

            case 'KeyA':
                this.isMoveLeft = true
                event.stopPropagation()
                break;

            case 'KeyS':
                this.isMoveBackward = true
                event.stopPropagation()
                break;

            case 'KeyD':
                this.isMoveRight = true
                event.stopPropagation()
                break;

            case 'KeyQ':
                this.isMoveUp = true
                event.stopPropagation()
                break;

            case 'KeyE':
                this.isMoveDown = true
                event.stopPropagation()
                break;

            case 'ShiftLeft':
                this.isShiftPressed = true
                event.stopPropagation()
                break;

            default: break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (!this.isActive) return

        switch (event.code) {
            case 'KeyW':
                this.isMoveForward = false
                event.stopPropagation()
                break;

            case 'KeyA':
                this.isMoveLeft = false
                event.stopPropagation()
                break;

            case 'KeyS':
                this.isMoveBackward = false
                event.stopPropagation()
                break;

            case 'KeyD':
                this.isMoveRight = false
                event.stopPropagation()
                break;

            case 'KeyQ':
                this.isMoveUp = false
                event.stopPropagation()
                break;

            case 'KeyE':
                this.isMoveDown = false
                event.stopPropagation()
                break;

            case 'ShiftLeft':
                this.isShiftPressed = false
                event.stopPropagation()
                break;

            default: break;
        }
    }

    private moveForward(distance: number) {
        // move forward parallel to the xz-plane
        // assumes camera.up is y-up
        const { target } = this
        _vector.setFromMatrixColumn(target.matrix, 0)
        _vector.crossVectors(target.up, _vector)
        target.position.addScaledVector(_vector, distance)
    }

    private moveRight(distance: number) {
        const { target } = this
        _vector.setFromMatrixColumn(target.matrix, 0)
        target.position.addScaledVector(_vector, distance)
    }

    private moveUp(distance: number) {
        const { target } = this
        target.position.y -= distance
    }
}
