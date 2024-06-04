import { IPointData } from '@pixi/math'

export const WIDTH_PARKING_LINE = 8

// assuming that screen dimensions would not change
export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight
export const IS_SCREEN_V = HEIGHT > WIDTH

const getNormalizedAspectRatio = () => {
    const aspect_ratio = HEIGHT / WIDTH
    const minAspectRatio = 0.4
    const maxAspectRatio = 2

    return Math.max(0.1, Math.min(1, (Math.log(aspect_ratio) - Math.log(minAspectRatio)) / (Math.log(maxAspectRatio) - Math.log(minAspectRatio))))
}

const spanInRange = (valueHorizontal: number, valueVertical: number) => {
    // get dynamic value from valueHorizontal to valueVertical linearly basing of aspect ratio
    const normalized_aspect_ratio = getNormalizedAspectRatio()
    return (1 - normalized_aspect_ratio) * valueHorizontal + normalized_aspect_ratio * valueVertical
}

export const getParkingSize = () => {
    const heightParking = spanInRange(HEIGHT * 0.26, HEIGHT * 0.5)
    const widthParkingLot = spanInRange(HEIGHT / 5, WIDTH / 4.3)

    const marginLeftParking = (WIDTH - widthParkingLot * 4) / 2 - WIDTH_PARKING_LINE / 2

    return {
        heightParking,
        widthParkingLot, // width of parking lot
        marginLeftParking // free space on the left
    }
}
export const getPositionParked = (n_slot: number): IPointData => {
    const { heightParking, widthParkingLot, marginLeftParking } = getParkingSize()

    return {
        x: marginLeftParking + widthParkingLot / 2 + n_slot * widthParkingLot + WIDTH_PARKING_LINE / 2,
        y: heightParking - (widthParkingLot / 2)
    }
}
export const getPositionActive = (n_slot: number): IPointData => {
    const { widthParkingLot, marginLeftParking } = getParkingSize()

    return {
        x: marginLeftParking + n_slot * widthParkingLot + WIDTH_PARKING_LINE / 2,
        y: spanInRange((9 * HEIGHT / 11), (4 * HEIGHT / 5))
    }
}