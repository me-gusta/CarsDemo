import { Container } from '@pixi/display'
import { Graphics } from '@pixi/graphics'
import ContainerChain from './Renderable'
import { IPointData, Point } from '@pixi/math'
import { WIDTH_PARKING_LINE, calculateDistance, findParallelPoints, isPointInRect } from './math'
import { InteractionEvent } from '@pixi/interaction'
import { EventEmitter } from '@pixi/utils'
import FSM from './FSM'

export default class DrawingSystem extends FSM {
    private btnStart: ContainerChain
    private btnEnd: ContainerChain
    private deadZone: ContainerChain
    private path: Graphics
    private layer: Container

    public points: IPointData[] = []

    constructor(layer: Container, layerGround: Container, color: number) {
        super()

        this.btnStart = new ContainerChain()
            .setInteractive(true)
            .setAlpha(0)
            .addTo(layer)

        this.btnEnd = new ContainerChain()
            .setInteractive(true)
            .setAlpha(0)
            .addTo(layer)

        this.deadZone = new ContainerChain()
            .setInteractive(true)
            .addTo(layer)

        this.path = new Graphics()
        layerGround.addChild(this.path)
        this.path.tint = color
        this.layer = layer
        this.toStateIdle()
    }

    toStateIdle() {
        console.log('toStateIdle')
        const cb = () => {
            this.toStateDrawing()
        }
        this.btnStart.addListener('pointerdown', cb)
        this.enableState(
            'idle',
            () => {
                this.btnStart.removeAllListeners()
            },
        )
    }

    toStateDrawing() {
        console.log('toStateDrawing')
        const positionStart = this.btnStart.position
        const radius = this.btnStart.width / 2

        let positionPrevious = new Point().copyFrom(positionStart)
        let points = [new Point().copyFrom(positionStart)]

        const clearLine = () => {
            this.path.clear()
            points = [new Point().copyFrom(positionStart)]
            positionPrevious = new Point().copyFrom(positionStart)
            this.toStateIdle()
        }

        const finish = () => {
            this.toStateFinished(points)
        }

        const addNewPoint = (event: InteractionEvent) => {
            const { data } = event

            const point = this.path.parent.toLocal(data.global)
            const distance = calculateDistance(positionPrevious, point)
            if (distance < radius / 2) return

            points.push(point)
            const {
                m1,
                m2,
                n1,
                n2,
            } = findParallelPoints(point, positionPrevious, radius / 4)

            positionPrevious.copyFrom(point)

            this.path
                .beginFill(0xffffff)
                .drawPolygon([m1, m2, n1])
                .drawPolygon([m2, n1, n2])
                .drawCircle(positionPrevious.x, positionPrevious.y, radius / 4)
                .endFill()

            if (isPointInRect(this.btnEnd.getBounds(), data.global)) {
                finish()
            }
        }

        this.deadZone.addListener('pointerover', clearLine)
        this.layer.addListener('pointermove', addNewPoint)
        this.layer.addListener('pointerup', clearLine)
        this.btnEnd.addListener('pointerout', finish)
        this.enableState(
            'drawing',
            () => {
                this.deadZone.removeListener('pointerover', clearLine)
                this.layer.removeListener('pointermove', addNewPoint)
                this.layer.removeListener('pointerup', clearLine)
                this.btnEnd.removeListener('pointerout', finish)
            },
        )
    }

    toStateFinished(points: Point[]) {
        this.points = points
        this.enableState('finished')
        this.emit('finished')
    }

    resize(
        btnStartPosition: IPointData,
        btnEndPosition: IPointData,
        heightParking: number,
        widthParkingLot: number,
        pxMargin: number,
        widthScreen: number,
        isLeft: boolean,
    ) {
        const widthBoxWide = widthParkingLot * 2 + pxMargin + WIDTH_PARKING_LINE
        const widthBoxNarrow = widthParkingLot + pxMargin + WIDTH_PARKING_LINE
        const widthBoxBottom = widthScreen - btnStartPosition.x

        this.btnStart
            .destroyChildren()
            .pushChild(
                new Graphics()
                    .beginFill(0xffffff)
                    .drawCircle(0, 0, widthParkingLot / 4)
                    .endFill(),
            )
            .setPositionPoint(btnStartPosition)
        this.btnEnd
            .destroyChildren()
            .pushChild(
                new Graphics()
                    .beginFill(0xffffff)
                    .drawRect(-widthParkingLot / 2, 0, widthParkingLot, 40)
                    .endFill(),
            )
            .setPositionPoint(btnEndPosition)

        this.deadZone
            .destroyChildren()
            .pushChild(
                new Graphics()
                    .beginFill(0x44c52a)
                    .drawRect(
                        isLeft ? 0 : widthScreen - widthBoxWide,
                        0,
                        widthBoxWide,
                        heightParking,
                    ) // box wide
                    .drawRect(
                        isLeft ? widthScreen - widthBoxNarrow : 0,
                        0,
                        widthBoxNarrow,
                        heightParking,
                    ) // box narrow
                    .drawRect(0, 0, widthScreen, heightParking - widthParkingLot) // box top
                    .drawRect(
                        isLeft ? widthBoxBottom : 0,
                        btnStartPosition.y,
                        widthBoxBottom,
                        heightParking,
                    ), // box bottom
            )
            .setAlpha(0)
    }
}