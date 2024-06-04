const urlParams = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : null
function getUrlParam(urlParamName, defaultValue) {
    if (urlParams && urlParams.has(urlParamName)) {
        const stringParam = urlParams.get(urlParamName).toLowerCase()
        return (stringParam === 'true' || stringParam === '1')
    }
    return defaultValue
}
const isDevelopment = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined)

// only development (webpack remove if (isDebug) { ... } in production)
const isDebug = isDevelopment ? getUrlParam('isDebug', true) : false

// development and production
const noAudio = getUrlParam('noAudio', false)

export {
    isDebug,
    noAudio,
}
