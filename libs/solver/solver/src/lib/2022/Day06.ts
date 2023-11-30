import { input, output, part } from '../solver';

const distinctLength = part === 2 ? 14 : 4;
let [first, last] = [0, 1];
for (; last - first < distinctLength && last < input.length; last++) {
  const checkedChar = input.charCodeAt(last);
  for (let i = last - 1; i >= first; i--)
    if (checkedChar == input.charCodeAt(i)) {
      first = i + 1;
      break;
    }
}

output(last);
