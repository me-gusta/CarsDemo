export default class Pointer {
    public isMoved = false
    public id = 0
    public x = 0
    public y = 0

    private setPosition(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public start(id: number, x: number, y: number) {
        this.isMoved = false
        this.id = id
        this.setPosition(x, y)
    }

    public move(x: number, y: number) {
        this.isMoved = true
        this.setPosition(x, y)
    }

    public end() {
        this.id = 0
        this.setPosition(0, 0)
    }
}
