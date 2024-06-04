import { ITextureGenerationNode } from '../TextureGenerator'

export default class UsereNode implements ITextureGenerationNode {
    constructor(
        private onUse: (
            canvas: HTMLCanvasElement[],
            context: CanvasRenderingContext2D[],
        ) => void,
    ) {}

    public use(canvas: HTMLCanvasElement[], context: CanvasRenderingContext2D[]) {
        this.onUse(canvas, context)
    }
}
