import { Texture, TextureLoader } from 'three'
import { ILoadingData } from './ThreeLoader'

const loader = new TextureLoader()

const loadTexture = (name: string, dataURI: string): ILoadingData<Texture> => {
    const promise = loader.loadAsync(dataURI)
    return { name, promise }
}

export default loadTexture
