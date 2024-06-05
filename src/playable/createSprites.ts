import { Graphics } from '@pixi/graphics'
import { createSprite } from 'src/utils/Utility'
import ContainerChain from './lib/ContainerChain'
import { HEIGHT_PARKING_LINE, WIDTH_PARKING_LINE } from './math'

export const createSpriteParkingLine = () => {
    const container = new ContainerChain()
        .pushChild(
            new Graphics()
                .beginFill(0xffffff)
                .drawRect(-WIDTH_PARKING_LINE / 2, 0, WIDTH_PARKING_LINE, HEIGHT_PARKING_LINE),
        )

    const roundRect = createSprite('round_rect')
    roundRect.scale.set(0.5)
    roundRect.position.set(-WIDTH_PARKING_LINE, HEIGHT_PARKING_LINE - 5)
    container.addChild(roundRect)

    return container
}

export const createSpriteParkingSymbol = (color: number) => {
    const sprite = createSprite('parking')
    sprite.tint = color
    sprite.anchor.set(0.5)
    return sprite
}

