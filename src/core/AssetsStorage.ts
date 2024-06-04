class GameAssetsStorage {
    private static readonly assets: Record<string, any> = {}

    static addAssets(name: string, asset: any) {
        if (this.assets[name]) {
            throw new Error(`asset "${name}" already exist`)
        }
        this.assets[name] = asset
    }

    static getAsset<T = any>(name: string) {
        const asset = this.assets[name]
        if (!asset) {
            throw new Error(`can not get asset "${name}"`)
        }
        return asset as T
    }
}

declare global {
    interface Window { AssetsStorage: typeof AssetsStorage }
    const AssetsStorage: typeof GameAssetsStorage
}

window.AssetsStorage = GameAssetsStorage

export default {}
