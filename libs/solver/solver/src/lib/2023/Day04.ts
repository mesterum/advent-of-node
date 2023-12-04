import { input, output, part } from '../solver';

const iter = input.split('\n'),
  cardRExp = /^Card (\d+): */y,
  allCards = Array.from(iter, () => 0);
let totalPoints = 0,
  cardIdx = 0;
for (const line of iter) {
  if (line == '') continue;
  line.match(cardRExp);
  const numbers = line.slice(cardRExp.lastIndex).split(/ +/),
    separator = numbers.indexOf('|'),
    thatIHaveNos = numbers.slice(separator + 1);
  let points = 0;
  for (const winningNo of numbers) {
    if (winningNo == '|') break;
    if (thatIHaveNos.includes(winningNo)) points++;
  }
  cardRExp.lastIndex = 0;
  if (part == 1) {
    if (points--) totalPoints += 1 << points;
    continue;
  }
  const cards = ++allCards[cardIdx];
  for (let i = cardIdx + 1; points && i < allCards.length; points--, i++) allCards[i] += cards;
  cardIdx++;
}

part === 1 && output(totalPoints);
part === 2 && output(allCards.reduce((s, v) => s + v, 0));
