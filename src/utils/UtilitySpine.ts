import { Sprite } from '@pixi/sprite'
import { Container } from '@pixi/display'
import { Spine } from '@pixi-spine/runtime-4.1'

interface IAttachedSpriteData {
    container: Container,
    sprite: Sprite,
    bone: any,
}

interface ISpineWithPlugin extends Spine {
    pluginAttachedSprite?: SpinePluginAttachedSprite
}

export const createSpine = (spineName: string) => {
    const spine = new Spine(AssetsStorage.getAsset(spineName))
    spine.autoUpdate = false
    return spine
}

export const logSpine = (spine: Spine) => {
    let out = 'animations:\n'
    for (let i = 0; i < spine.spineData.animations.length; i++) {
        out += `\t${spine.spineData.animations[i].name}\n`
    }
    // eslint-disable-next-line no-console
    console.log(out)
    out = 'slots:\n'
    for (let i = 0; i < spine.spineData.slots.length; i++) {
        out += `\t${spine.spineData.slots[i].name}\n`
    }
    // eslint-disable-next-line no-console
    console.log(out)
    out = 'skins:\n'
    for (let i = 0; i < spine.spineData.skins.length; i++) {
        out += `\t${spine.spineData.skins[i].name}\n`
    }
    // eslint-disable-next-line no-console
    console.log(out)
}

class SpinePluginAttachedSprite {
    spine: Spine
    attachedSpritesDatas: IAttachedSpriteData[] = []
    superUpdate: Function
    constructor(spine: Spine) {
        this.spine = spine
        this.superUpdate = spine.update
        spine.update = this.update.bind(this)
    }

    update(deltaTime: number) {
        this.superUpdate.call(this.spine, deltaTime)
        for (let i = 0; i < this.attachedSpritesDatas.length; i++) {
            const attachedSprite = this.attachedSpritesDatas[i]
            attachedSprite.container.transform.setFromMatrix(attachedSprite.bone.matrix)
        }
    }

    addSprite(sprite: Sprite, slotName: string) {
        this.removeSprite(sprite)

        const slotIndex = this.spine.skeleton.findSlotIndex(slotName)
        const attachContainer = new Container()
        attachContainer.addChild(sprite)
        const slotContainer = this.spine.slotContainers[slotIndex]
        slotContainer.addChild(attachContainer)
        const { bone } = this.spine.skeleton.slots[slotIndex]
        this.attachedSpritesDatas.push({
            container: attachContainer,
            bone,
            sprite,
        })
    }

    removeSprite(sprite: Sprite) {
        const i = this.attachedSpritesDatas.findIndex((attachedSprite) => (attachedSprite.sprite === sprite))
        if (i !== -1) {
            const removeAttachedSprite = this.attachedSpritesDatas[i]
            removeAttachedSprite.container.destroy()
            this.attachedSpritesDatas.splice(i, 1)
        }
    }
}

export const spineAttachSprite = (spine: ISpineWithPlugin, sprite: Sprite, slotName: string) => {
    if (!spine.pluginAttachedSprite) {
        spine.pluginAttachedSprite = new SpinePluginAttachedSprite(spine)
    }
    spine.pluginAttachedSprite.addSprite(sprite, slotName)
}

export const spineDetachSprite = (spine: ISpineWithPlugin, sprite: Sprite) => {
    if (spine.pluginAttachedSprite) {
        spine.pluginAttachedSprite.removeSprite(sprite)
    }
}
