import TSSL, { ITSSLHandler } from '../tssl/TSSL'
import { ITextureGenerationNode } from '../TextureGenerator'

export default class TSSLNode implements ITextureGenerationNode {
    constructor(
        private onTSSLUse: ITSSLHandler,
    ) {}

    public use(canvasArray: HTMLCanvasElement[], contextArray: CanvasRenderingContext2D[]) {
        const data = canvasArray.map((cvs, index) => (
            contextArray[index].getImageData(0, 0, cvs.width, cvs.height)
        ))

        TSSL.bindData(data)
        TSSL.use(this.onTSSLUse)
        TSSL.bindData(null)

        canvasArray.forEach((cvs, index) => {
            contextArray[index].putImageData(data[index], 0, 0)
        })
    }
}
