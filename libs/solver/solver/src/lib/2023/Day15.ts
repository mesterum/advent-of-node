import { input, output, part } from '../solver';

const iter = input.split(/,|\n/),
  hash = (line: string) => {
    let crtValue = 0
    for (let idx = 0; idx < line.length; idx++)
      crtValue = (crtValue + line.charCodeAt(idx)) * 17 & 0xFF
    return crtValue
  },
  stepReX = /^(\w+)(-|=\d)/,
  lenses = new Map<string, number>(),
  lenses7Box = new Uint16Array(256)

let sum = 0
for (const line of iter) {
  if (line == "") continue
  if (part === 1) {
    sum += hash(line); continue
  }
  const parse = stepReX.exec(line)
  if (!parse) throw Error(`"${line}" is not a valid step`)
  if (parse[2] == '-') lenses.delete(parse[1])
  else lenses.set(parse[1], +parse[2].charAt(1))
}

part === 1 && output(sum);

lenses.forEach((focalLength, label) => {
  const box = hash(label)
  sum += (box + 1) * ++lenses7Box[box] * focalLength
})

output(sum);