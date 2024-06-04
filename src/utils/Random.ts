// import * as Random from './utils/Random.js'

/** random float within [minInclusive..maxExclusive) */
export const rangeFloat = (min: number, max: number) => min + Math.random() * (max - min)

/** random int within [minInclusive..maxExclusive) */
export const rangeInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min))

/** random true or false */
export const getRandomBoolean = () => !!rangeInt(0, 2)
