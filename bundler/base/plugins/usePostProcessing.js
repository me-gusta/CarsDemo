/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/** @param {(args_0: import('webpack').Compilation) => void} callback */
const usePostProcessing = (callback) => ({
    apply: /** @param {import('webpack').Compiler} compiler */ (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', callback)
    },
})

export default usePostProcessing
