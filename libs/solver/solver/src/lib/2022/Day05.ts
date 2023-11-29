/* eslint no-unused-vars: [1,{ "varsIgnorePattern": "_" }]*/
/* eslint-disable no-constant-condition */
// eslint-disable-next-line sort-imports
import { input, output, part } from '../solver';

// part === 1 && output('Part 1');
// part === 2 && output('Part 2');

const littleEndian = (() => {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
  // Int16Array uses the platform's endianness.
  return new Int16Array(buffer)[0] === 256;
})();
// console.log(littleEndian); // true or false
// let input =
// `    [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2`
// console.log("CMZ")
let lineNo = 0,
  noColumns4x: number,
  noCrates = 0;
const iter = input.split('\n').values(),
  crates = [] as string[];
while (true) {
  const { value: line } = iter.next() as { value: string; done: boolean };
  if (line.startsWith(' 1')) continue;
  if (line == '') break;
  lineNo++;
  noColumns4x ??= line.length + 1;
  let s = '';
  for (let i = 1; i < noColumns4x; i += 4) {
    const c = line.charAt(i);
    if (c != ' ') noCrates++;
    s += c;
  }
  crates.push(s);
}
const state = linkCrates(crates, noCrates);
const print = [state.printCrates()];
lineNo = 0;
while (true) {
  const { value: line, done } = iter.next() as { value: string; done: boolean };
  if (done) break;
  if (line == '') continue;
  lineNo++;
  const move = line.match(/move (\d+) from (\d+) to (\d+)/);
  if (!move) throw new Error('Unknown move');
  // move.shift()
  moveCrates(state, +move[1], +move[2] - 1, +move[3] - 1);
  // print.push(state.printCrates())
}
// console.log(print.join(`
// - - - - -
// `))
// console.log(lineNo + "")
// output("CMZ")
output(String.fromCharCode(...Array.from({ length: noColumns4x >> 2 }, (_v, col) => state.crateLabels[state.links[col * 2]])));

function linkCrates(crates: string[], noCrates: number) {
  const noColumns = crates[0].length,
    size = noColumns * 2 + noCrates;
  if (size > 0xff) throw new Error('Too many crates.');
  const links = new Uint8Array(size),
    ascCrates = new Uint8Array(size),
    cratesPerColumn = new Uint8Array(ascCrates.buffer, 0, noColumns),
    iterCratesColumn = function* (col: number) {
      let prev = col * 2 + 1,
        curr = links[prev];
      for (let i = cratesPerColumn[col]; i > 0; i--) {
        yield ascCrates[curr];
        [prev, curr] = [curr, links[curr] ^ prev];
      }
    },
    result = {
      links,
      crateLabels: ascCrates,
      cratesPerColumn,
      wireLinks(...linkPoints: number[]) {
        for (let i = 0; i < linkPoints.length; i++) links[linkPoints.at(i - 1)] ^= linkPoints.at(i - 2) ^ linkPoints.at(i);
      },
      printCrates() {
        return Array.from({ length: noColumns }, (_v, col) => String.fromCharCode(...iterCratesColumn(col))).join('\n');
      },
    };

  {
    const ends = new Uint16Array(links.buffer, 0, noColumns);
    for (let i = 0, v = littleEndian ? 1 : 0x100; i < ends.length; i++, v += 0x202) ends[i] = v;
  }
  {
    let i = noColumns << 1;
    for (const line of crates)
      for (let col = 0; col < noColumns; col++) {
        const crateCode = line.charCodeAt(col) & 0xff;
        if (crateCode == 32) continue;
        ascCrates[i] = crateCode;
        const bottomEnd = col * 2 + 1;
        result.wireLinks(bottomEnd, links[bottomEnd], i);
        cratesPerColumn[col]++;
        i++;
      }
  }
  return result;
}

function iterCratesColumn(quant: number, prev: number, curr?: number) {
  const { links } = state;
  curr ??= links[prev];
  for (let i = quant; i > 0; i--) {
    [prev, curr] = [curr, links[curr] ^ prev];
  }
  return [prev, curr];
}

function moveCrates(
  { links, cratesPerColumn, wireLinks }: { links: Uint8Array; cratesPerColumn: Uint8Array; wireLinks(...linkPoints: number[]): void },
  quantity: number,
  from: number,
  to: number,
) {
  const dif = cratesPerColumn[from] - quantity;
  if (dif < 0) throw new Error('Not enough crates to move');
  let movable: number, imovable: number;
  if (dif < quantity) [imovable, movable] = iterCratesColumn(dif, from * 2 + 1);
  else [movable, imovable] = iterCratesColumn(quantity, from * 2);
  if (part == 1) wireLinks(imovable, movable, to * 2, links[to * 2], links[from * 2], from * 2);
  else wireLinks(imovable, movable, links[to * 2], to * 2, links[from * 2], from * 2);
  // throw new Error('Function not implemented for part 2.');
  cratesPerColumn[from] = dif;
  cratesPerColumn[to] += quantity;
}
// const lines=inp
