import Blowfish from 'blowfish-resizer'

export const editorConfFloat = (value: number = 0.5, range?: number) => ({
    value,
    editor: range ? { min: -range, max: range, step: 0.001 } : { min: 0, max: 1, step: 0.001 },
    interpolation: Blowfish.Interpolation.Lerp,
})

export const editorConfBoolean = (value: boolean = false) => ({ value }) 
