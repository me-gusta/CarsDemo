const lazy = <T = any>(getter: () => T) => {
    let value: T | undefined
    const self = {
        get: () => {
            if (!value) {
                value = getter()
                self.get = () => value as T
            }
            return value
        },
    }

    return self
}

export default lazy
