import { input, output, part } from '../solver';

type PrevLine = RegExpMatchArray[][];
const iter = input.split('\n').values(),
  partNoExp = /\d+/g,
  symbolExp = /[^ .\dA-Za-z]/g,
  parseLine = (line: string, prev: PrevLine) => {
    const partNoPrev = [] as RegExpMatchArray[],
      symbolPrev = [] as RegExpMatchArray[],
      partNosFound = [] as number[],
      iters = [
        prev[0].values(), //partNoPrev
        prev[1].values(), //symbolPrev
        line.matchAll(partNoExp), //partNoCrt
        line.matchAll(symbolExp), //symbolCrt
      ],
      itersRes = iters.map(i => i.next()), // as IteratorResult<RegExpMatchArray, never>[],
      itersIndex = itersRes.map(({ value: v, done }, iter) => ({ iter, index: done ? -1 : v.index })).filter(v => v.index >= 0);
    let activeIters = itersRes.reduceRight((p, { done }) => (p << 1) + (done ? 0 : 1), 0);
    while (itersIndex.length > 0) {
      const iterWMinIndex = itersIndex.sort((p, c) => p.index - c.index)[0],
        { value } = itersRes[iterWMinIndex.iter];
      let partNo: string; //, symbolIdx=0
      switch (iterWMinIndex.iter) {
        case 0: //partNoPrev
          partNo = value[0];
          if (8 & activeIters && itersRes[3].value.index <= iterWMinIndex.index + partNo.length) {
            if (itersRes[3].value[0] == '*') itersRes[3].value.push(partNo);
            value[1] = 'f';
          }
          if (part == 1 && value[1] == 'f') partNosFound.push(+partNo);
          if ((itersRes[0] = iters[0].next()).done) {
            activeIters &= 15 - 1;
            itersIndex.shift();
          } else iterWMinIndex.index = itersRes[0].value.index;
          break;
        case 1: //symbolPrev
          if (4 & activeIters && itersRes[2].value.index <= iterWMinIndex.index + 1) {
            if (value[0] == '*') value.push(itersRes[2].value[0]);
            itersRes[2].value[1] = 'f';
          }
          if (part == 2 && value[0] == '*' && value.length == 3) partNosFound.push(value[1] * value[2]);
          if ((itersRes[1] = iters[1].next()).done) {
            activeIters &= 15 - 2;
            itersIndex.shift();
          } else iterWMinIndex.index = itersRes[1].value.index;
          break;
        case 2: //partNoCrt
          partNo = value[0];
          if (8 & activeIters && itersRes[3].value.index == iterWMinIndex.index + partNo.length) {
            if (itersRes[3].value[0] == '*') itersRes[3].value.push(partNo);
            value[1] = 'f';
          }
          if (2 & activeIters && itersRes[1].value.index <= iterWMinIndex.index + partNo.length) {
            if (itersRes[1].value[0] == '*') itersRes[1].value.push(partNo);
            value[1] = 'f';
          }
          partNoPrev.push(value);
          if ((itersRes[2] = iters[2].next()).done) {
            activeIters &= 15 - 4;
            itersIndex.shift();
          } else iterWMinIndex.index = itersRes[2].value.index;
          break;
        case 3: //symbolCrt
          if (4 & activeIters && itersRes[2].value.index == iterWMinIndex.index + 1) {
            if (value[0] == '*') value.push(itersRes[2].value[0]);
            itersRes[2].value[1] = 'f';
          }
          if (1 & activeIters && itersRes[0].value.index <= iterWMinIndex.index + 1) {
            if (value[0] == '*') value.push(itersRes[0].value[0]);
            itersRes[0].value[1] = 'f';
          }
          symbolPrev.push(value);
          if ((itersRes[3] = iters[3].next()).done) {
            activeIters &= 15 - 8;
            itersIndex.shift();
          } else iterWMinIndex.index = itersRes[3].value.index;
          break;
        default:
          break;
      }
    }
    prev[0] = partNoPrev;
    prev[1] = symbolPrev;
    return partNosFound;
  };
let sum = 0;
const prevPartNo_symbol = [[], []] as RegExpMatchArray[][];
for (const line of iter) {
  // if (line == '') continue;
  const partNosFound = parseLine(line, prevPartNo_symbol);
  partNosFound.forEach(v => {
    sum += v;
  });
}

output(sum);
