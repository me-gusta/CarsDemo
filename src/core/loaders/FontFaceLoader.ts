import AbstractAssetsLoader from './AbstractAssetsLoader'

const loadFontFace = (name: string, dataURI: string) => {
    const stringBase64 = dataURI.replace(/data:(.+);base64,/, '')
    const binaryFontData = Uint8Array.from(window.atob(stringBase64), (c) => c.charCodeAt(0))
    const fontFace = new FontFace(name, binaryFontData)
    fontFace.load().then(() => { (document.fonts as any).add(fontFace) })
    return fontFace
}

export default class FontFaceLoader extends AbstractAssetsLoader {
    public onComplete: Function | null = null

    private fonts: FontFace[] = []

    public addFont(name: string, dataURI: string) {
        this.fonts.push(loadFontFace(name, dataURI))
    }

    public init() {
        if (this.fonts.length === 0) {
            this.complete()
            return
        }

        const promises = this.fonts.map((font) => font.loaded)
        Promise.all(promises).then(() => {
            this.complete()
            this.fonts = null!
        })
    }
}
