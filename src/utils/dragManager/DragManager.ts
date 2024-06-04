import { Container } from '@pixi/display'
import { InteractionEvent } from '@pixi/interaction'
import { EventEmitter } from '@pixi/utils'
import Pointer from './lib/Pointer'

/**
@example
const point = createTestPoint()
point.interactive = true
const dragManager = new DragManager(point)
dragManager.on('move', ({ x, y }: any) => {
    point.position.set(x, y)
})
point.on('pointerdown', dragManager.onDragStart, dragManager)
point.on('pointermove', dragManager.onDragMove, dragManager)
point.on('pointerup', dragManager.onDragEnd, dragManager)
point.on('pointerupoutside', dragManager.onDragEnd, dragManager)
 */
class DragManager extends EventEmitter {
    /** активен ли хотябы один из объектов класса DragManager */
    public static isActive = false

    private el: Container
    private isDragging = false
    private pointer = new Pointer()

    constructor(el: Container) {
        super()
        this.el = el
    }

    private static isValidCoords(x: number, y: number) {
        const { width, height } = App.screenSize
        return x > 0 && x < width && y > 0 && y < height
    }

    onDragStart({ data }: InteractionEvent) {
        if (data.isPrimary && !DragManager.isActive) {
            DragManager.isActive = true
            this.isDragging = true

            const { x, y } = this.el.parent.toLocal(data.global)

            this.pointer.start(data.identifier, x, y)
            this.emit('start', { identifier: data.identifier, x, y })
        }
    }

    onDragMove({ data }: InteractionEvent) {
        if (this.isDragging && this.pointer.id === data.identifier) {
            const { x: globalX, y: globalY } = data.global
            const { x: localX, y: localY } = this.el.parent.toLocal(data.global)
            const dx = localX - this.pointer.x
            const dy = localY - this.pointer.y

            if (DragManager.isValidCoords(globalX, globalY)) {
                this.pointer.move(localX, localY)
                this.emit('move', { x: localX, y: localY, dx, dy })
            } else {
                this.onDragEnd(null!, true)
            }
        }
    }

    onDragEnd(event: InteractionEvent, isForcibly = false) {
        if (isForcibly || (this.isDragging && this.pointer.id === event.data.identifier)) {
            DragManager.isActive = false
            this.pointer.end()
            this.isDragging = false

            this.emit('end', { isMoved: this.pointer.isMoved })
        }
    }
}

namespace DragManager {
    export const createDefault = (el: Container) => {
        el.interactive = true
        const dragManager = new DragManager(el)
        dragManager.on('move', ({ dx, dy }: any) => {
            el.x += dx
            el.y += dy
        })
        el.on('pointerdown', dragManager.onDragStart, dragManager)
        el.on('pointermove', dragManager.onDragMove, dragManager)
        el.on('pointerup', dragManager.onDragEnd, dragManager)
        el.on('pointerupoutside', dragManager.onDragEnd, dragManager)
    }
}

export default DragManager
