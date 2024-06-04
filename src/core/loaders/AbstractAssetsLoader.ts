export type AssetsLoadFunction = () => AbstractAssetsLoader[]
export default abstract class AbstractAssetsLoader {
    private isComplete = false

    public onComplete: Function | null = null

    public abstract init(): void
    public getIsComplete() {
        return this.isComplete
    }

    protected complete() {
        this.isComplete = true
        if (this.onComplete) {
            this.onComplete()
            this.onComplete = null
        }
    }
}
