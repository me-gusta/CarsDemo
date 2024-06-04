import { BaseTexture, Texture } from '@pixi/core'
import { Point } from '@pixi/math'
import { Container } from '@pixi/display'
import { upgradeConfig, Emitter, EmitterConfigV1, EmitterConfigV2 } from '@pixi/particle-emitter'

export interface IParticleEmitterParams {
    textures: (Texture | BaseTexture)[]
    target?: Container
    offset?: Point
    autoupdate?: boolean
    emit?: boolean
}

export default class ParticleEmitter extends Container {
    private emitter: Emitter
    private updateRef: (...args: any[]) => any

    public offset: Point
    public target?: Container

    constructor(config: EmitterConfigV1 | EmitterConfigV2, params: IParticleEmitterParams) {
        super()

        const autoupdate = params.autoupdate ?? true
        const textures: Texture[] = params.textures.map((texture) => (
            texture instanceof BaseTexture ? new Texture(texture) : texture
        ))

        this.emitter = new Emitter(this, upgradeConfig(config, textures))
        this.emitter.emit = params.emit ?? true
        this.target = params.target
        this.offset = params.offset ?? new Point()

        this.updateRef = () => { this.update(Time.deltaTime) }
        if (autoupdate) { App.ticker.add(this.updateRef) }
    }

    /** Проигрывает один раз */
    public playOnce(): void {
        this.emitter.playOnce()
    }

    /** Спавнит определённое количество партиклов */
    public playCount(count: number): void {
        for (let i = 0; i < count; i++) {
            this.emitter.emitNow()
        }
    }

    /** Работает только если target не установлен */
    public setSpawnPosition(point: Point): void {
        this.emitter.spawnPos.copyFrom(point)
    }

    /** Остановит спавн новых частиц и вызовет destroy, когда оставшиеся частицы исчезнут */
    public smoothDestroy(): void {
        this.emitter.emit = false
        Time.setTimeout(
            this.destroy.bind(this),
            this.emitter.maxLifetime * 1000,
        )
    }

    public destroy(): void {
        App.ticker.remove(this.updateRef)
        this.emitter.destroy()
        super.destroy()
    }

    public update(deltaTime: number): void {
        if (!this.emitter.destroyed) {
            if (this.target) this.emitter.spawnPos.copyFrom(this.toLocal(this.offset, this.target))
            this.emitter.update(deltaTime / 1000)
        }
    }
}
