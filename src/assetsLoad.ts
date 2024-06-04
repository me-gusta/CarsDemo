import { AssetsLoadFunction } from 'src/core/loaders/AbstractAssetsLoader'
import PixiLoader from './applications/2d/PixiLoader'
import webpackImportAll from './core/loaders/webpackImportAll'
import loadImage from './applications/2d/loadImage'

const textures = webpackImportAll(require.context('assets/textures', false, /\.(png)$/))

// import AudioLoader from './core/loaders/AudioLoader'
// import loadAudio from './core/loaders/loadAudio'
// import webpackImportAll from './core/loaders/webpackImportAll'
// const audios = webpackImportAll(require.context('../assets/audio', false, /\.(mp3)$/))

const assetsLoad: AssetsLoadFunction = () => {
    const pixiLoader = new PixiLoader()
    textures.forEach(({ name, uri }) => pixiLoader.addTexture(loadImage(name, uri)))
    return [pixiLoader]
}

export default assetsLoad
