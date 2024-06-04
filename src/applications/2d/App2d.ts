import './pixiAttachPatch'
import {
    BatchRenderer,
    extensions as Extensions,
    IRendererOptions,
    Renderer,
} from '@pixi/core'
import { Container } from '@pixi/display'
import { InteractionManager } from '@pixi/interaction'
import { IApplicationModule } from '../types'

export interface IScene2d extends Container {
    start(): void
    update(deltaTime: number): void
    resize(width: number, height: number): void
}

export interface IScene2dConctructor {
    new (): IScene2d
}

export interface IApp2dOptions {
    antialias?: boolean
    resolution?: number
    backgroundAlpha?: number
    backgroundColor?: number
}

export default class App2d implements IApplicationModule {
    public view: HTMLCanvasElement
    public renderer: Renderer
    public stage = new Container<IScene2d>()

    public SceneConstructor: IScene2dConctructor
    public scene!: IScene2d

    constructor(
        sceneConstructor: IScene2dConctructor,
        options?: IApp2dOptions,
    ) {
        this.SceneConstructor = sceneConstructor

        this.view = document.createElement('canvas')
        Extensions.add(BatchRenderer, InteractionManager)

        const renderOptions: IRendererOptions = {
            width: 16,
            height: 16,
            view: this.view,

            antialias: options?.antialias ?? false,
            resolution: options?.resolution,
            backgroundAlpha: options?.backgroundAlpha,
            backgroundColor: options?.backgroundColor,
        }

        this.renderer = new Renderer(renderOptions)
        this.renderer.view.style.position = 'absolute'
        this.renderer.view.style.display = 'block'
    }

    public init() {
        this.scene = new this.SceneConstructor()
        this.stage.addChild(this.scene)
    }

    public start() {
        this.scene.start()
    }

    public render() {
        this.renderer.render(this.stage)
    }

    public update(deltaTime: number) {
        this.scene.update(deltaTime)
    }

    public resize(width: number, height: number) {
        const screenScale = Math.min(width / 960.0, height / 960.0)
        this.stage.scale.set(screenScale, screenScale)

        this.renderer.resize(width, height)
        this.view.style.width = `${width}px`
        this.view.style.height = `${height}px`

        this.scene?.resize(
            Math.ceil(width / screenScale),
            Math.ceil(height / screenScale),
        )
    }
}
