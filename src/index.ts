import './core/App'
import './core/time/Time'
import './core/AssetsStorage'
import './utils/tweenAsyncPatch'
import Game from './core/Game'
import assetsLoad from './assetsLoad'
import Scene2d from './Scene2d'
import App2d from './applications/2d/App2d'

// eslint-disable-next-line no-console
console.log(`Utility ${BUILD.packageVersion}`)

const modules = {
    '2d': new App2d(Scene2d, {
        backgroundAlpha: 1,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
    }),
}

App.setModules({ modules })
App.mount = () => {
    const root = document.getElementById('root')!
    root.appendChild(App.modules['2d'].view)
}

const game = new Game()
window.onload = () => game.init(assetsLoad)

declare global {
    namespace __GlobalMixins {
        interface IModulesList extends Readonly<typeof modules> {}
    }
}
