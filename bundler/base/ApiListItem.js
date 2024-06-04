// @ts-check
/** @type {import('./types').IApiListItemOptions} */
export default class ApiListItem {
    /** @param {import('./types').IApiListItemOptions} options */
    constructor(options) {
        this.prefix = options.prefix ?? 'dev'
        this.apiName = options.apiName ?? 'dev'
        this.meta = options.meta ?? ''
        this.script = options.script ?? ''
        this.includeScript = options.includeScript ?? true
        this.packZip = options.packZip ?? false
        this.replacements = options.replacements ?? ['default', 'default']
    }
}
