import { Howl, Howler } from 'howler'

export default class Audio {
    static audioPlayAllowed = false

    static playMusic(assetMusicName: string, volume?: number, seek?: number) {
        const music = AssetsStorage.getAsset<Howl>(assetMusicName)
        if (!music.playing()) {
            music.play()
            music.loop(true)
            if (volume) music.volume(volume)
            if (seek) music.seek(seek)
        }
    }

    static stopMusic(assetMusicName: string) {
        const music = AssetsStorage.getAsset<Howl>(assetMusicName)
        if (music.playing()) {
            music.stop()
        }
    }

    static playSound(assetSoundName: string, volume: number = 1.0, rate: number|number[] = 1.0) {
        if (!this.audioPlayAllowed) {
            if (Howler.ctx.state === 'running') {
                this.audioPlayAllowed = true
            }
        }

        if (this.audioPlayAllowed) {
            const sound = AssetsStorage.getAsset<Howl>(assetSoundName)
            const soundId = sound.play()

            sound.volume(volume, soundId)

            if (Array.isArray(rate)) {
                const randomRate = rate[Math.floor(Math.random() * rate.length)]
                sound.rate(randomRate, soundId)
            } else {
                sound.rate(rate, soundId)
            }
        }
    }
}
