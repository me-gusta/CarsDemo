import Blowfish from 'blowfish-resizer'

export const defaultParamsCar = (isLeft: boolean) => ({
    x: { value: isLeft ? 0.2 : 0.8, editor: { min: 0, max: 1, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0.8, editor: { min: 0, max: 1, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 2, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
})

export const defaultParamsParkingLine = (n: number) => ({
    x: { value: 0.1 + n * 0.2, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 2.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
})

export const defaultParamsParkingSymbol = (n: number) => ({
    x: { value: 0.18 + n * 0.20, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0.3, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 2.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
})