export interface IApplicationModule {
    view: HTMLCanvasElement
    renderer: any
    init(): void
    start(): void
    update(deltaTime: number): void
    resize(width: number, height: number): void
    render(): void
}
