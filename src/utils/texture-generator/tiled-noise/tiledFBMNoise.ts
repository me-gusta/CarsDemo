const shuffle = (array: Uint8Array) => {
    let currentIndex = array.length
    let randomIndex: number

    let temp: number

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--

        temp = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temp
    }

    return array
}

const perm = new Uint8Array(256 * 2)
const dirs = new Array<[number, number]>(256)

for (let i = 0; i < 256; i++) {
    perm[i] = i
    perm[i + 256] = i
    dirs[i] = [
        Math.cos((i * 2 * Math.PI) / 256),
        Math.sin((i * 2 * Math.PI) / 256),
    ]
}
shuffle(perm)

const surflet = (x: number, y: number, per: number, gridX: number, gridY: number) => {
    const distX = Math.abs(x - gridX)
    const distY = Math.abs(y - gridY)
    const polyX = 1 - 6 * distX ** 5 + 15 * distX ** 4 - 10 * distX ** 3
    const polyY = 1 - 6 * distY ** 5 + 15 * distY ** 4 - 10 * distY ** 3
    const hashed = perm[perm[Math.trunc(gridX) % per] + (Math.trunc(gridY) % per)]
    const [dx, dy] = dirs[hashed]
    const grad = (x - gridX) * dx + (y - gridY) * dy
    return polyX * polyY * grad
}

const noise = (x: number, y: number, per: number) => {
    const intX = Math.trunc(x)
    const intY = Math.trunc(y)
    return (
        surflet(x, y, per, intX + 0, intY + 0)
      + surflet(x, y, per, intX + 1, intY + 0)
      + surflet(x, y, per, intX + 0, intY + 1)
      + surflet(x, y, per, intX + 1, intY + 1)
    )
}

const tiledFBMNoise = (x: number, y: number, per: number, octs: number) => {
    let v = 0
    for (let o = 0; o < octs; o++) {
        v += 0.5 ** o * noise(x * 2 ** o, y * 2 ** o, per * 2 ** o)
    }
    return v
}

export default tiledFBMNoise
