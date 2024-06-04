/* eslint-disable import/extensions */
import * as urlParams from '../../../src/UrlParams.js'

const getAllUrlParams = () => {
    /** @type { string[][] } */
    const params = []
    Object.entries(urlParams).forEach(([key, value], i) => {
        params[i] = [key, value.toString()]
    })
    if (params.length === 0) return ''
    return `?${(new URLSearchParams(params)).toString()}`
}

export default getAllUrlParams
