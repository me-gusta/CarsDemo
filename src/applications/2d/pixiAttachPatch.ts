import { Container, DisplayObject } from '@pixi/display'

declare module '@pixi/display' {
    interface Container<T extends DisplayObject = DisplayObject> {
        attach(object: T): T
        attachAt(object: T, index: number): T
    }
}

const _point = { x: 0, y: 0 }

Container.prototype.attach = function attach(object: DisplayObject) {
    const p = this.toLocal(_point, object)
    const matrix1 = object.worldTransform.clone()
    const matrix2 = this.worldTransform.clone()
    matrix1.append(matrix2.invert())
    this.addChild(object)
    object.transform.setFromMatrix(matrix1)
    object.position.set(p.x, p.y)
    return object
}

Container.prototype.attachAt = function attachAt(object: DisplayObject, index: number) {
    const p = this.toLocal(_point, object)
    const matrix1 = object.worldTransform.clone()
    const matrix2 = this.worldTransform.clone()
    matrix1.append(matrix2.invert())
    this.addChildAt(object, index)
    object.transform.setFromMatrix(matrix1)
    object.position.set(p.x, p.y)
    return object
}
