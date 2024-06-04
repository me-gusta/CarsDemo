// import { unzip } from 'unzipit'
import AbstractAssetsLoader from 'src/core/loaders/AbstractAssetsLoader'

// const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
//     let binary = ''
//     const bytes = new Uint8Array(buffer)
//     const len = bytes.byteLength
//     for (let i = 0; i < len; i++) {
//         binary += String.fromCharCode(bytes[i])
//     }
//     return window.btoa(binary)
// }

// promises[i] = new Promise((resolve) => {
//     unzip(arg[i].url).then((value) => {
//         const object = Object.values(value.entries)[0]
//         object.arrayBuffer().then((buffer) => {
//             const str = `data:@file/octet-stream;base64,${arrayBufferToBase64(buffer)}`
//             this.fbxLoader.loadAsync(str).then((group) => { resolve(group) })
//         })
//     })
// })

export interface ILoadingData<T> {
    name: string
    promise: Promise<T>
}
export default class ThreeLoader extends AbstractAssetsLoader {
    private dataset: ILoadingData<any>[] = []

    public init() {
        if (this.dataset.length) this.checkLoad()
        else this.complete()
    }

    public add(loadingData: ILoadingData<any>) {
        this.dataset.push(loadingData)
    }

    private checkLoad() {
        const promises = this.dataset.map((loadingData) => loadingData.promise)
        Promise.all(promises).then((el) => {
            for (let i = 0; i < el.length; i++) {
                AssetsStorage.addAssets(this.dataset[i].name, el[i])
            }
            this.complete()
            this.dataset = null!
        })
    }
}
