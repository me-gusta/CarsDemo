export type ICSSInsetSupportTag = 'env' | 'constant' | ''
export type IAttribute = typeof attrs[number]

const setStyle = (el: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
    Object.keys(style).forEach((key) => { (el as any).style[key] = style[key as any] })
}

const attrs = ['top', 'left', 'right', 'bottom'] as const

export default class SafeAreaInsets {
    static inited = false

    static support: ICSSInsetSupportTag

    static changeAttrs: IAttribute[] = []

    static changeEventListeners: (() => void)[] = []

    static elementComputedStyle = {} as Record<IAttribute, number>

    static getSupport() {
        if (!('CSS' in window) || typeof CSS.supports !== 'function') {
            this.support = ''
        } else
        if (CSS.supports('top: env(safe-area-inset-top)')) {
            this.support = 'env'
        } else
        if (CSS.supports('top: constant(safe-area-inset-top)')) {
            this.support = 'constant'
        } else {
            this.support = ''
        }
        return this.support
    }

    static onChange(callback: () => void) {
        if (!this.getSupport()) return
        if (!this.inited) this.init()
        if (callback) this.changeEventListeners.push(callback)
    }

    static offChange(callback: () => void) {
        const index = this.changeEventListeners.indexOf(callback)
        if (index >= 0) {
            this.changeEventListeners.splice(index, 1)
        }
    }

    static getAttr(attr: IAttribute) {
        if (!this.inited) this.init()
        return this.elementComputedStyle[attr]
    }

    static attrChange(attr: IAttribute) {
        if (!this.changeAttrs.length) {
            setTimeout(() => {
                this.changeAttrs.length = 0
                this.changeEventListeners.forEach((callback) => callback())
            }, 0)
        }
        this.changeAttrs.push(attr)
    }

    static get top() { return this.getAttr('top') }
    static get left() { return this.getAttr('left') }
    static get right() { return this.getAttr('right') }
    static get bottom() { return this.getAttr('bottom') }

    static get isSupported() {
        return (typeof SafeAreaInsets.support === 'string' ? SafeAreaInsets.support : SafeAreaInsets.getSupport()).length !== 0
    }

    static init() {
        this.support = typeof this.support === 'string' ? this.support : this.getSupport()
        if (!this.support) {
            attrs.forEach((attr) => { this.elementComputedStyle[attr] = 0 })
            return
        }

        const parentReadyEventListeners: (() => void)[] = []
        const parentReady = (callback: () => void) => {
            parentReadyEventListeners.push(callback)
        }

        // eslint-disable-next-line no-undef
        let passiveEvents: boolean | AddEventListenerOptions = false
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function getAAA() {
                    passiveEvents = { passive: true }
                    return 0
                },
            })
            window.addEventListener('test', null!, opts)
        } catch (e) { /* empty */ }

        const addChild = (parent: HTMLDivElement, attr: IAttribute) => {
            const a1 = document.createElement('div')
            const a2 = document.createElement('div')
            const a1Children = document.createElement('div')
            const a2Children = document.createElement('div')
            const W = 100
            const MAX = 10000
            const aStyle = {
                position: 'absolute',
                width: `${W}px`,
                height: '200px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                paddingBottom: `${this.support}(safe-area-inset-${attr})`,
            }
            setStyle(a1, aStyle)
            setStyle(a2, aStyle)
            setStyle(a1Children, {
                transition: '0s',
                animation: 'none',
                width: '400px',
                height: '400px',
            })
            setStyle(a2Children, {
                transition: '0s',
                animation: 'none',
                width: '250%',
                height: '250%',
            })
            a1.appendChild(a1Children)
            a2.appendChild(a2Children)
            parent.appendChild(a1)
            parent.appendChild(a2)

            parentReady(() => {
                a1.scrollTop = MAX
                a2.scrollTop = MAX
                let a1LastScrollTop = a1.scrollTop
                let a2LastScrollTop = a2.scrollTop

                const onScroll = (event: { target: HTMLDivElement }) => {
                    const lastScrolltop = (event.target === a1 ? a1LastScrollTop : a2LastScrollTop)
                    if (event.target.scrollTop === lastScrolltop) return

                    a1.scrollTop = MAX
                    a2.scrollTop = MAX
                    a1LastScrollTop = a1.scrollTop
                    a2LastScrollTop = a2.scrollTop
                    this.attrChange(attr)
                }
                a1.addEventListener('scroll', onScroll as any, passiveEvents)
                a2.addEventListener('scroll', onScroll as any, passiveEvents)
            })

            const computedStyle = window.getComputedStyle(a1)
            Object.defineProperty(this.elementComputedStyle, attr, {
                configurable: true,
                get() { return parseFloat(computedStyle.paddingBottom) },
            })
        }

        const parentDiv = document.createElement('div')
        setStyle(parentDiv, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '0',
            height: '0',
            zIndex: '-1',
            overflow: 'hidden',
            visibility: 'hidden',
        })
        attrs.forEach((key) => { addChild(parentDiv, key) })
        document.body.appendChild(parentDiv)
        parentReadyEventListeners.forEach((cb) => cb())

        this.inited = true
    }
}
