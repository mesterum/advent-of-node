import { input, output, part } from '../solver';

// part === 2 && output('Part 2');

const iter = input.split('\n').values(),
  matchExp = part == 2 ? /one|two|three|four|five|six|seven|eight|nine|\d/g : /\d/g,
  // eslint-disable-next-line no-sparse-arrays
  words = [, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
let sum = 0;
for (const line of iter) {
  if (line == '') continue;
  const numbers = line.match(matchExp);
  // eslint-disable-next-line no-autofix/prefer-const
  let [first, last] = [numbers[0], numbers.at(-1)];
  // output(numbers);
  if (part === 1) {
    sum += +(first + last);
    continue;
  }
  for (let i = line.length - 4; i >= 0; i--) {
    last = line.slice(i).match(matchExp)?.at(-1);
    if (last) break;
  }
  sum += [first, last].reduce((p, v) => p * 10 + (isNaN(+v) ? words.indexOf(v) : +v), 0);
}

output(sum);
