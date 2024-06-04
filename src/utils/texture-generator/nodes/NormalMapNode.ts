import { ITextureGenerationNode } from '../TextureGenerator'

export default class NormalMapNode implements ITextureGenerationNode {
    constructor(
        private index: number,
    ) {}

    public use(canvas: HTMLCanvasElement[], context: CanvasRenderingContext2D[]) {
        const { width, height } = canvas[this.index]
        const imageData = new ImageData(width, height)
        const src = context[this.index].getImageData(0, 0, width, height)
        const length = width * height * 4

        for (let i = 0; i < length; i += 4) {
            // eslint-disable-next-line one-var, one-var-declaration-per-line
            let x1, x2, y1, y2
            if (i % (width * 4) === 0) {
                // left edge
                x1 = src.data[i]
                x2 = src.data[i + 4]
            } else
            if (i % (width * 4) === (width - 1) * 4) {
                // right edge
                x1 = src.data[i - 4]
                x2 = src.data[i]
            } else {
                x1 = src.data[i - 4]
                x2 = src.data[i + 4]
            }

            if (i < width * 4) {
                // top edge
                y1 = src.data[i]
                y2 = src.data[i + width * 4]
            } else
            if (i > width * (height - 1) * 4) {
                // bottom edge
                y1 = src.data[i - width * 4]
                y2 = src.data[i]
            } else {
                y1 = src.data[i - width * 4]
                y2 = src.data[i + width * 4]
            }

            imageData.data[i] = (x1 - x2) + 127
            imageData.data[i + 1] = (y1 - y2) + 127
            imageData.data[i + 2] = 255
            imageData.data[i + 3] = 255
        }

        context[this.index].putImageData(imageData, 0, 0)
    }
}
