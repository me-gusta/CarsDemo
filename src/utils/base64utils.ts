export const toUint8Array = (base64: string) => {
    const binaryString = window.atob(base64)
    const array = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        array[i] = binaryString.charCodeAt(i)
    }
    return array
}

export const setDataUri = (base64: string, dataUri: string) => {
    const regExp = /data:(.*);base64,/
    if (regExp.test(base64)) {
        return base64.replace(regExp, dataUri)
    }
    return dataUri + base64
}
