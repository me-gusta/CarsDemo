export interface ITextureGenerationNode {
    use(
        canvasArray: HTMLCanvasElement[],
        contextArray: CanvasRenderingContext2D[],
    ): void
}

export default class TextureGenerator {
    public static create(width: number, height: number, count: number) {
        const arr: HTMLCanvasElement[] = []
        for (let i = 0; i < count; i++) {
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            arr.push(canvas)
        }
        return new TextureGenerator(arr)
    }

    public static createFromCanvas(...canvas: HTMLCanvasElement[]) {
        return new TextureGenerator(canvas)
    }

    private canvasAray: HTMLCanvasElement[] = []
    private contextArray: CanvasRenderingContext2D[] = []
    private nodes: ITextureGenerationNode[] = []

    private constructor(canvasAray: HTMLCanvasElement[]) {
        canvasAray.forEach((canvas) => {
            const context = canvas.getContext('2d')!
            this.canvasAray.push(canvas)
            this.contextArray.push(context)
        })
    }

    public addNode(node: ITextureGenerationNode) {
        this.nodes.push(node)
        return this
    }

    public generate() {
        this.nodes.forEach((node) => node.use(this.canvasAray, this.contextArray))
        return this.canvasAray
    }
}
