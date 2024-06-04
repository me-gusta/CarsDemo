export default class Uint8ColorTSSL {
    private array = new Uint8ClampedArray(4)

    constructor(x = 0, y = x, z = x, w = x) {
        this.array[0] = x
        this.array[1] = y
        this.array[2] = z
        this.array[3] = w
    }

    public get r() { return this.array[0] }
    public set r(value: number) { this.array[0] = value }

    public get g() { return this.array[1] }
    public set g(value: number) { this.array[1] = value }

    public get b() { return this.array[2] }
    public set b(value: number) { this.array[2] = value }

    public get a() { return this.array[3] }
    public set a(value: number) { this.array[3] = value }

    public set(r: number, g: number, b: number, a: number) {
        this.array[0] = r
        this.array[1] = g
        this.array[2] = b
        this.array[3] = a
    }

    public multiplyScalar(m: number) {
        this.array[0] *= m
        this.array[1] *= m
        this.array[2] *= m
        this.array[3] *= m
    }
}
