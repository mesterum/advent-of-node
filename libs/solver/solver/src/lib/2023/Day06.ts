/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, output, part } from '../solver';

const lines = input.split('\n'),
  noWays2BeatRec = (time: number, dist: number) => {
    const delta = time * time - 4 * dist,
      max = Math.floor((time + Math.sqrt(delta - 1)) / 2);
    return 2 * max - time + 1;
  };
if (part === 1) {
  const times = lines[0].match(/\d+/g)!.map(v => +v),
    distances = lines[1].match(/\d+/g)!.map(v => +v);
  output(times.map((time, idx) => noWays2BeatRec(time, distances[idx])).reduce((p, v) => p * v, 1));
} else {
  const time = +lines[0].match(/\d+/g)!.join(''),
    distance = +lines[1].match(/\d+/g)!.join('');
  output(noWays2BeatRec(time, distance));
}
