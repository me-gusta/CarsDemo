import { ITextureGenerationNode } from '../TextureGenerator'

export default class DrawImageNode implements ITextureGenerationNode {
    constructor(
        private image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
        private index: number,
        private dx: number,
        private dy: number,
    ) {}

    public use(canvas: HTMLCanvasElement[], context: CanvasRenderingContext2D[]) {
        context[this.index].drawImage(
            this.image,
            0,
            0,
            canvas[this.index].width,
            canvas[this.index].height,
        )
    }
}
