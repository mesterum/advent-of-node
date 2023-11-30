import { input, output, part } from '../solver';

let result = 0;
const iter = input.split('\n').values(),
  rootDir = Object.assign(new Map(), { sizeInBytes: 0, unevaledDirs: 0, evaled: false }),
  workingDirs = [rootDir],
  evaledDirs = [],
  processEvaledDirs = (dir: typeof workingDir) => {
    const dirSize = dir.sizeInBytes;
    if (part === 2) evaledDirs.push(dir);
    else if (dirSize < 100_000) result += dirSize;
    dir.evaled = true;
    return dirSize;
  },
  closeLsMode = () => {
    if (workingDir.unevaledDirs == 0) {
      let dirSize = processEvaledDirs(workingDir);
      for (let i = workingDirs.length - 2; i >= 0; i--) {
        const wd = workingDirs[i];
        wd.unevaledDirs--;
        wd.sizeInBytes += dirSize;
        if (wd.unevaledDirs > 0) break;
        dirSize = processEvaledDirs(wd);
      }
    }
    lsMode = false;
  };
let workingDir = rootDir,
  lsMode = false;
for (const line of iter) {
  if (line == '') continue;
  if (line.startsWith('$')) {
    if (lsMode) closeLsMode();
    const command = line.match(/^\$ *(cd|ls) *(.*)/);
    if (command[1] == 'ls') {
      lsMode = true;
      continue;
    }
    switch (command[2]) {
      case '/':
        workingDirs.length = 1;
        workingDir = rootDir;
        break;
      case '..':
        workingDirs.pop();
        workingDir = workingDirs.at(-1);
        break;
      default:
        workingDir = workingDir.get(command[2]);
        if (!workingDir) throw new Error('dir ${command[2]} not found');
        if (workingDir.evaled) throw new Error('dir ${command[2]} was fully scanned');
        workingDirs.push(workingDir);
        break;
    }
    continue;
  }
  const dirItems = line.match(/^(dir|\d+) (.+)/);
  if (dirItems[1] == 'dir') {
    const dir = Object.assign(new Map(), { sizeInBytes: 0, unevaledDirs: 0, evaled: false });
    workingDir.set(dirItems[2], dir);
    workingDir.unevaledDirs++;
    continue;
  }
  const fileSize = +dirItems[1];
  if (isNaN(fileSize)) throw new Error(`file size ${dirItems[1]} is NaN`);
  workingDir.sizeInBytes += fileSize;
}
if (lsMode) closeLsMode();
if (part === 1) output(result);
const threshold = rootDir.sizeInBytes - 40_000_000;
output(evaledDirs.reduce((min, { sizeInBytes: s }) => (s < threshold ? min : s < min ? s : min), rootDir.sizeInBytes));
