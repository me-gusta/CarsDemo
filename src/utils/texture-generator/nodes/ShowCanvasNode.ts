import { ITextureGenerationNode } from '../TextureGenerator'

export default class ShowCanvasNode implements ITextureGenerationNode {
    constructor(
        private scale: number,
    ) {}

    public use(canvas: HTMLCanvasElement[]) {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.zIndex = '99'
        div.style.display = 'flex'
        div.style.transform = `scale(${this.scale})`

        div.append(...canvas)

        document.body.appendChild(div)
    }
}
