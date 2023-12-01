import { input, output, part } from '../solver';

// part === 2 && output('Part 2');

const iter = input.split('\n').values(),
  matchExp = part == 1 ? /\d/g : /on(?=e)|tw(?=o)|th(?=ree)|fo(?=ur)|fi(?=ve)|si(?=x)|se(?=ven)|ei(?=ght)|ni(?=ne)|\d/g,
  // eslint-disable-next-line no-sparse-arrays
  words = [, 'on', 'tw', 'th', 'fo', 'fi', 'si', 'se', 'ei', 'ni'];
let sum = 0;
for (const line of iter) {
  if (line == '') continue;
  const numbers = line.match(matchExp),
    [first, last] = [numbers[0], numbers.at(-1)];
  // output(numbers);
  if (part === 1) {
    sum += +(first + last);
    continue;
  }
  sum += [first, last].reduce((p, v) => p * 10 + (isNaN(+v) ? words.indexOf(v) : +v), 0);
}

output(sum);
