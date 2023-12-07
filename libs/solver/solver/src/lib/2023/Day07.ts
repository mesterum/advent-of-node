/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { input, output, part } from '../solver';

type HandType = typeof typeOfHandRank extends (infer T)[] ? T : never;
const iter = input.split('\n'),
  handReX = /^(?<hand>[AKQJT2-9]{5}) (?<bid>\d+)/,
  rank = 'AKQJT98765432',
  rank2 = 'AKQT98765432J',
  count = new Uint8ClampedArray(13),
  typeOfHand = [
    ['five_of_a_kind'],
    ['four_of_a_kind'],
    ['three_of_a_kind', 'full_house'],
    ['one_pair', 'two_pair'],
    ['high_card'],
  ] as const,
  typeOfHandRank = typeOfHand.flatMap(v => v.toReversed()),
  handsPerType = Object.fromEntries(typeOfHandRank.map(v => [v, [] as unknown])) as 
    Record<HandType, Record<'handValue' | 'bid', number>[]>;

for (const line of iter) {
  if (line == '') continue;
  const { hand, bid } = line.match(handReX)!.groups as Record<'hand' | 'bid', string>;
  let handValue = 0;
  for (const card of hand) {
    const v = 12 - (part === 2 ? rank2 : rank).search(card);
    count[v]++;
    handValue = 13 * handValue + v;
  }
  if (part === 2) {
    const jokers = count[0];
    count[0] = 0;
    count.sort((a, b) => b - a);
    count[0] += jokers;
  } else count.sort((a, b) => b - a);
  const handObj = { handValue, bid: +bid },
    prop = typeOfHand[5 - count[0]][count[1] == 2 ? 1 : 0];
  handsPerType[prop].push(handObj);
  count.fill(0);
}

output(
  typeOfHandRank.reduceRight(
    ({ rank, sum }, handType) => {
      handsPerType[handType]
        .sort((a, b) => a.handValue - b.handValue)
        .forEach(v => {
          sum += rank++ * v.bid;
        });
      return { rank, sum };
    },
    { rank: 1, sum: 0 },
  ).sum,
);
