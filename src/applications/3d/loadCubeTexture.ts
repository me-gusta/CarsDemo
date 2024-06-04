import { CubeTexture, CubeTextureLoader } from 'three'
import { ILoadingData } from './ThreeLoader'

const loader = new CubeTextureLoader()

const loadCubeTexture = (name: string, dataURI: string[]): ILoadingData<CubeTexture> => {
    const promise = loader.loadAsync(dataURI as any)
    return { name, promise }
}

export default loadCubeTexture
