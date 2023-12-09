/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { log } from 'console';

import { input, output, part } from '../solver';

const iter = input.split('\n').values(),
  nodeReX = /[A-Z]{3}/g,
  directions = iter.next().value as string,
  map = new Map<string, [string, string]>(),
  ANodes: string[] = [],
  ZNodes: string[] = [],
  countSteps = (node: string, pred: (node: string) => boolean) => {
    let step = 0;
    for (;;)
      for (const dir of directions) {
        node = map.get(node)![dir == 'L' ? 0 : 1];
        step++;
        if (pred(node)) return step;
      }
  };

for (const line of iter) {
  if (line == '') continue;
  const [node, nleft, nright] = line.match(nodeReX)!;
  map.set(node, [nleft, nright]);
  if (part === 1) continue;
  if (node.endsWith('A')) ANodes.push(node);
  if (node.endsWith('Z')) ZNodes.push(node);
}

part === 1 && output(countSteps('AAA', node => node == 'ZZZ'));
// log(ANodes);
// log(ZNodes);
// log(directions.length);
// log(directions);
function meetZNodesFrom(a1Node = ANodes[0]) {
  const A1 = new Map<number, number>();
  let step = 0;
  for (let dirIdx = 0; ; dirIdx++) {
    if (dirIdx == directions.length) dirIdx = 0;
    const dir = directions.charAt(dirIdx);
    a1Node = map.get(a1Node)![dir == 'L' ? 0 : 1];
    step++;
    if (!a1Node.endsWith('Z')) continue;
    const nodeID = dirIdx * ZNodes.length + ZNodes.indexOf(a1Node);
    if (A1.has(nodeID)) {
      // return [A1, nodeID, step - A1.get(nodeID)] as const;
      // log(step == 2 * A1.get(nodeID));
      return step - A1.get(nodeID);
    }
    A1.set(nodeID, step);
  }
}
const zNodesFromANodes = ANodes.map(meetZNodesFrom);
// log(zNodesFromANodes);

part === 2 && output(zNodesFromANodes.reduce(LCM));

function MCD(a: number, b: number) {
  if (b == 0) return a;
  return MCD(b, a % b);
}
function LCM(a: number, b: number) {
  return (a / MCD(a, b)) * b;
}
