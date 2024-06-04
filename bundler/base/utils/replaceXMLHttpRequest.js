// @ts-check

/** @param {string} data */
const ReplaceXMLHttpRequest = (data) => (
    data.replaceAll(/XMLHttpRequest/g, 'XMLFix')
)

export default ReplaceXMLHttpRequest
