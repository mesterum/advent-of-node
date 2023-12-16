import { input, output, part } from '../solver';

part === 2 && output('Part 2');

const iter = input.split('\n')
if (!iter.at(-1)) iter.length--
const horizontalCount = new Uint8Array(iter[0].length)
let allWeight = 0
iter.forEach((line, lineIdx) => {
  let idx = -1
  for (const char of line) {
    idx++
    if (char == '.') continue
    if (char == '#') horizontalCount[idx] = lineIdx + 1
    if (char == 'O') allWeight += iter.length - horizontalCount[idx]++
  }
})

part === 1 && output(allWeight);
