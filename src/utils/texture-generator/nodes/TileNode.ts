import { ITextureGenerationNode } from '../TextureGenerator'

export default class TileNode implements ITextureGenerationNode {
    constructor(
        private startAngle: number,
        private index: number,
    ) {}

    public use(canvas: HTMLCanvasElement[], context: CanvasRenderingContext2D[]) {
        const { width, height } = canvas[this.index]

        const segmentW = width / 2
        const segmentH = height / 2

        const image = document.createElement('canvas')
        image.width = segmentW
        image.height = segmentH
        const iContext = image.getContext('2d')!
        iContext.translate(segmentW / 2, segmentH / 2)
        iContext.rotate(this.startAngle)
        iContext.drawImage(canvas[this.index], -segmentW / 2, -segmentH / 2, segmentW, segmentH)

        context[this.index].fillRect(0, 0, width, height)

        context[this.index].drawImage(image, 0, 0, segmentW, segmentH)

        context[this.index].translate(width, 0)
        context[this.index].scale(-1, 1)
        context[this.index].drawImage(image, 0, 0, segmentW, segmentH)

        context[this.index].translate(0, height)
        context[this.index].scale(1, -1)
        context[this.index].drawImage(image, 0, 0, segmentW, segmentH)

        context[this.index].translate(width, 0)
        context[this.index].scale(-1, 1)
        context[this.index].drawImage(image, 0, 0, segmentW, segmentH)

        context[this.index].resetTransform()
    }
}
