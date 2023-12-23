import { input, output, part } from '../solver';


class Heap<T extends number | bigint | string | boolean> extends Array<T>{
  push(...items: T[]): number {
    let lastIdx = this.length
    for (super.push(...items); lastIdx < this.length;) {
      const element = this[lastIdx++];
      let idx = lastIdx
      for (let nextIdx = lastIdx >> 1; nextIdx > 0; idx = nextIdx, nextIdx >>= 1) {
        if (this[nextIdx - 1] <= element) break
        this[idx - 1] = this[nextIdx - 1]
      } this[idx - 1] = element
    }
    return this.length
  }
  pop(): T | undefined {
    const element = super.pop()
    if (this.length == 0 || element == null)
      return element
    const first = this[0]
    let idx = 1
    for (let nextIdx = 2; nextIdx <= this.length; idx = nextIdx, nextIdx <<= 1) {
      if (nextIdx < this.length && this[nextIdx - 1] > this[nextIdx])
        nextIdx++
      if (this[nextIdx - 1] >= element) break
      this[idx - 1] = this[nextIdx - 1]
    } this[idx - 1] = element
    return first
  }
}

const iter = input.split('\n')

if (!iter.at(-1)) iter.length--
const mapWidth = iter[0].length + 1,
  mapHeigth = iter.length,
  mapSize = mapHeigth * mapWidth,
  hlSpace = mapSize << 2,
  map = new Uint8Array(mapSize),
  deltas = [-mapWidth, 1, mapWidth, -1],
  forks = new Heap<number>(1, 2),
  [minSteps, maxSteps] = part == 1 ? [1, 3] : [4, 10]

let idx = 0

for (const line of iter) {
  for (const char of line) {
    map[idx++] = +char
  } map[idx++] = 0
}

for (let fork: number | undefined; (fork = forks.pop()) != null;) {
  const dir = fork & 3
  let idx = fork % hlSpace, heatLost = fork - idx
  if ((idx >>= 2) == mapSize - 2) {
    output(heatLost / hlSpace)
    break
  }
  if (map[idx] & 16 << dir) continue
  map[idx] |= 16 << dir
  for (let n = 1; n <= maxSteps; n++) {
    idx += deltas[dir];
    if (idx < 0 || idx >= map.length) break
    const tile = map[idx] & 15
    if (tile == 0) break
    heatLost += tile * hlSpace
    if (n < minSteps) continue
    fork = heatLost + (idx << 2 | dir ^ 1)
    forks.push(fork, fork ^ 2)
  }
}
