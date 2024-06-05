import { IPointData } from '@pixi/math'

export default class Vector {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static new(x: number, y: number) {
        return new Vector(x, y)
    }

    static fromPoint(point: IPointData) {
        return new Vector(point.x, point.y)
    }

    get length() {
        return Number(
            Math.sqrt(this.x ** 2 + this.y ** 2).toFixed(5)
        )
    }

    angle() {
        return Math.atan2(this.y, this.x) + Math.PI
    }

    copyFrom(point: IPointData) {
        this.x = point.x
        this.y = point.y
        return this
    }

    set(x: number, y: number) {
        this.x = x
        this.y = y
    }


    normalize() {
        const mag = this.length
        if (mag === 0) return this

        this.x /= mag
        this.y /= mag
        return this
    }

    inverse() {
        this.x = -this.x
        this.y = -this.y
        return this
    }


    rotate(angle: number) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        this.x = x
        return this
    }

    add(vec: IPointData) {
        this.x += vec.x
        this.y += vec.y
        return this
    }

    sub(vec: IPointData) {
        this.x -= vec.x
        this.y -= vec.y
        return this
    }

    mulScalar(n: number) {
        this.x *= n
        this.y *= n
        return this
    }

    divScalar(n: number) {
        this.x /= n
        this.y /= n
        return this
    }

    copy() {
        return new Vector(this.x, this.y)
    }
}