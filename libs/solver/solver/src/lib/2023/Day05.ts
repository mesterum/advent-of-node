/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, output, part } from '../solver';

type MappedParams = { (seed: number): number; (seedRange: number[]): number[] };
const iter = input.split('\n').values(),
  seeds = (iter.next().value as string).match(/\d+/g)!.map(v => +v),
  rangesToMap = [] as number[][],
  doRestOfRange = (idx: number, rangeBegin: number, rangeLen: number, soilRange: number[]) => {
    while (idx < rangesToMap.length) {
      const [destination, source, length] = rangesToMap[idx++],
        dif1 = source - rangeBegin;
      if (dif1 > 0) {
        if (rangeLen <= dif1) {
          soilRange.push(rangeBegin, rangeLen);
          return soilRange;
        }
        soilRange.push(rangeBegin, dif1);
        [rangeBegin, rangeLen] = [source, rangeLen - dif1];
      }
      if (rangeLen <= length) {
        soilRange.push(destination, rangeLen);
        return soilRange;
      }
      soilRange.push(destination, length);
      [rangeBegin, rangeLen] = [source + length, rangeLen - length];
    }
    soilRange.push(rangeBegin, rangeLen);
    return soilRange;
  },
  mapped: MappedParams = seed => {
    let rangeBegin: number, rangeLen: number;
    if (typeof seed != 'number') {
      [rangeBegin, rangeLen] = seed;
    } else rangeBegin = seed;
    let iStart = 0;
    for (let iEnd = rangesToMap.length; iEnd - iStart > 0; ) {
      const iMid = (iStart + iEnd) >> 1,
        [destination, source, length] = rangesToMap[iMid],
        dif = rangeBegin - source;
      if (dif < 0) {
        iEnd = iMid;
        continue;
      }
      if (dif >= length) {
        iStart = iMid + 1;
        continue;
      }
      if (typeof seed == 'number') return destination + dif;
      seed[0] = destination + dif;
      const difLen = length - dif;
      //rangeLen + rangeBegin <= length + source;
      if (rangeLen <= difLen) {
        seed[1] = rangeLen;
        return seed;
      }
      seed[1] = difLen;
      return doRestOfRange(iMid + 1, length + source, rangeLen - difLen, seed);
    }
    if (typeof seed == 'number') return seed;
    return doRestOfRange(iStart, rangeBegin, rangeLen, []);
  },
  mapSeeds = () => {
    rangesToMap.sort((a, b) => a[1] - b[1]);
    if (part == 1)
      seeds.forEach((seed, idx) => {
        seeds[idx] = mapped(seed);
      });
    else
      for (let idx = 0; idx < seeds.length - 1; ) {
        const mappedSeeds = mapped([seeds[idx], seeds[idx + 1]]);
        seeds.splice(idx, 2, ...mappedSeeds);
        idx += mappedSeeds.length;
      }
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
if (mapNo < 8) mapSeeds();

part === 1 && output(seeds.reduce((m, v) => (m > v ? v : m)));
part === 2 && output(seeds.reduce((m, v, i) => (i & 1 ? m : m > v ? v : m)));
