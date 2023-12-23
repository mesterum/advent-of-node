import { input, output, part } from '../solver';

const iter = input.split('\n'),
  encounters = '|/-\\.'

if (!iter.at(-1)) iter.length--
const contraptionWidth = iter[0].length + 1,
  contraptionHeigth = iter.length,
  contraption = new Uint8Array(contraptionHeigth * contraptionWidth),
  deltas = [-contraptionWidth, 1, contraptionWidth, -1],
  beams = [-3]

let idx = 0
for (const line of iter) {
  // if (line == '') continue;
  for (const char of line) {
    contraption[idx++] = encounters.indexOf(char)
  } contraption[idx++] = 5
}

const energize = (firstStep: number) => {
  beams[0] = firstStep
  contraption.forEach((v, i, arr) => { arr[i] = v & 7 })
  let energizedTiles = 0
  for (let beam: number | undefined; (beam = beams.pop()) != null;) {
    let dir = beam & 3, idx = beam >> 2
    for (; ;) {
      idx += deltas[dir];
      if (idx < 0 || idx >= contraption.length) break
      let tile = contraption[idx]
      if (tile == 5) break
      if (!(tile & 8)) {
        energizedTiles++; contraption[idx] |= 8
      } else
        if (!((tile &= 7) & 5) && dir & 1 ^ tile >> 1) break
      if (tile == 4)// '.'
        continue
      if (tile & 1) dir ^= tile // mirror \/
      else if (dir & 1 ^ tile >> 1) { // splitter
        beams.push(idx << 2 ^ dir ^ 1)
        dir ^= 3
      }
    }
  } return energizedTiles
}

part === 1 && output(energize(-3));

let maxEncounters = 0
for (let idx = contraptionWidth - 2; idx >= 0; idx--) {
  let encounter = energize(idx + deltas[0] << 2 ^ 2)
  maxEncounters = maxEncounters < encounter ? encounter : maxEncounters
  encounter = energize(idx + contraptionHeigth * deltas[2] << 2 ^ 0)
  maxEncounters = maxEncounters < encounter ? encounter : maxEncounters
}
for (let idx = (contraptionHeigth - 1) * contraptionWidth; idx >= 0; idx -= contraptionWidth) {
  let encounter = energize(idx + contraptionWidth - 1 << 2 ^ 3)
  maxEncounters = maxEncounters < encounter ? encounter : maxEncounters
  encounter = energize(idx - 1 << 2 ^ 1)
  maxEncounters = maxEncounters < encounter ? encounter : maxEncounters
}
output(maxEncounters)