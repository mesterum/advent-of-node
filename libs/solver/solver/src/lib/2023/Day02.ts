import { input, output, part } from '../solver';

const iter = input.split('\n').values(),
  gameExp = /^Game (\d+): *|(\d+) (red|green|blue)([,;]?) */y,
  bag1 = { red: 12, green: 13, blue: 14 },
  minPossibleBag = { red: 0, green: 0, blue: 0 },
  colorsList = ['red', 'green', 'blue'];
let sum = 0;
for (const line of iter) {
  if (line == '') continue;
  const game = line.match(gameExp);
  let color = line.match(gameExp);
  while (color) {
    const [, , noBags, colour] = color;
    if (part == 1 && bag1[colour] < +noBags) break;
    if (part == 2 && minPossibleBag[colour] < +noBags) minPossibleBag[colour] = +noBags;
    color = line.match(gameExp);
  }
  if (!color)
    if (part == 1) sum += +game[1];
    else {
      sum += Object.values(minPossibleBag).reduce((p, v) => p * v, 1);
      colorsList.forEach(c => (minPossibleBag[c] = 0));
    }
  else {
    gameExp.lastIndex = 0;
  }
}

output(sum);
