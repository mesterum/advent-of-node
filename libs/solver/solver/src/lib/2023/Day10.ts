import { input, output, part } from '../solver';

const iter = input.split('\n'),
  chars = '.L|FJ-7S',
  charsVal = [0, 0x33, 0x50, 0x61, 0x91, 0xa0, 0xc3, 0xf8];

if (iter.at(-1)?.length) iter.push('');
const mazeWidth = iter[0].length + 1,
  mazeHeigth = iter.length,
  maze = new Uint8Array(mazeHeigth * mazeWidth),
  deltas = [-mazeWidth, 1, mazeWidth, -1];

let step = 1, idx = 0, idxS = 0, dir = 0, rightPath = 0;
for (const line of iter) {
  if (line == '') continue;
  for (const char of line) {
    if (char == 'S') idxS = idx;
    maze[idx++] = charsVal[chars.indexOf(char)];
  }
  maze[idx++] = 0;
}
for (dir = 0; dir < 4; dir++) {
  idx = idxS + deltas[dir];
  if (maze[idx] & (1 << ((dir ^ 2) + 4))) break;
}
for (; idx != idxS; step++) {
  const difDir = maze[idx] & 0x3;
  if (part == 2) {
    maze[idx] |= 0x8 //fence
    if (difDir)
      if (dir & 1 ^ difDir >> 1) {
        rightPath--
        maze[idx] |= 0x4
      } else rightPath++
    else maze[idx] |= dir >> 1 ? 0x4 : 0
  }
  dir ^= difDir
  idx += deltas[dir];
}

part === 1 && output(step >> 1);

const inInit = rightPath > 0 ? 0xC : 0x8
step = 0
for (idx = maze.length - mazeWidth; idx > 0;) {
  if ((maze[--idx] & 0x8C) != inInit) continue
  for (; !(maze[--idx] & 0xC); step++);
  idx++
}

output(step)