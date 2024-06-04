import type { IPointData } from '@pixi/math'

/* eslint-disable import/prefer-default-export */
/** Устанавливает якорь текстурам, загружаемым в assetsLoad */
export const pixiDefaultTextureAnchor: IPointData = { x: 0, y: 0 }

export const colors = {
    background: 0x545454,
    parking: {
        yellow: 0xffc841,
        red: 0xd1191f,
    },
    debug: 0x65abe8,
}
