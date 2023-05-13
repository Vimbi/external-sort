import * as readline from 'node:readline';
import { createReadStream } from 'fs';
import { maxRam } from '../app';
import { clean } from './clean';
import { sortAndWriteToFile } from './sort-and-write-to-file';
import { merge } from './merge';

export const externalSort = async (fileName: string) => {
  const file = createReadStream(fileName, { highWaterMark: maxRam });
  const rl = readline.createInterface({ input: file, crlfDelay: Infinity });
  const lines: string[] = [];
  let size = 0;
  const tmpFileNames: string[] = [];
  for await (let line of rl) {
    size += line.length;
    lines.push(line);
    if (size > maxRam) {
      await sortAndWriteToFile(lines, tmpFileNames);
      size = 0;
    }
  }
  if (lines.length > 0) {
    await sortAndWriteToFile(lines, tmpFileNames);
  }
  await merge(tmpFileNames, fileName);
  await clean(tmpFileNames);
}