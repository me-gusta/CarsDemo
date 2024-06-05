import { AssetsLoadFunction } from 'src/core/loaders/AbstractAssetsLoader'
import PixiLoader from './applications/2d/PixiLoader'

import ssJson from 'assets/ss/main/ss_main.json'
import ssUri from 'assets/ss/main/ss_main.png'
import loadSpritesheet from './applications/2d/loadSpritesheet'
import AudioLoader from './core/loaders/AudioLoader'
import webpackImportAll from './core/loaders/webpackImportAll'

const audios = webpackImportAll(require.context('/assets/audio', false, /\.(mp3)$/))

const assetsLoad: AssetsLoadFunction = () => {
    const pixiLoader = new PixiLoader()
    pixiLoader.addTexture(loadSpritesheet(ssUri, ssJson))

    const audioLoader = new AudioLoader()
    audios.forEach(({ name, uri }) => audioLoader.addAudio(name, uri))

    return [pixiLoader, audioLoader]
}

export default assetsLoad
