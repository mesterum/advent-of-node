/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, output, part } from '../solver';

const iter = input.split('\n').values();
let sum = 0;
for (const line of iter) {
  if (line == '') continue;
  const history = line.match(/-?\d+/g)!.map(v => +v),
    lastValues = [history.at(-1)!],
    firstValues = [history[0]!];
  for (let all0 = false; !all0; ) {
    all0 = true;
    for (let i = 1; i < history.length; i++) {
      const element = history[i] - history[i - 1];
      if (element) all0 = false;
      history[i - 1] = element;
    }
    history.length--;
    part === 1 && lastValues.push(history.at(-1)!);
    part === 2 && firstValues.push(history[0]!);
  }
  sum += part === 1 ? lastValues.reduce((s, v) => s + v) : firstValues.reduceRight((s, v) => v - s);
}

output(sum);
