import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { maxRam } from '../app';

export const sortAndWriteToFile = async (lines: string[], tmpFileNames: string[]) => {
  lines.sort((a, b) => (a > b ? 1 : -1));
  let tmpFileName = `tmp_sort_${tmpFileNames.length}.txt`;
  tmpFileNames.push(tmpFileName);
  await pipeline(
    lines.map((e) => `${e}\n`),
    createWriteStream(tmpFileName, { highWaterMark: maxRam })
  );
  lines.length = 0;
};