import { BaseEvent, Bone, Event, Group, Mesh, Object3D, SkinnedMesh } from 'three'

type IThreeObjectsTypeMap = {
    'Group': Group
    'Bone': Bone
    'Mesh': Mesh
    'SkinnedMesh': SkinnedMesh
}

declare module 'three' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Object3D<E extends BaseEvent = Event> {
        is<TName extends keyof IThreeObjectsTypeMap>(
            typeName: TName
        ): this is IThreeObjectsTypeMap[TName]

        castType<T>(name: string): this is T
    }
}

Object3D.prototype.is = function object3dIs(typeName) {
    return this.type === typeName
}

Object3D.prototype.castType = function object3dCastType(name) {
    return this.name === name
}
