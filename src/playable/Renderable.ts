import { Filter } from '@pixi/core'
import { Container, DisplayObject } from '@pixi/display'
import { IPointData } from '@pixi/math'
import { Sprite } from '@pixi/sprite'

// Simple wrapper to support chaining
export default class ContainerChain extends Container {
    setAnchor(...args: number[]) {
        this.children?.forEach((child) => {
            if (!(child instanceof Sprite)) return
            child.anchor.set(...args)
        })
        return this
    }

    setAlpha(arg: number) {
        this.alpha = arg
        return this
    }

    setPosition(x: number, y: number | undefined = undefined) {
        this.position.set(x, y)
        return this
    }

    setPositionPoint(point: IPointData) {
        this.position.copyFrom(point)
        return this
    }

    setRotation(value: number) {
        this.rotation = value
        return this
    }

    setInteractive(value: boolean = true) {
        this.interactive = value
        return this
    }

    // setTint(value: number) {
    //     this.tint = value
    //     return this
    // }

    setFilters(filters: Filter[]) {
        this.filters = filters
        return this
    }

    setScale(valueX: number, valueY: number | undefined = undefined) {
        this.scale.set(valueX, valueY)
        return this
    }

    setScaleByTarget(target: 'height' | 'width', arg: number) {
        // scale so that target is equal to arg
        this.scale.set(arg / this[target])
        return this
    }

    pushChild(...children: Container<any>[]) {
        super.addChild(...children)
        return this
    }

    addTo(parent: Container) {
        parent.addChild(this)
        return this
    }

    // forScreenV() {
    //     // next defined property will be applied only for vertical screens
    //     if (IS_SCREEN_V) return this
    //     return this._buildDummyThis()
    // }

    // forScreenH() {
    //     // next defined property will be applied only for horizontal screens
    //     if (!IS_SCREEN_V) return this
    //     return this._buildDummyThis()
    // }

    _buildDummyThis() {
        // creates a clone object which doesn't allow modification
        return Object.fromEntries(
            Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((prop) => [
                prop, () => this,
            ]),
        )
    }
}