/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, output, part } from '../solver';

part === 2 && output('Part 2');

const iter = input.split('\n').values(),
  seeds = (iter.next().value as string).match(/\d+/g)!.map(v => +v),
  rangesToMap = [] as number[][],
  mapped = (seed: number) => {
    for (let iStart = 0, iEnd = rangesToMap.length; iEnd - iStart > 0; ) {
      const iMid = (iStart + iEnd) >> 1,
        [destination, source, length] = rangesToMap[iMid],
        dif = seed - source;
      if (dif < 0) {
        iEnd = iMid;
        continue;
      }
      if (dif >= length) {
        iStart = iMid + 1;
        continue;
      }
      return destination + dif;
    }
    return seed;
  },
  mapSeeds = () => {
    rangesToMap.sort((a, b) => a[1] - b[1]);
    seeds.forEach((seed, idx) => {
      seeds[idx] = mapped(seed);
    });
    rangesToMap.length = 0;
  };
let mapNo = 0;
for (const line of iter) {
  if (line == '') {
    if (mapNo++) mapSeeds();
    iter.next();
    continue;
  }
  rangesToMap.push(line.match(/\d+/g)!.map(v => +v));
}
if (mapNo < 7) mapSeeds();

output(seeds.reduce((m, v) => (m > v ? v : m)));
