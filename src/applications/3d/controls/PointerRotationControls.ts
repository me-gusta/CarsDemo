import { Euler, EventDispatcher, Object3D } from 'three'

const _euler = new Euler(0, 0, 0, 'YXZ')
const _PI_2 = Math.PI / 2

export default class PointerRotationControls extends EventDispatcher {
    public target: Object3D
    public isActive = false

    public isPointerActive = false

    private minPolarAngle = 0
    private maxPolarAngle = Math.PI
    private pointerSpeed = 1.0

    private pointerId: number | null = null

    public _onPointerMove = this.onPointerMove.bind(this)
    public _onPointerDownOrUp = this.onPointerDownOrUp.bind(this)
    public _onPointerDown = this.onPointerDown.bind(this)
    public _onPointerUp = this.onPointerUp.bind(this)

    constructor(target: Object3D) {
        super()

        this.target = target
    }

    private onPointerMove(event: PointerEvent) {
        if (!this.isActive) return
        if (!this.isPointerActive) return
        if (event.pointerId !== this.pointerId) return

        const evt = event as PointerEvent & {
            mozMovementX: number,
            mozMovementY: number,
            webkitMovementX: number,
            webkitMovementY: number,
        }

        event.stopPropagation()

        const movementX = event.movementX || evt.mozMovementX || evt.webkitMovementX || 0
        const movementY = event.movementY || evt.mozMovementY || evt.webkitMovementY || 0

        const { target: camera } = this
        _euler.setFromQuaternion(camera.quaternion)
        _euler.y -= movementX * 0.002 * this.pointerSpeed
        _euler.x -= movementY * 0.002 * this.pointerSpeed
        _euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x))
        camera.quaternion.setFromEuler(_euler)
    }

    private onPointerDown(event: PointerEvent) {
        if (this.isActive) {
            this.isPointerActive = true
            this.pointerId = event.pointerId
            event.stopPropagation()
        }
    }

    private onPointerUp(event: PointerEvent) {
        if (this.pointerId === event.pointerId) {
            this.isPointerActive = false
            this.pointerId = null
        }
    }

    private onPointerDownOrUp(event: PointerEvent) {
        if (event.type === 'touchstart' || event.type === 'touchend') return

        this.isPointerActive = event.type === 'pointerdown'

        if (this.isPointerActive) {
            this.pointerId = event.pointerId
        } else {
            this.pointerId = null
        }

        if (this.isActive) event.stopPropagation()
    }

    public connect() {
        document.addEventListener('pointerdown', this._onPointerDownOrUp, true)
        document.addEventListener('pointerup', this._onPointerDownOrUp, true)
        document.addEventListener('pointermove', this._onPointerMove, true)
        return this
    }

    public disconnect() {
        // TODO нужен ли третий аргумент?
        document.removeEventListener('pointerdown', this._onPointerDownOrUp, true)
        document.removeEventListener('pointerup', this._onPointerDownOrUp, true)
        document.removeEventListener('pointermove', this._onPointerMove, true)
        return this
    }

    public dispose() { this.disconnect() }
}
