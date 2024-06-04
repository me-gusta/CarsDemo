import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ILoadingData } from './ThreeLoader'
import { setDataUri, toUint8Array } from 'src/utils/base64utils'

const loader = new GLTFLoader()

const loadGLTF = (name: string, dataURI: string): ILoadingData<GLTF> => {
    const promise = loader.parseAsync(toUint8Array(setDataUri(dataURI, '')).buffer, '/')
    return { name, promise }
}

export default loadGLTF
