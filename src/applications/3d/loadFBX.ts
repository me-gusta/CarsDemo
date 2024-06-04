import { Group } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ILoadingData } from './ThreeLoader'
import { setDataUri, toUint8Array } from 'src/utils/base64utils'

const loader = new FBXLoader()

const loadFBX = (name: string, dataURI: string): ILoadingData<Group> => {
    const promise = new Promise<Group>((resolve) => {
        resolve(loader.parse(toUint8Array(setDataUri(dataURI, '')).buffer, '/'))
    })
    return { name, promise }
}

export default loadFBX
