export default class DocumentResizer {
    private static _size = { width: 16, height: 16 }

    public static get size(): Readonly<{ width: number, height: number }> {
        return this._size
    }

    public static resize(width: number, height: number) {
        this._size.width = width
        this._size.height = height
        document.body.style.width = `${width}px`
        document.body.style.height = `${height}px`
    }
}
