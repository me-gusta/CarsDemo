import { PerspectiveCamera } from 'three'
import KeyboardControls from './controls/KeyboardControls'
import PointerRotationControls from './controls/PointerRotationControls'
import App3d from './App3d'

export default class FreeCamera extends PerspectiveCamera {
    public static use() {
        return new FreeCamera((App as any).modules['3d'])
    }

    private keyboardControls = new KeyboardControls(this)
    private pointerRotationControls = new PointerRotationControls(this).connect()

    private constructor(app3d: App3d) {
        super()

        document.body.addEventListener('keydown', (event) => {
            if (event.code === 'KeyF') {
                if (app3d.targetCamera === this) {
                    app3d.targetCamera = app3d.camera
                    this.keyboardControls.isActive = false
                    this.pointerRotationControls.isActive = false
                } else {
                    app3d.targetCamera = this
                    this.aspect = app3d.camera.aspect
                    this.updateProjectionMatrix()
                    this.keyboardControls.isActive = true
                    this.pointerRotationControls.isActive = true
                    document.exitPointerLock()
                }
            }
        })
    }
}
