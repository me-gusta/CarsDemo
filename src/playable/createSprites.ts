import { Graphics } from '@pixi/graphics'
import { createSprite } from 'src/utils/Utility'
import ContainerChain from './Renderable'

export const createSpriteParkingLine = () => {
    const heightParking = 300
    const container = new ContainerChain()
        .pushChild(
            new Graphics()
                .beginFill(0xffffff)
                .drawRect(0, 0, 8, heightParking),
        )

    const roundRect = createSprite('round_rect')
    roundRect.scale.set(0.5)
    roundRect.position.set(-4, heightParking - 5)
    container.addChild(roundRect)

    return container
}

export const createSpriteParkingSymbol = (color: number) => {
    const sprite = createSprite('parking')
    sprite.tint = color
    sprite.anchor.set(0.5)
    return sprite
}
