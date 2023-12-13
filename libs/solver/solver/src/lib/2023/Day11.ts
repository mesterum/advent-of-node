import { input, output, part } from '../solver';

const iter = input.split('\n'),
  galaxyReX = /#/g

if (!iter.at(-1)) iter.length--
const horizontalCount = new Uint8ClampedArray(iter[0].length),
  verticalCount = Uint8ClampedArray.from(iter, (line) => {
    let count = 0
    for (; galaxyReX.test(line); count++)
      horizontalCount[galaxyReX.lastIndex - 1]++
    return count
  }),

  allLengths = [verticalCount, horizontalCount].reduce((s, r) => s + r.reduce((p, g) => {
    if (g == 0) { p.dist2Proxima += part === 1 ? 2 : 1000000 }
    else {
      p.prevSum0 += p.dist2Proxima * p.prevGalaxies
      p.prevSum1 += p.prevSum0 * g
      p.dist2Proxima = 1
      p.prevGalaxies += g
    }
    return p
  }, { dist2Proxima: 1, prevGalaxies: 0, prevSum0: 0, prevSum1: 0 }).prevSum1, 0)

output(allLengths);
