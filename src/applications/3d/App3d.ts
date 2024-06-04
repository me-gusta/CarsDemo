import './threeObjectResolvePatch'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { IApplicationModule } from '../types'
import { isDebug } from 'src/UrlParams'
import FreeCamera from './FreeCamera'

export interface IScene3d extends Scene {
    start(): void
    update(deltaTime: number): void
    resize(width: number, height: number, dpr: number): void
}

export interface IScene3dConctructor {
    new (): IScene3d
}

const isMobile = /Android|iPhone/i.test(navigator.userAgent)

const getModifiedPixelRatio = () => {
    let ratio = window.devicePixelRatio
    if (isMobile && ratio !== 1) ratio *= 0.5
    return ratio
}

export default class App3d implements IApplicationModule {
    public renderer = new WebGLRenderer()
    public view = this.renderer.domElement
    public camera = new PerspectiveCamera()
    public targetCamera = this.camera

    public SceneConstructor: IScene3dConctructor
    public scene!: IScene3d

    constructor(sceneConstructor: IScene3dConctructor) {
        this.SceneConstructor = sceneConstructor
    }

    public init() {
        if (isDebug) FreeCamera.use()
        this.scene = new this.SceneConstructor()
    }

    public start() {
        this.scene.start()
    }

    public render() {
        this.renderer.render(this.scene, this.targetCamera)
    }

    public update(deltaTime: number) {
        this.scene.update(deltaTime)
    }

    public resize(width: number, height: number) {
        const dpr = getModifiedPixelRatio()

        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(dpr)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.scene?.resize(width, height, dpr)
    }
}
