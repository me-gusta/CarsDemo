import Uint8ColorTSSL from './Uint8ColorTSSL'

export type IVec2TSSL = { x: number, y: number }

export type ITSSLHandler = (
    color: Uint8ColorTSSL[],
    coord: Readonly<IVec2TSSL>,
    size: Readonly<IVec2TSSL>,
) => void

export default class TSSL {
    private static imageData: ImageData[] | null = null

    public static bindData(imageData: ImageData[] | null) {
        this.imageData = imageData
        return this
    }

    public static use(cb: ITSSLHandler) {
        if (!this.imageData) throw new Error('imageData is null!')

        const data = this.imageData.map((imageData) => imageData.data)
        const { width, height } = this.imageData[0]

        let i = 0

        const colors: Uint8ColorTSSL[] = []

        this.imageData.forEach((imageData, index) => {
            colors[index] = new Uint8ColorTSSL()
        })

        const coord: IVec2TSSL = { x: 0, y: 0 }
        const size: Readonly<IVec2TSSL> = { x: width, y: height }

        const read = () => {
            colors.forEach((color, index) => {
                color.set(
                    data[index][i + 0],
                    data[index][i + 1],
                    data[index][i + 2],
                    data[index][i + 3],
                )
            })
        }

        const write = () => {
            colors.forEach((color, index) => {
                data[index][i + 0] = color.r
                data[index][i + 1] = color.g
                data[index][i + 2] = color.b
                data[index][i + 3] = color.a
            })
        }

        for (;i < data[0].length; i += 4) {
            read()
            const pixelIndex = i / 4
            coord.x = pixelIndex % (width)
            coord.y = Math.floor(pixelIndex / height)
            cb(colors, coord, size)
            write()
        }
    }
}
