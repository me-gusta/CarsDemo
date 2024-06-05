const myType = (obj) => {
    if (obj.isMyType) {
        return obj
    }

    const res = (arg) => obj(arg)
    res.isMyType = true

    return res
}

const data1 = {
    name: 'Alex',
}

const getName = (obj) => obj.name
const log = (...args) => {
    console.log(...args)
    return args[args.length - 1]
}

const pipe = (...fncList) => (
    (arg) => (
        fncList.reduce((acc, fnc) => fnc(acc), arg)
    )
)

const VELIKAYA_LOGIKA = pipe(getName, log)

const myLog = myType(log)
const myGetName = myType(getName)

myLog(myGetName(myType(data1)))

VELIKAYA_LOGIKA(data1)
