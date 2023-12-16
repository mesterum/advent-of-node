import { input, output, part } from '../solver';

const iter = input.split('\n'),
  count1s = (n: number) => n == 0 ? 0 : (n & n - 1) == 0 ? 1 : 2,
  parseGroup = (group: string[]) => {
    const
      horizontalCount = new Uint32Array(group[0].length),
      verticalCount = Uint32Array.from(group, (line, i) => {
        let count = 0, idx = 0; const weight = 1 << i
        for (const char of line) {
          if (char == '#') {
            horizontalCount[idx] += weight
            count |= 1 << idx
          } idx++
        }
        return count
      }),
      crosses = [horizontalCount, verticalCount,],
      multipliers = [1, 100]
    for (const idx of [0, 1]) {
      const res = findReflection(crosses[idx])
      if (res > 0) return res * multipliers[idx]
    }
    throw Error(`No mirror at ${firstLineIdx}`)
    // return 0
  },
  findReflection = (patterns: Uint32Array) => {
    const lastIdx = patterns.length - 1
    loop: for (let i = lastIdx >> 1, sign = 1, j = 0; j < lastIdx; i += (sign *= -1) * ++j) {
      let smudges = part - 1
      if ((smudges -= count1s(patterns[i] ^ patterns[i + 1])) < 0) continue
      for (let min = Math.min(i + 1, lastIdx - i) - 1; min > 0; min--)
        if ((smudges -= count1s(patterns[i - min] ^ patterns[i + 1 + min])) < 0) continue loop
      if (smudges == 0) return i + 1
    }
    return 0
  }
let firstLineIdx = 0, nextLineIdx = 0, sum = 0
for (const line of iter) {
  nextLineIdx++
  if (line != "") continue
  sum += parseGroup(iter.slice(firstLineIdx, nextLineIdx - 1))
  firstLineIdx = nextLineIdx
}
if (firstLineIdx < nextLineIdx)
  sum += parseGroup(iter.slice(firstLineIdx, nextLineIdx))

output(sum);
