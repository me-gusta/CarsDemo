import { IPointData, Rectangle } from '@pixi/math'

export const WIDTH_PARKING_LINE = 8 // random value which looks
export const HEIGHT_PARKING_LINE = 2000 // random value which is larger than any screen

export const getParkingDimentions = (width: number, height: number, pxMargin: number, percentScaleHeight: number) => {
    const heightParking = height * percentScaleHeight
    const widthParkingLot = (width - 2 * pxMargin) / 4

    return {
        heightParking,
        widthParkingLot, // width of parking lot
    }
}

export function calculateDistance(a: IPointData, b: IPointData) {
    const deltaX = b.x - a.x
    const deltaY = b.y - a.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

export function findParallelPoints(a: IPointData, b: IPointData, distance: number) {
    const dx = b.x - a.x
    const dy = b.y - a.y

    // Calculate the length of the original line segment AB
    const length = Math.sqrt(dx * dx + dy * dy)

    // Normalize the perpendicular direction vector
    const perpX = (dy / length) * distance
    const perpY = (-dx / length) * distance

    // Calculate the parallel points
    const m1 = { x: a.x + perpX, y: a.y + perpY }
    const m2 = { x: b.x + perpX, y: b.y + perpY }

    // If you want the other side of the parallel line, you can subtract instead
    const n1 = { x: a.x - perpX, y: a.y - perpY }
    const n2 = { x: b.x - perpX, y: b.y - perpY }

    return { m1, m2, n1, n2 }
}

export const isPointInRect = ({ x, y, width, height }: Rectangle, point: IPointData) => (
    (point.x > x && point.x < x + width) && (point.y > y && point.y < y + height)
)

function doLinesIntersect(p1: IPointData, p2: IPointData, p3: IPointData, p4: IPointData) {
    function crossProduct(a: IPointData, b: IPointData) {
        return a.x * b.y - a.y * b.x
    }

    function subtract(a: IPointData, b: IPointData) {
        return { x: a.x - b.x, y: a.y - b.y }
    }

    const r = subtract(p2, p1)
    const s = subtract(p4, p3)
    const rCrossS = crossProduct(r, s)
    const qMinusP = subtract(p3, p1)
    const t = crossProduct(qMinusP, s) / rCrossS
    const u = crossProduct(qMinusP, r) / rCrossS

    if (rCrossS !== 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: p1.x + t * r.x,
            y: p1.y + t * r.y,
        }
    }

    return null
}

export function findIntersections(pathA: IPointData[], pathB: IPointData[]) {
    for (let i = 0; i < pathA.length - 1; i++) {
        for (let j = 0; j < pathB.length - 1; j++) {
            const intersection = doLinesIntersect(pathA[i], pathA[i + 1], pathB[j], pathB[j + 1])
            if (intersection) {
                return [
                    pathA.slice(0, i + 1).concat(intersection),
                    pathB.slice(0, j + 1).concat(intersection),
                ]
            }
        }
    }

    return null
}